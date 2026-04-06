import { useLocation, useNavigate } from "react-router-dom";
import { Home, Activity, RefreshCw, BookOpen, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();

  const tabs = [
    { path: "/", icon: Home, label: t.home },
    { path: "/track", icon: Activity, label: t.track },
    { path: "/sync", icon: RefreshCw, label: t.sync },
    { path: "/learn", icon: BookOpen, label: t.learn },
    { path: "/community", icon: Users, label: t.community },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full gradient-femme"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon
                size={22}
                className={isActive ? "text-primary" : "text-muted-foreground"}
              />
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
