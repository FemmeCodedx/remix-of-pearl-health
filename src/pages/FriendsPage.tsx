import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, UserPlus, Check, X, Trash2, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { useFriends, type UserSearchResult } from "@/hooks/useFriends";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const FriendsPage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const f = (t as any).friends;
  const { user } = useAuth();
  const { data, save } = useOnboarding();
  const {
    accepted,
    incomingRequests,
    outgoingRequests,
    loading,
    search,
    sendRequest,
    respond,
    remove,
  } = useFriends();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  if (!user) {
    navigate("/auth");
    return null;
  }

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const handle = setTimeout(async () => {
      const res = await search(query);
      setResults(res);
      setSearching(false);
    }, 300);
    return () => clearTimeout(handle);
  }, [query, search]);

  const knownIds = new Set([
    ...accepted.map((x) => x.other_id),
    ...incomingRequests.map((x) => x.other_id),
    ...outgoingRequests.map((x) => x.other_id),
  ]);

  const handleSend = async (id: string) => {
    const { error } = await sendRequest(id);
    if (error) toast.error(error);
    else toast.success(f.requestSent);
  };

  const handleAccept = async (id: string) => {
    const { error } = await respond(id, "accepted");
    if (error) toast.error(error);
    else toast.success(f.requestAccepted);
  };

  const handleDecline = async (id: string) => {
    const { error } = await remove(id);
    if (error) toast.error(error);
  };

  const handleRemove = async (id: string) => {
    const { error } = await remove(id);
    if (error) toast.error(error);
    else toast.success(f.removed);
  };

  return (
    <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          {f.title}
        </h1>
      </div>

      {/* Privacy controls */}
      <div className="rounded-2xl bg-card shadow-card p-4 mb-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{f.shareLabel}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{f.shareDesc}</p>
          </div>
          <Switch
            checked={!!(data as any).share_phase_with_friends}
            onCheckedChange={(v) => save({ share_phase_with_friends: v } as any)}
          />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{f.notifyLabel}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{f.notifyDesc}</p>
          </div>
          <Switch
            checked={(data as any).notif_friend_phase_change !== false}
            onCheckedChange={(v) => save({ notif_friend_phase_change: v } as any)}
          />
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <h2 className="font-display text-base font-semibold mb-2">{f.findFriends}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={f.searchPlaceholder}
            className="rounded-xl pl-9 h-11"
          />
        </div>

        {query.trim().length >= 2 && (
          <div className="mt-3 space-y-2">
            {searching && <Skeleton className="h-14 w-full rounded-xl" />}
            {!searching && results.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3">{f.noResults}</p>
            )}
            {results.map((r) => {
              const isKnown = knownIds.has(r.id);
              const label = r.display_name || r.full_name || r.email || "User";
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-card border border-border"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{label}</p>
                    {r.email && (
                      <p className="text-[11px] text-muted-foreground truncate">{r.email}</p>
                    )}
                  </div>
                  {isKnown ? (
                    <span className="text-xs text-muted-foreground">{f.alreadyConnected}</span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleSend(r.id)}
                      className="rounded-full h-8 gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      {f.add}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Incoming requests */}
      {incomingRequests.length > 0 && (
        <div className="mb-6">
          <h2 className="font-display text-base font-semibold mb-2">
            {f.requests} ({incomingRequests.length})
          </h2>
          <div className="space-y-2">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between gap-2 p-3 rounded-xl bg-card border border-border"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {req.display_name || req.full_name || req.email || "User"}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    onClick={() => handleAccept(req.id)}
                    className="rounded-full h-8 px-3 gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {f.accept}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDecline(req.id)}
                    className="rounded-full h-8 w-8 p-0"
                    aria-label={f.decline}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends list */}
      <h2 className="font-display text-base font-semibold mb-2">
        {f.yourFriends} ({accepted.length})
      </h2>
      {loading ? (
        <Skeleton className="h-16 w-full rounded-xl" />
      ) : accepted.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">{f.empty}</p>
      ) : (
        <div className="space-y-2">
          {accepted.map((fr) => (
            <div
              key={fr.id}
              className="flex items-center justify-between gap-2 p-3 rounded-xl bg-card border border-border"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {fr.display_name || fr.full_name || fr.email || "User"}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemove(fr.id)}
                className="rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                aria-label={f.remove}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {outgoingRequests.length > 0 && (
        <>
          <h2 className="font-display text-base font-semibold mt-6 mb-2">{f.pending}</h2>
          <div className="space-y-2">
            {outgoingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between gap-2 p-3 rounded-xl bg-card border border-border"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {req.display_name || req.full_name || req.email || "User"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{f.awaiting}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemove(req.id)}
                  className="rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  aria-label={f.cancel}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FriendsPage;
