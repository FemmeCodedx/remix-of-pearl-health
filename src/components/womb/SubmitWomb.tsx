import { useState } from "react";
import { z } from "zod";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Abortion access intentionally excluded — curated only
const SUBMITTABLE = ["period_care", "midwife_doula", "fertility", "nutrition"] as const;

const resourceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(600),
  why_recommended: z.string().trim().min(10).max(500),
  website_url: z.string().trim().url().max(300).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  category: z.enum(SUBMITTABLE),
});

const providerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.enum(SUBMITTABLE),
  address: z.string().trim().min(5).max(200),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(100),
  postal_code: z.string().trim().min(3).max(15),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  website_url: z.string().trim().url().max(300).optional().or(z.literal("")),
});

const SubmitWomb = () => {
  const { t, lang } = useI18n();
  const w = (t as any).womb;
  const { toast } = useToast();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [resource, setResource] = useState({
    name: "",
    description: "",
    why_recommended: "",
    website_url: "",
    phone: "",
    category: "midwife_doula" as typeof SUBMITTABLE[number],
  });

  const [provider, setProvider] = useState({
    name: "",
    category: "midwife_doula" as typeof SUBMITTABLE[number],
    address: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
    website_url: "",
  });

  const submitResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const r = resourceSchema.safeParse(resource);
    if (!r.success) {
      toast({ title: "Please complete all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const slug = `${r.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const { error } = await supabase.from("womb_care_resources" as any).insert({
      ...r.data,
      slug,
      website_url: r.data.website_url || null,
      phone: r.data.phone || null,
      submitted_by: user.id,
      approved: false,
      is_curated: false,
      lang,
    } as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: w.submittedToast, description: w.submittedToastDesc });
      setResource({
        name: "",
        description: "",
        why_recommended: "",
        website_url: "",
        phone: "",
        category: "midwife_doula",
      });
    }
  };

  const submitProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const r = providerSchema.safeParse(provider);
    if (!r.success) {
      toast({ title: "Please complete all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("womb_care_local_providers" as any).insert({
      ...r.data,
      phone: r.data.phone || null,
      website_url: r.data.website_url || null,
      submitted_by: user.id,
      approved: false,
    } as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: w.submittedToast, description: w.submittedToastDesc });
      setProvider({
        name: "",
        category: "midwife_doula",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        phone: "",
        website_url: "",
      });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{w.submitTabIntro}</p>
      <p className="text-xs text-muted-foreground bg-muted/50 rounded-xl p-3">
        {w.abortionExcluded}
      </p>

      <Tabs defaultValue="resource">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="resource">{w.submitResource}</TabsTrigger>
          <TabsTrigger value="provider">{w.submitProvider}</TabsTrigger>
        </TabsList>

        <TabsContent value="resource">
          <form onSubmit={submitResource} className="space-y-3 mt-3">
            <div className="space-y-1.5">
              <Label>{w.formName}</Label>
              <Input
                value={resource.name}
                onChange={(e) => setResource({ ...resource, name: e.target.value })}
                maxLength={120}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{w.formCategory}</Label>
              <div className="flex flex-wrap gap-2">
                {SUBMITTABLE.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setResource({ ...resource, category: cat })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 ${
                      resource.category === cat
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card"
                    }`}
                  >
                    {w.categories[cat]}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{w.formDescription}</Label>
              <Textarea
                value={resource.description}
                onChange={(e) => setResource({ ...resource, description: e.target.value })}
                maxLength={600}
                className="rounded-xl min-h-[80px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{w.formWhy}</Label>
              <Textarea
                value={resource.why_recommended}
                onChange={(e) =>
                  setResource({ ...resource, why_recommended: e.target.value })
                }
                maxLength={500}
                className="rounded-xl min-h-[70px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{w.formWebsite}</Label>
              <Input
                type="url"
                value={resource.website_url}
                onChange={(e) => setResource({ ...resource, website_url: e.target.value })}
                placeholder="https://"
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{w.formPhone}</Label>
              <Input
                value={resource.phone}
                onChange={(e) => setResource({ ...resource, phone: e.target.value })}
                maxLength={30}
                className="rounded-xl h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold"
            >
              {w.formSubmit}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="provider">
          <form onSubmit={submitProvider} className="space-y-3 mt-3">
            <div className="space-y-1.5">
              <Label>{w.formName}</Label>
              <Input
                value={provider.name}
                onChange={(e) => setProvider({ ...provider, name: e.target.value })}
                maxLength={120}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{w.formCategory}</Label>
              <div className="flex flex-wrap gap-2">
                {SUBMITTABLE.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setProvider({ ...provider, category: cat })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 ${
                      provider.category === cat
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card"
                    }`}
                  >
                    {w.categories[cat]}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{w.formAddress}</Label>
              <Input
                value={provider.address}
                onChange={(e) => setProvider({ ...provider, address: e.target.value })}
                maxLength={200}
                className="rounded-xl h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label>{w.formCity}</Label>
                <Input
                  value={provider.city}
                  onChange={(e) => setProvider({ ...provider, city: e.target.value })}
                  maxLength={100}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{w.formState}</Label>
                <Input
                  value={provider.state}
                  onChange={(e) => setProvider({ ...provider, state: e.target.value })}
                  maxLength={100}
                  className="rounded-xl h-11"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{w.formZip}</Label>
              <Input
                value={provider.postal_code}
                onChange={(e) => setProvider({ ...provider, postal_code: e.target.value })}
                maxLength={15}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{w.formPhone}</Label>
              <Input
                value={provider.phone}
                onChange={(e) => setProvider({ ...provider, phone: e.target.value })}
                maxLength={30}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{w.formWebsite}</Label>
              <Input
                type="url"
                value={provider.website_url}
                onChange={(e) => setProvider({ ...provider, website_url: e.target.value })}
                placeholder="https://"
                className="rounded-xl h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold"
            >
              {w.formSubmit}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubmitWomb;
