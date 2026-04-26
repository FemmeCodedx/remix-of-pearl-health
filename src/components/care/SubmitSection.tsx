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

const CATEGORIES = ["period", "wash", "lube", "postpartum"] as const;

const brandSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(500),
  why_clean: z.string().trim().min(10).max(500),
  website_url: z.string().trim().url().max(300).optional().or(z.literal("")),
  category: z.enum(CATEGORIES),
});

const shopSchema = z.object({
  name: z.string().trim().min(2).max(120),
  address: z.string().trim().min(5).max(200),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(100),
  postal_code: z.string().trim().min(3).max(15),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  website_url: z.string().trim().url().max(300).optional().or(z.literal("")),
});

const SubmitSection = () => {
  const { t } = useI18n();
  const c = (t as any).care;
  const { toast } = useToast();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  // Brand form
  const [brand, setBrand] = useState({
    name: "",
    description: "",
    why_clean: "",
    website_url: "",
    category: "period" as typeof CATEGORIES[number],
  });

  // Shop form
  const [shop, setShop] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
    website_url: "",
  });

  const submitBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const result = brandSchema.safeParse(brand);
    if (!result.success) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const slug = `${result.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const { error } = await supabase.from("care_brands").insert({
      ...result.data,
      slug,
      website_url: result.data.website_url || null,
      submitted_by: user.id,
      approved: false,
      is_curated: false,
    } as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: c.submittedToast, description: c.submittedToastDesc });
      setBrand({ name: "", description: "", why_clean: "", website_url: "", category: "period" });
    }
  };

  const submitShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const result = shopSchema.safeParse(shop);
    if (!result.success) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("care_local_shops").insert({
      ...result.data,
      phone: result.data.phone || null,
      website_url: result.data.website_url || null,
      submitted_by: user.id,
      approved: false,
    } as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: c.submittedToast, description: c.submittedToastDesc });
      setShop({ name: "", address: "", city: "", state: "", postal_code: "", phone: "", website_url: "" });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{c.submitTabIntro}</p>

      <Tabs defaultValue="brand">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="brand">{c.submitBrand}</TabsTrigger>
          <TabsTrigger value="shop">{c.submitShop}</TabsTrigger>
        </TabsList>

        <TabsContent value="brand">
          <form onSubmit={submitBrand} className="space-y-3 mt-3">
            <div className="space-y-1.5">
              <Label>{c.formName}</Label>
              <Input value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} maxLength={80} className="rounded-xl h-11" />
            </div>
            <div className="space-y-1.5">
              <Label>{c.formCategory}</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setBrand({ ...brand, category: cat })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 ${
                      brand.category === cat ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
                    }`}
                  >
                    {c.categories[cat]}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{c.formDescription}</Label>
              <Textarea value={brand.description} onChange={(e) => setBrand({ ...brand, description: e.target.value })} maxLength={500} className="rounded-xl min-h-[80px]" />
            </div>
            <div className="space-y-1.5">
              <Label>{c.formWhyClean}</Label>
              <Textarea value={brand.why_clean} onChange={(e) => setBrand({ ...brand, why_clean: e.target.value })} maxLength={500} className="rounded-xl min-h-[80px]" />
            </div>
            <div className="space-y-1.5">
              <Label>{c.formWebsite}</Label>
              <Input type="url" value={brand.website_url} onChange={(e) => setBrand({ ...brand, website_url: e.target.value })} placeholder="https://" className="rounded-xl h-11" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold">
              {c.formSubmit}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="shop">
          <form onSubmit={submitShop} className="space-y-3 mt-3">
            <div className="space-y-1.5">
              <Label>{c.formName}</Label>
              <Input value={shop.name} onChange={(e) => setShop({ ...shop, name: e.target.value })} maxLength={120} className="rounded-xl h-11" />
            </div>
            <div className="space-y-1.5">
              <Label>{c.formAddress}</Label>
              <Input value={shop.address} onChange={(e) => setShop({ ...shop, address: e.target.value })} maxLength={200} className="rounded-xl h-11" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label>{c.formCity}</Label>
                <Input value={shop.city} onChange={(e) => setShop({ ...shop, city: e.target.value })} maxLength={100} className="rounded-xl h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>{c.formState}</Label>
                <Input value={shop.state} onChange={(e) => setShop({ ...shop, state: e.target.value })} maxLength={100} className="rounded-xl h-11" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{c.formZip}</Label>
              <Input value={shop.postal_code} onChange={(e) => setShop({ ...shop, postal_code: e.target.value })} maxLength={15} className="rounded-xl h-11" />
            </div>
            <div className="space-y-1.5">
              <Label>{c.formWebsite}</Label>
              <Input type="url" value={shop.website_url} onChange={(e) => setShop({ ...shop, website_url: e.target.value })} placeholder="https://" className="rounded-xl h-11" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-12 rounded-2xl gradient-femme text-primary-foreground font-semibold">
              {c.formSubmit}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubmitSection;
