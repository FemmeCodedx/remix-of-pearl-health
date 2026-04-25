import { useState } from "react";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const customSchema = z
  .string()
  .trim()
  .min(2, "Too short")
  .max(60, "Max 60 characters");

const Chip = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-11 px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-all text-left ${
      selected
        ? "border-primary bg-primary/10 text-primary"
        : "border-border bg-card text-foreground hover:border-primary/40"
    }`}
  >
    {label}
  </button>
);

const CustomChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-magenta/10 text-magenta text-sm font-medium border-2 border-magenta/30">
    {label}
    <button onClick={onRemove} className="ml-0.5" type="button" aria-label={`Remove ${label}`}>
      <X size={14} />
    </button>
  </span>
);

interface ConditionsSectionProps {
  title: string;
  subtitle?: string;
  options: string[];
  labels: Record<string, string>;
  selected: string[];
  custom: string[];
  customPlaceholder: string;
  addLabel: string;
  maxCustom?: number;
  onToggle: (val: string) => void;
  onAddCustom: (val: string) => void;
  onRemoveCustom: (val: string) => void;
}

export const ConditionsSection = ({
  title,
  subtitle,
  options,
  labels,
  selected,
  custom,
  customPlaceholder,
  addLabel,
  maxCustom = 10,
  onToggle,
  onAddCustom,
  onRemoveCustom,
}: ConditionsSectionProps) => {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const result = customSchema.safeParse(draft);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    if (custom.length >= maxCustom) {
      setError(`Max ${maxCustom} custom entries`);
      return;
    }
    if (custom.includes(result.data) || selected.includes(result.data)) {
      setError("Already added");
      return;
    }
    onAddCustom(result.data);
    setDraft("");
    setError(null);
  };

  return (
    <div>
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{title}</Label>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      <div className="flex flex-wrap gap-2 mt-3">
        {options.map((opt) => (
          <Chip
            key={opt}
            label={labels[opt] ?? opt}
            selected={selected.includes(opt)}
            onClick={() => onToggle(opt)}
          />
        ))}
        {custom.map((c) => (
          <CustomChip key={c} label={c} onRemove={() => onRemoveCustom(c)} />
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          placeholder={customPlaceholder}
          maxLength={60}
          className="rounded-xl h-11"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button
          type="button"
          onClick={handleAdd}
          variant="outline"
          className="h-11 rounded-xl shrink-0"
          disabled={!draft.trim()}
        >
          <Plus size={16} className="mr-1" />
          {addLabel}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
