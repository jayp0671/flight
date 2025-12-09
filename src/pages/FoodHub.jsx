import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * FoodHub.jsx — single-file page (styles + logic)
 * - Drop into: src/pages/FoodHub.jsx
 * - Uses: process.env.REACT_APP_SPOONACULAR_KEY (client-side)
 */

export default function FoodHub() {
  return (
    <>
      <StyleBlock />
      <FoodHubInner />
    </>
  );
}

/* ------------------------------ Styles ------------------------------ */

function StyleBlock() {
  return (
    <style>{`
      :root {
        --bg: #0b0f14;
        --card: rgba(255,255,255,0.06);
        --card-strong: rgba(255,255,255,0.12);
        --border: rgba(255,255,255,0.14);
        --text: #e8eef7;
        --muted: #a8b3c7;
        --accent: #8ab4ff;
        --accent-2: #ffb86b;
        --good: #46d38d;
        --bad: #ff6b7a;
        --warn: #ffd166;
        --shadow: 0 10px 30px rgba(0,0,0,0.35);
        --radius: 16px;
        --radius-sm: 12px;
        --radius-lg: 22px;
        --glass: blur(10px) saturate(130%);
        --container: 1100px;
      }

      .foodhub {
        color: var(--text);
        background: radial-gradient(1200px 600px at 10% -10%, rgba(138,180,255,0.15), transparent 60%),
                    radial-gradient(800px 500px at 90% -10%, rgba(255,184,107,0.1), transparent 60%),
                    var(--bg);
        min-height: calc(100dvh - 80px); /* account for your universal header height */
        padding: 24px 16px 80px;
      }

      .container {
        max-width: var(--container);
        margin: 0 auto;
      }

      .hero {
        background: var(--card);
        backdrop-filter: var(--glass);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 22px 20px;
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .hero h1 {
        margin: 0;
        font-size: 28px;
        letter-spacing: 0.3px;
      }
      .hero .sub {
        margin-top: 4px;
        color: var(--muted);
        font-size: 14px;
      }
      .hero .actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .btn {
        appearance: none;
        border: 1px solid var(--border);
        background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
        color: var(--text);
        padding: 10px 14px;
        border-radius: 999px;
        cursor: pointer;
        transition: transform .08s ease, border-color .2s ease, background .2s ease;
      }
      .btn:hover { transform: translateY(-1px); border-color: rgba(255,255,255,0.28); }
      .btn.accent { border-color: rgba(138,180,255,0.45); }
      .btn.good { border-color: rgba(70,211,141,0.45); }
      .btn.bad { border-color: rgba(255,107,122,0.45); }

      .tabs {
        position: sticky;
        top: 64px; /* sits under your universal navbar */
        z-index: 2;
        margin: 14px 0 18px;
        background: linear-gradient(to bottom, rgba(11,15,20,0.95), rgba(11,15,20,0.6));
        backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--border);
      }
      .tabbar {
        display: flex;
        gap: 8px;
        padding: 8px;
        max-width: var(--container);
        margin: 0 auto;
      }
      .tab {
        padding: 10px 14px;
        border-radius: 999px;
        color: var(--muted);
        border: 1px solid transparent;
        cursor: pointer;
      }
      .tab.active {
        color: var(--text);
        border-color: var(--border);
        background: var(--card);
      }

      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
      }
      @media (max-width: 900px) {
        .grid-2 { grid-template-columns: 1fr; }
        .grid-3 { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 620px) {
        .grid-3 { grid-template-columns: 1fr; }
      }

      .card {
        background: var(--card);
        backdrop-filter: var(--glass);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
      }
      .card.pad { padding: 16px; }

      .section-title {
        margin: 0 0 12px;
        font-size: 18px;
      }

      .inline {
        display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
      }

      .chip {
        border: 1px solid var(--border);
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        color: var(--muted);
      }
      .chip.on { color: var(--text); border-color: rgba(138,180,255,0.5); }
      .tag {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 999px;
        border: 1px solid var(--border);
        font-size: 11px;
        color: var(--muted);
        margin-right: 6px;
      }
      .kpi { color: var(--muted); font-size: 12px; }

      .input, .select, .textarea {
        width: 100%;
        background: rgba(255,255,255,0.04);
        color: var(--text);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 10px 12px;
        outline: none;
      }
      .textarea { min-height: 110px; resize: vertical; }

      .list {
        display: grid; gap: 8px;
      }
      .todo {
        display: grid;
        grid-template-columns: 28px 1fr auto;
        gap: 10px;
        align-items: center;
        padding: 10px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
      }
      .todo.done { opacity: 0.65; }
      .todo h4 { margin: 0; font-size: 15px; }
      .todo .note { color: var(--muted); font-size: 12px; margin-top: 2px; }

      .rgrid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
      .rcard {
        border: 1px solid var(--border);
        border-radius: 14px;
        overflow: hidden;
        cursor: pointer;
        background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
        transition: transform .08s ease, border-color .2s ease;
      }
      .rcard:hover { transform: translateY(-2px); border-color: rgba(138,180,255,0.45); }
      .rcard img { width: 100%; height: 140px; object-fit: cover; background: #0a0d11; }
      .rcard .rcard-body { padding: 10px; }
      .rcard .title { font-size: 14px; line-height: 1.2; min-height: 34px; }
      .rcard .meta { color: var(--muted); font-size: 12px; margin-top: 6px; }

      .toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

      .modal-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,0.55);
        display: flex; align-items: center; justify-content: center;
        z-index: 50;
      }
      .modal {
        background: var(--card);
        backdrop-filter: var(--glass);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: var(--shadow);
        width: min(860px, 92vw);
        max-height: 86vh;
        overflow: auto;
      }
      .modal .header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 16px; border-bottom: 1px solid var(--border);
      }
      .modal .content { padding: 14px 16px; display: grid; gap: 14px; }
      .cols { display: grid; gap: 14px; grid-template-columns: 1.2fr 1fr; }
      @media (max-width: 820px) { .cols { grid-template-columns: 1fr; } }
      .ing { display: grid; gap: 6px; }
      .step { border-left: 2px solid var(--accent); padding-left: 10px; margin: 8px 0; }

      .empty {
        text-align: center; color: var(--muted); padding: 20px 8px;
      }
      .sep { height: 1px; background: var(--border); margin: 10px 0; }

      .right { text-align: right; }
      .sm { font-size: 12px; color: var(--muted); }
      .mt8 { margin-top: 8px; }
      .mt12 { margin-top: 12px; }
      .mt16 { margin-top: 16px; }
      .mt20 { margin-top: 20px; }
      .gap8 { display: grid; gap: 8px; }
      .gap12 { display: grid; gap: 12px; }
      .row { display: flex; gap: 8px; align-items: center; }
      .row-spread { display: flex; gap: 8px; align-items: center; justify-content: space-between; }
      .pill { padding: 6px 10px; border:1px solid var(--border); border-radius: 999px; font-size: 12px; }
      .danger { color: var(--bad); }
      .success { color: var(--good); }
    `}</style>
  );
}

