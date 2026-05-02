import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type FriendshipStatus = "pending" | "accepted" | "blocked";

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendshipStatus;
  other_id: string;
  display_name: string | null;
  email: string | null;
  full_name: string | null;
  is_incoming: boolean; // pending request directed AT me
}

export interface UserSearchResult {
  id: string;
  display_name: string | null;
  full_name: string | null;
  email: string | null;
}

export const useFriends = () => {
  const { user } = useAuth();
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user) {
      setFriendships([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: rows } = await supabase
      .from("friendships" as any)
      .select("*")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    const otherIds = (rows ?? []).map((r: any) =>
      r.requester_id === user.id ? r.addressee_id : r.requester_id,
    );

    let profilesById: Record<string, any> = {};
    if (otherIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, full_name, email")
        .in("id", otherIds);
      profilesById = Object.fromEntries((profs ?? []).map((p: any) => [p.id, p]));
    }

    const enriched: Friendship[] = (rows ?? []).map((r: any) => {
      const otherId = r.requester_id === user.id ? r.addressee_id : r.requester_id;
      const p = profilesById[otherId] ?? {};
      return {
        id: r.id,
        requester_id: r.requester_id,
        addressee_id: r.addressee_id,
        status: r.status,
        other_id: otherId,
        display_name: p.display_name ?? null,
        full_name: p.full_name ?? null,
        email: p.email ?? null,
        is_incoming: r.status === "pending" && r.addressee_id === user.id,
      };
    });
    setFriendships(enriched);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const search = useCallback(
    async (query: string): Promise<UserSearchResult[]> => {
      const trimmed = query.trim();
      if (trimmed.length < 2) return [];
      const { data, error } = await supabase.rpc("search_users_for_friends" as any, {
        search_query: trimmed,
      });
      if (error) return [];
      return (data ?? []) as UserSearchResult[];
    },
    [],
  );

  const sendRequest = useCallback(
    async (addresseeId: string) => {
      if (!user) return { error: "Not signed in" };
      const { error } = await supabase
        .from("friendships" as any)
        .insert({ requester_id: user.id, addressee_id: addresseeId, status: "pending" } as any);
      await refetch();
      return { error: error?.message ?? null };
    },
    [user, refetch],
  );

  const respond = useCallback(
    async (friendshipId: string, status: "accepted" | "blocked") => {
      const { error } = await supabase
        .from("friendships" as any)
        .update({ status } as any)
        .eq("id", friendshipId);
      await refetch();
      return { error: error?.message ?? null };
    },
    [refetch],
  );

  const remove = useCallback(
    async (friendshipId: string) => {
      const { error } = await supabase.from("friendships" as any).delete().eq("id", friendshipId);
      await refetch();
      return { error: error?.message ?? null };
    },
    [refetch],
  );

  const accepted = friendships.filter((f) => f.status === "accepted");
  const incomingRequests = friendships.filter((f) => f.is_incoming);
  const outgoingRequests = friendships.filter(
    (f) => f.status === "pending" && !f.is_incoming,
  );

  return {
    friendships,
    accepted,
    incomingRequests,
    outgoingRequests,
    loading,
    refetch,
    search,
    sendRequest,
    respond,
    remove,
  };
};
