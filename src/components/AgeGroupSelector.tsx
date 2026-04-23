import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const AGE_GROUPS = ["12-16", "17-24", "25-30", "30-35", "35-45", "45-55", "55-65"] as const;

interface AgeGroupSelectorProps {
  open: boolean;
  onClose: () => void;
}

const AgeGroupSelector = ({ open, onClose }: AgeGroupSelectorProps) => {
  const { t } = useI18n();
  const { user, ageGroup, setAgeGroup } = useAuth();
  const [selected, setSelected] = useState<string | null>(ageGroup);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selected || !user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ age_group: selected } as any)
      .eq("id", user.id);

    if (error) {
      toast({ title: t.error || "Error", description: error.message, variant: "destructive" });
    } else {
      setAgeGroup(selected);
      toast({ title: t.saved || "Saved!", description: t.ageGroupUpdated || "Your age group has been updated." });
      onClose();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{t.selectAgeGroup}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {t.ageGroupDesc}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {AGE_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => setSelected(group)}
              className={`py-3 px-4 rounded-2xl text-sm font-semibold transition-all border-2 ${
                selected === group
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {(t[`age_${group.replace("-", "_")}` as keyof typeof t] as string) || `${group} ${t.years || "years"}`}
            </button>
          ))}
        </div>

        <Button
          onClick={handleSave}
          disabled={!selected || saving}
          className="w-full mt-4 rounded-2xl gradient-primary text-white font-semibold"
        >
          {saving ? "..." : t.save || "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AgeGroupSelector;