/* ------------------------------ Helpers ------------------------------ */

const LS = {
  todos: "foodhub_todos_v1",
  favorites: "foodhub_favorites_v1",
  custom: "foodhub_custom_recipes_v1",
  shopping: "foodhub_shopping_v1",
};

const API_KEY = process.env.REACT_APP_SPOONACULAR_KEY || "";
const BASE = "https://api.spoonacular.com/recipes";

function useHashTab(defaultTab) {
  const [tab, setTab] = useState(() => window.location.hash.replace("#", "") || defaultTab);
  useEffect(() => {
    const handler = () => setTab(window.location.hash.replace("#", "") || defaultTab);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, [defaultTab]);
  return [tab, (t) => { window.location.hash = t; setTab(t);}];
}

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ------------------------------ Main Page ------------------------------ */

function FoodHubInner() {
  const [tab, setTab] = useHashTab("todo");

  // To‑Dos
  const [todos, setTodos] = useLocalStorage(LS.todos, {
    places: [],
    makes: [],
  });

  // Favorites + Custom + Shopping
  const [favorites, setFavorites] = useLocalStorage(LS.favorites, []);
  const [customRecipes, setCustomRecipes] = useLocalStorage(LS.custom, []);
  const [shopping, setShopping] = useLocalStorage(LS.shopping, []);

  // Search (API)
  const [q, setQ] = useState("");
  const [veg, setVeg] = useState(true);
  const [noEggs, setNoEggs] = useState(true);
  const [maxTime, setMaxTime] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Modal (recipe details)
  const [openId, setOpenId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Derived
  const apiOk = !!API_KEY;

  /* -------------------- Actions: To‑Do -------------------- */
  const addTodo = (type, title, note = "", priority = 2, tags = []) => {
    const entry = { id: uid(), type, title, note, priority, tags, done: false, createdAt: Date.now() };
    setTodos((prev) => ({ ...prev, [type === "place" ? "places" : "makes"]: [entry, ...prev[type === "place" ? "places" : "makes"]] }));
  };
  const toggleTodo = (type, id) => {
    setTodos((prev) => {
      const key = type === "place" ? "places" : "makes";
      return { ...prev, [key]: prev[key].map(t => t.id === id ? { ...t, done: !t.done } : t) };
    });
  };
  const removeTodo = (type, id) => {
    setTodos((prev) => {
      const key = type === "place" ? "places" : "makes";
      return { ...prev, [key]: prev[key].filter(t => t.id !== id) };
    });
  };

  /* -------------------- Actions: Search -------------------- */
  const doSearch = async () => {
    if (!apiOk) { setApiError("Missing API key. Add REACT_APP_SPOONACULAR_KEY in .env.local"); return; }
    setLoading(true); setApiError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("query", q);
      if (veg) params.set("diet", "vegetarian");
      if (noEggs) params.set("excludeIngredients", "egg");
      if (maxTime) params.set("maxReadyTime", String(maxTime));
      params.set("number", "12");

      const url = `${BASE}/complexSearch?${params.toString()}&apiKey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "API error");
      setResults(data.results || []);
    } catch (e) {
      setApiError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (id) => {
    if (!apiOk) { setApiError("Missing API key."); return; }
    setOpenId(id); setDetail(null); setDetailLoading(true);
    try {
      const url = `${BASE}/${id}/information?apiKey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load recipe");
      setDetail(data);
    } catch (e) {
      setDetail({ error: e.message || "Failed to load recipe." });
    } finally {
      setDetailLoading(false);
    }
  };

  const saveFavorite = (recipe) => {
    if (!recipe?.id) return;
    setFavorites((prev) => {
      if (prev.some(r => r.id === recipe.id)) return prev;
      const minimal = {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image || recipe.imageUrl || "",
        source: recipe.source || "api",
      };
      return [minimal, ...prev];
    });
  };

  const addIngredientsToShopping = (detailRecipe) => {
    if (!detailRecipe?.extendedIngredients?.length) return;
    const items = detailRecipe.extendedIngredients.map((ing) => ({
      id: uid(),
      name: ing.original || ing.name || "ingredient",
      qty: "",
      unit: "",
      aisle: ing.aisle || "",
      checked: false,
      sourceRecipeId: detailRecipe.id
    }));
    setShopping((prev) => [...items, ...prev]);
  };

  /* -------------------- Our Recipes -------------------- */
  const [ourForm, setOurForm] = useState({
    title: "", imageUrl: "", veg: true,
    ingredientsText: "", stepsText: ""
  });
  const addCustomRecipe = () => {
    const title = ourForm.title.trim();
    if (!title) return;
    const ingredients = ourForm.ingredientsText
      .split("\n").map(s => s.trim()).filter(Boolean)
      .map(line => ({ id: uid(), name: line }));
    const steps = ourForm.stepsText
      .split("\n").map(s => s.trim()).filter(Boolean);
    const newR = {
      id: `custom_${uid()}`,
      source: "custom",
      title,
      imageUrl: ourForm.imageUrl.trim(),
      isVegetarian: !!ourForm.veg,
      ingredients,
      steps
    };
    setCustomRecipes(prev => [newR, ...prev]);
    setOurForm({ title: "", imageUrl: "", veg: true, ingredientsText: "", stepsText: "" });
  };

  /* -------------------- Shopping -------------------- */
  const addShoppingItem = (name) => {
    const n = (name || "").trim();
    if (!n) return;
    setShopping(prev => [{ id: uid(), name: n, checked: false }, ...prev]);
  };
  const toggleShopping = (id) => setShopping(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const removeShopping = (id) => setShopping(prev => prev.filter(i => i.id !== id));
  const clearChecked = () => setShopping(prev => prev.filter(i => !i.checked));

  /* -------------------- UI helpers -------------------- */
  const [quickPlace, setQuickPlace] = useState("");
  const [quickMake, setQuickMake] = useState("");

  const handleQuickAdd = (type) => (e) => {
    e.preventDefault();
    if (type === "place") {
      const v = quickPlace.trim(); if (!v) return;
      addTodo("place", v);
      setQuickPlace("");
    } else {
      const v = quickMake.trim(); if (!v) return;
      addTodo("make", v);
      setQuickMake("");
    }
  };

  /* -------------------- Render -------------------- */
  return (
    <div className="foodhub">
      <div className="container">
        {/* HERO */}
        <div className="hero">
          <div>
            <h1>Food HQ</h1>
            <div className="sub">Places to try • Things to make • Recipes • Shopping</div>
            {!apiOk && (
              <div className="mt8 sm danger">
                Missing API key. Add <code>REACT_APP_SPOONACULAR_KEY</code> to <code>.env.local</code> and restart.
              </div>
            )}
          </div>
          <div className="actions">
            <button className="btn accent" onClick={() => setTab("search") || (window.location.hash="#search")}>Search Recipes</button>
            <button className="btn" onClick={() => setTab("todo") || (window.location.hash="#todo")}>Open To‑Do</button>
            <button className="btn good" onClick={() => setTab("list") || (window.location.hash="#list")}>Shopping List</button>
            <button className="btn" onClick={() => setTab("ours") || (window.location.hash="#ours")}>Add Recipe</button>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          <div className="tabbar">
            {[
              ["todo", "To‑Do"],
              ["search", "Recipe Search"],
              ["ours", "Our Recipes"],
              ["list", "Shopping List"],
              ["favs", "Favorites"],
            ].map(([id, label]) => (
              <button key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => { setTab(id); window.location.hash = id; }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* PANELS */}
        {tab === "todo" && (
          <div className="grid-2">
            <div className="card pad">
              <h3 className="section-title">Places to Try</h3>
              <form className="row" onSubmit={handleQuickAdd("place")}>
                <input className="input" placeholder="e.g., Saravana Bhavan, dosa spot on 5th…" value={quickPlace} onChange={e => setQuickPlace(e.target.value)} />
                <button className="btn">Add</button>
              </form>
              <div className="list mt12">
                {todos.places.length === 0 && <div className="empty">No places yet—add one above.</div>}
                {todos.places.map(item => (
                  <div className={`todo ${item.done ? "done" : ""}`} key={item.id}>
                    <input type="checkbox" checked={item.done} onChange={() => toggleTodo("place", item.id)} />
                    <div>
                      <h4>{item.title}</h4>
                      {item.note ? <div className="note">{item.note}</div> : null}
                      <div className="mt8">
                        {item.tags?.map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </div>
                    <button className="btn bad" onClick={() => removeTodo("place", item.id)}>Delete</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card pad">
              <h3 className="section-title">Things to Make</h3>
              <form className="row" onSubmit={handleQuickAdd("make")}>
                <input className="input" placeholder="e.g., Paneer tikka, microwave mug cake…" value={quickMake} onChange={e => setQuickMake(e.target.value)} />
                <button className="btn">Add</button>
              </form>
              <div className="list mt12">
                {todos.makes.length === 0 && <div className="empty">Add ideas for what you two will cook!</div>}
                {todos.makes.map(item => (
                  <div className={`todo ${item.done ? "done" : ""}`} key={item.id}>
                    <input type="checkbox" checked={item.done} onChange={() => toggleTodo("make", item.id)} />
                    <div>
                      <h4>{item.title}</h4>
                      {item.note ? <div className="note">{item.note}</div> : null}
                      <div className="mt8">
                        {item.tags?.map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </div>
                    <button className="btn bad" onClick={() => removeTodo("make", item.id)}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "search" && (
          <div className="card pad">
            <h3 className="section-title">Search Recipes</h3>
            <div className="toolbar">
              <input className="input" placeholder="Try: chana masala, pav bhaji, pasta…" value={q} onChange={e => setQ(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') doSearch(); }} />
              <button className="btn accent" onClick={doSearch}>{loading ? "Searching..." : "Search"}</button>
              <span className={`chip ${veg ? "on" : ""}`} onClick={() => setVeg(v=>!v)} role="button">Vegetarian</span>
              <span className={`chip ${noEggs ? "on" : ""}`} onClick={() => setNoEggs(v=>!v)} role="button">No eggs</span>
              <div className="row">
                <span className="sm">≤ Time (min)</span>
                <input className="input" style={{width:100}} type="number" min="0" placeholder="30" value={maxTime} onChange={e=>setMaxTime(e.target.value)} />
              </div>
            </div>
            {apiError && <div className="mt12 sm danger">API: {apiError}</div>}
            <div className="rgrid mt16">
              {results.length === 0 && !loading && <div className="empty">No results yet. Try a search!</div>}
              {results.map(r => (
                <div className="rcard" key={r.id} onClick={() => openDetails(r.id)}>
                  <img src={r.image} alt={r.title} />
                  <div className="rcard-body">
                    <div className="title">{r.title}</div>
                    <div className="meta">Recipe #{r.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "ours" && (
          <div className="grid-2">
            <div className="card pad">
              <h3 className="section-title">Add Your Recipe</h3>
              <div className="gap12">
                <input className="input" placeholder="Title (e.g., Suhani’s Dal Tadka)" value={ourForm.title} onChange={e=>setOurForm(f=>({...f, title: e.target.value}))}/>
                <input className="input" placeholder="Image URL (optional)" value={ourForm.imageUrl} onChange={e=>setOurForm(f=>({...f, imageUrl: e.target.value}))}/>
                <div className="row">
                  <label className="row" style={{gap:6}}>
                    <input type="checkbox" checked={ourForm.veg} onChange={e=>setOurForm(f=>({...f, veg: e.target.checked}))}/>
                    <span className="sm">Vegetarian</span>
                  </label>
                </div>
                <div>
                  <div className="sm">Ingredients (one per line)</div>
                  <textarea className="textarea" placeholder="2 cups cooked lentils&#10;1 tsp cumin seeds&#10;..." value={ourForm.ingredientsText} onChange={e=>setOurForm(f=>({...f, ingredientsText: e.target.value}))}/>
                </div>
                <div>
                  <div className="sm">Steps (one per line)</div>
                  <textarea className="textarea" placeholder="Heat oil and temper cumin...&#10;Add tomatoes and simmer..." value={ourForm.stepsText} onChange={e=>setOurForm(f=>({...f, stepsText: e.target.value}))}/>
                </div>
                <div className="right">
                  <button className="btn good" onClick={addCustomRecipe}>Save Recipe</button>
                </div>
              </div>
            </div>

            <div className="card pad">
              <h3 className="section-title">Our Recipes</h3>
              {customRecipes.length === 0 && <div className="empty">Nothing here yet—add your first recipe!</div>}
              <div className="rgrid">
                {customRecipes.map(cr => (
                  <div key={cr.id} className="rcard" onClick={()=>setDetail(cr) || setOpenId(cr.id)}>
                    <img src={cr.imageUrl || "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop"} alt={cr.title}/>
                    <div className="rcard-body">
                      <div className="title">{cr.title}</div>
                      <div className="meta">Custom • {cr.isVegetarian ? "Veg" : "—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "list" && (
          <div className="card pad">
            <h3 className="section-title">Shopping List</h3>
            <ShoppingList
              items={shopping}
              onAdd={addShoppingItem}
              onToggle={toggleShopping}
              onRemove={removeShopping}
              onClearChecked={clearChecked}
            />
          </div>
        )}

        {tab === "favs" && (
          <div className="card pad">
            <h3 className="section-title">Favorites</h3>
            {favorites.length === 0 && <div className="empty">Save recipes from search or your own here.</div>}
            <div className="rgrid">
              {favorites.map(f => (
                <div className="rcard" key={f.id} onClick={() => openDetails(f.id)}>
                  <img src={f.image || f.imageUrl || "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop"} alt={f.title} />
                  <div className="rcard-body">
                    <div className="title">{f.title}</div>
                    <div className="meta">{f.source === "custom" ? "Custom" : "API"} • #{f.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}
      {openId && (
        <div className="modal-backdrop" onClick={() => { setOpenId(null); setDetail(null); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="header">
              <div className="row">
                <strong>{detail?.title || "Loading…"}</strong>
                {detail?.readyInMinutes ? <span className="pill">{detail.readyInMinutes} min</span> : null}
                {detail?.servings ? <span className="pill">{detail.servings} servings</span> : null}
              </div>
              <button className="btn bad" onClick={() => { setOpenId(null); setDetail(null); }}>Close</button>
            </div>
            <div className="content">
              {detailLoading && <div className="empty">Fetching recipe details…</div>}
              {detail?.error && <div className="empty danger">{detail.error}</div>}

              {detail && !detailLoading && !detail.error && (
                <>
                  <div className="cols">
                    <div>
                      <img
                        src={detail.image || detail.imageUrl || "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop"}
                        alt={detail.title}
                        style={{width:"100%", borderRadius:"12px", border:"1px solid var(--border)"}}
                      />
                      {detail.sourceUrl && (
                        <div className="mt8">
                          <a className="sm" href={detail.sourceUrl} target="_blank" rel="noreferrer">Open original recipe ↗</a>
                        </div>
                      )}
                      <div className="mt12">
                        <button className="btn good" onClick={() => saveFavorite(detail)}>Save to Favorites</button>{" "}
                        {detail.extendedIngredients?.length ? (
                          <button className="btn accent" onClick={() => addIngredientsToShopping(detail)}>
                            Add Ingredients to Shopping
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <h4>Ingredients</h4>
                      <div className="ing">
                        {(detail.extendedIngredients
                          ? detail.extendedIngredients.map((i, idx) => <div key={idx}>• {i.original || i.name}</div>)
                          : (detail.ingredients || []).map((i, idx) => <div key={idx}>• {i.name}</div>)
                        )}
                        {(!detail.extendedIngredients && !detail.ingredients) && <div className="sm muted">No ingredients found.</div>}
                      </div>
                      <div className="sep" />
                      <h4>Steps</h4>
                      {/* Prefer analyzedInstructions if available */}
                      {Array.isArray(detail.analyzedInstructions) && detail.analyzedInstructions.length > 0 ? (
                        detail.analyzedInstructions[0].steps.map((s) => (
                          <div className="step" key={s.number}><strong>Step {s.number}.</strong> {s.step}</div>
                        ))
                      ) : detail.steps?.length ? (
                        detail.steps.map((line, idx) => <div className="step" key={idx}><strong>Step {idx+1}.</strong> {line}</div>)
                      ) : detail.instructions ? (
                        <div className="step">{detail.instructions}</div>
                      ) : (
                        <div className="sm muted">No steps provided.</div>
                      )}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="row-spread mt8">
                    <div className="inline">
                      {detail.vegetarian ? <span className="chip on">Vegetarian</span> : null}
                      {detail.vegan ? <span className="chip on">Vegan</span> : null}
                      {detail.glutenFree ? <span className="chip on">Gluten‑free</span> : null}
                      {detail.dairyFree ? <span className="chip on">Dairy‑free</span> : null}
                    </div>
                    {typeof detail.healthScore === "number" ? (
                      <div className="kpi">Health score: {Math.round(detail.healthScore)}</div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Shopping List Component ------------------------------ */

function ShoppingList({ items, onAdd, onToggle, onRemove, onClearChecked }) {
  const [val, setVal] = useState("");
  return (
    <>
      <div className="row">
        <input className="input" placeholder="Quick add item (e.g., basmati rice)" value={val} onChange={e=>setVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { onAdd(val); setVal(""); } }}/>
        <button className="btn" onClick={() => { onAdd(val); setVal(""); }}>Add</button>
        <button className="btn bad" onClick={onClearChecked}>Clear Checked</button>
      </div>
      <div className="list mt12">
        {items.length === 0 && <div className="empty">Your list is empty—add items or push from a recipe.</div>}
        {items.map(item => (
          <div className={`todo ${item.checked ? "done" : ""}`} key={item.id}>
            <input type="checkbox" checked={item.checked} onChange={() => onToggle(item.id)} />
            <div>
              <h4>{item.name}</h4>
              {item.aisle ? <div className="note">Aisle: {item.aisle}</div> : null}
            </div>
            <button className="btn bad" onClick={() => onRemove(item.id)}>Remove</button>
          </div>
        ))}
      </div>
    </>
  );
}
