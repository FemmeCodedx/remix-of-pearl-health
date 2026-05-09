import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChefHat, Plus, Trash2, ChevronRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSwanCopy } from "@/lib/i18nSwan";
import { useTierAccess } from "@/hooks/useTierAccess";
import UpgradeGate from "@/components/UpgradeGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ListRow { id: string; name: string; phase: string | null; created_at: string; }
interface RecipeRow { id: string; title: string; ingredients: string[]; notes: string | null; source_url: string | null; }

const RecipesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const c = useSwanCopy();
  const { hasSwan, isLoading: tierLoading } = useTierAccess();
  const { toast } = useToast();

  const [lists, setLists] = useState<ListRow[]>([]);
  const [openList, setOpenList] = useState<ListRow | null>(null);
  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [showNewList, setShowNewList] = useState(false);
  const [listName, setListName] = useState("");
  const [showNewRecipe, setShowNewRecipe] = useState(false);
  const [rTitle, setRTitle] = useState("");
  const [rIng, setRIng] = useState("");
  const [rNotes, setRNotes] = useState("");
  const [rUrl, setRUrl] = useState("");

  useEffect(() => {
    if (!user || !hasSwan) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from("recipe_lists")
        .select("id,name,phase,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setLists((data as ListRow[]) ?? []);
      setLoading(false);
    })();
  }, [user, hasSwan]);

  const loadRecipes = async (list: ListRow) => {
    setOpenList(list);
    const { data } = await supabase
      .from("recipes")
      .select("id,title,ingredients,notes,source_url")
      .eq("list_id", list.id)
      .order("created_at", { ascending: false });
    setRecipes((data as RecipeRow[]) ?? []);
  };

  const createList = async () => {
    if (!user || !listName.trim()) return;
    const { data, error } = await supabase
      .from("recipe_lists")
      .insert({ user_id: user.id, name: listName.trim() })
      .select("id,name,phase,created_at")
      .single();
    if (error) { toast({ title: c.track.saveError, variant: "destructive" }); return; }
    setLists([data as ListRow, ...lists]);
    setListName(""); setShowNewList(false);
  };

  const deleteList = async (id: string) => {
    if (!confirm(c.recipes.deleteList + "?")) return;
    await supabase.from("recipe_lists").delete().eq("id", id);
    setLists((l) => l.filter((x) => x.id !== id));
    if (openList?.id === id) setOpenList(null);
  };

  const addRecipe = async () => {
    if (!user || !openList || !rTitle.trim()) return;
    const ingredients = rIng.split("\n").map((x) => x.trim()).filter(Boolean);
    const { data, error } = await supabase
      .from("recipes")
      .insert({
        user_id: user.id, list_id: openList.id, title: rTitle.trim(),
        ingredients, notes: rNotes || null, source_url: rUrl || null,
      })
      .select("id,title,ingredients,notes,source_url")
      .single();
    if (error) { toast({ title: c.track.saveError, variant: "destructive" }); return; }
    setRecipes([data as RecipeRow, ...recipes]);
    setRTitle(""); setRIng(""); setRNotes(""); setRUrl(""); setShowNewRecipe(false);
  };

  const deleteRecipe = async (id: string) => {
    await supabase.from("recipes").delete().eq("id", id);
    setRecipes((r) => r.filter((x) => x.id !== id));
  };

  const listView = (
    <div>
      <div className="flex justify-end mb-3">
        <Button onClick={() => setShowNewList(true)} className="gradient-femme text-primary-foreground rounded-xl">
          <Plus size={16} className="mr-1" /> {c.recipes.newList}
        </Button>
      </div>
      {showNewList && (
        <div className="mb-4 p-4 rounded-2xl bg-card shadow-card space-y-2">
          <Input placeholder={c.recipes.listNamePh} value={listName} onChange={(e) => setListName(e.target.value)} />
          <div className="flex gap-2">
            <Button size="sm" onClick={createList}>{c.save}</Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowNewList(false); setListName(""); }}>{c.cancel}</Button>
          </div>
        </div>
      )}
      {lists.length === 0 ? (
        <div className="text-center py-10 px-5 bg-card rounded-2xl shadow-card text-sm text-muted-foreground">
          {c.recipes.listsEmpty}
        </div>
      ) : (
        <div className="space-y-2">
          {lists.map((l) => (
            <button key={l.id} onClick={() => loadRecipes(l)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card shadow-card hover:shadow-soft text-left">
              <ChefHat size={20} className="text-primary" />
              <span className="flex-1 font-display font-semibold text-foreground truncate">{l.name}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const detailView = openList && (
    <div>
      <button onClick={() => setOpenList(null)} className="mb-3 flex items-center gap-1 text-sm text-primary">
        <ArrowLeft size={14} /> {c.back}
      </button>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground truncate">{openList.name}</h2>
        <button onClick={() => deleteList(openList.id)} className="text-destructive p-2"><Trash2 size={16} /></button>
      </div>
      <Button onClick={() => setShowNewRecipe(!showNewRecipe)} className="w-full mb-3 gradient-femme text-primary-foreground rounded-xl">
        <Plus size={16} className="mr-1" /> {c.recipes.addRecipe}
      </Button>
      {showNewRecipe && (
        <div className="mb-4 p-4 rounded-2xl bg-card shadow-card space-y-2">
          <Input placeholder={c.recipes.recipeTitlePh} value={rTitle} onChange={(e) => setRTitle(e.target.value)} />
          <Textarea placeholder={c.recipes.ingredientsPh} value={rIng} onChange={(e) => setRIng(e.target.value)} rows={4} />
          <Textarea placeholder={c.recipes.notesPh} value={rNotes} onChange={(e) => setRNotes(e.target.value)} rows={2} />
          <Input placeholder={c.recipes.sourcePh} value={rUrl} onChange={(e) => setRUrl(e.target.value)} />
          <div className="flex gap-2">
            <Button size="sm" onClick={addRecipe}>{c.save}</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowNewRecipe(false)}>{c.cancel}</Button>
          </div>
        </div>
      )}
      {recipes.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">{c.recipes.listEmpty}</div>
      ) : (
        <div className="space-y-3">
          {recipes.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-card shadow-card">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-display font-bold text-foreground flex-1">{r.title}</h3>
                <button onClick={() => deleteRecipe(r.id)} className="text-destructive p-1"><Trash2 size={14} /></button>
              </div>
              {r.ingredients.length > 0 && (
                <ul className="text-sm font-body text-foreground/80 list-disc pl-5 mb-2">
                  {r.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
                </ul>
              )}
              {r.notes && <p className="text-sm text-muted-foreground italic">{r.notes}</p>}
              {r.source_url && (
                <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline mt-1 inline-block">
                  {c.recipes.sourcePh.replace(" (optional)", "")}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const content = loading ? (
    <div className="text-center text-sm text-muted-foreground py-12">{c.loading}</div>
  ) : openList ? detailView : listView;

  return (
    <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-primary" /> {c.recipes.title}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground font-body mb-5 ml-13">{c.recipes.subtitle}</p>

      {tierLoading ? <div className="text-center text-sm text-muted-foreground py-12">{c.loading}</div> :
        hasSwan ? content : (
          <UpgradeGate required="swan" featureName={c.recipes.title} description={c.recipes.subtitle}>
            {content}
          </UpgradeGate>
        )}
    </div>
  );
};

export default RecipesPage;
