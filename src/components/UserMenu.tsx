import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";

const tierBadge: Record<string, { label: string; className: string }> = {
  pearl: { label: "Pearl", className: "bg-pearl text-foreground" },
  swan: { label: "Swan", className: "gradient-femme text-primary-foreground" },
  ruby: { label: "Ruby", className: "bg-destructive text-destructive-foreground" },
};

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { data: subscription } = useSubscription();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/auth")}
        className="gap-1.5 font-body text-xs"
      >
        <LogIn size={16} />
        Sign In
      </Button>
    );
  }

  const badge = tierBadge[subscription?.tier ?? "pearl"];

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate("/pricing")}
        className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-body ${badge.className}`}
      >
        {badge.label}
      </button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/profile")}
        className="h-8 w-8"
        aria-label="Profile"
      >
        <User size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={signOut}
        className="h-8 w-8"
        aria-label="Sign out"
      >
        <LogOut size={16} />
      </Button>
    </div>
  );
};

export default UserMenu;
