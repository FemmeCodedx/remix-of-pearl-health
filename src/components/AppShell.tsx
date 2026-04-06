import { ReactNode } from "react";
import BottomNav from "./BottomNav";

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen max-w-lg mx-auto relative bg-background">
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
};

export default AppShell;
