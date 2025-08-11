// src/pages/PackingList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  updateDoc, serverTimestamp, query, orderBy, writeBatch
} from 'firebase/firestore';

export default function PackingList() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState('all'); // all | unchecked | checked

  // Realtime listener
  useEffect(() => {
    const q = query(collection(db, 'packing'), orderBy('category', 'asc'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setItems(list);
    });
    return () => unsub();
  }, []);

  // Derived: list of categories + grouping
  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const grouped = useMemo(() => {
    const g = new Map();
    items.forEach(i => {
      if (filter === 'unchecked' && i.checked) return;
      if (filter === 'checked' && !i.checked) return;
      const key = i.category || 'Uncategorized';
      if (!g.has(key)) g.set(key, []);
      g.get(key).push(i);
    });
    return g;
  }, [items, filter]);

  async function addItem(e) {
    e.preventDefault();
    const t = text.trim();
    const c = category.trim() || 'Misc';
    if (!t) return;
    await addDoc(collection(db, 'packing'), {
      text: t,
      category: c,
      checked: false,
      createdAt: serverTimestamp(),
    });
    setText('');
    if (!categories.includes(c)) setCategory(c); // keep it selected
  }

  async function toggleItem(id, checked) {
    await updateDoc(doc(db, 'packing', id), { checked: !checked });
  }

  async function removeItem(id) {
    await deleteDoc(doc(db, 'packing', id));
  }

  // Bulk ops per category
  async function markAllInCategory(cat, checked) {
    const batch = writeBatch(db);
    items.filter(i => (i.category || 'Uncategorized') === cat)
         .forEach(i => batch.update(doc(db, 'packing', i.id), { checked }));
    await batch.commit();
  }

  async function clearCheckedInCategory(cat) {
    const batch = writeBatch(db);
    items.filter(i => (i.category || 'Uncategorized') === cat && i.checked)
         .forEach(i => batch.delete(doc(db, 'packing', i.id)));
    await batch.commit();
  }

  const remaining = items.filter(i => !i.checked).length;

  return (
    <div className="container">
      <section className="packing">
        <header className="packing__header">
          <h1>Packing List</h1>
          <p className="route">EWR ✈ YHZ ↺</p>
        </header>

        {/* Add item */}
        <form className="packing__add" onSubmit={addItem}>
          <input
            type="text"
            placeholder="Add an item…"
            value={text}
            onChange={e => setText(e.target.value)}
            aria-label="Item name"
          />
          <input
            list="catOptions"
            placeholder="Category (e.g., Toiletries)"
            value={category}
            onChange={e => setCategory(e.target.value)}
            aria-label="Category"
          />
          <datalist id="catOptions">
            {categories.map(c => <option key={c} value={c} />)}
          </datalist>
          <button type="submit">Add</button>
        </form>

        {/* Filters + count */}
        <div className="packing__controls">
          <div className="filters">
            <button className={filter==='all'?'active':''} type="button" onClick={()=>setFilter('all')}>All</button>
            <button className={filter==='unchecked'?'active':''} type="button" onClick={()=>setFilter('unchecked')}>To pack</button>
            <button className={filter==='checked'?'active':''} type="button" onClick={()=>setFilter('checked')}>Packed</button>
          </div>
          <div className="muted">{remaining} left</div>
        </div>

        {/* Category cards */}
        <div className="packing-list">
          {Array.from(grouped.keys()).map(cat => {
            const list = grouped.get(cat) || [];
            return (
              <div className="packing-card" key={cat}>
                <div className="packing-card__head">
                  <h2>{cat}</h2>
                  <div className="card-actions">
                    <button type="button" onClick={() => markAllInCategory(cat, true)}>Mark all packed</button>
                    <button type="button" onClick={() => markAllInCategory(cat, false)}>Mark all unpacked</button>
                    <button type="button" onClick={() => clearCheckedInCategory(cat)}>Clear packed</button>
                  </div>
                </div>

                <ul>
                  {list.map(item => (
                    <li key={item.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={!!item.checked}
                          onChange={() => toggleItem(item.id, !!item.checked)}
                        />
                        <span className={item.checked ? 'checked' : ''}>{item.text ?? ''}</span>
                      </label>
                      <button className="remove" onClick={() => removeItem(item.id)} aria-label="Remove">✕</button>
                    </li>
                  ))}
                  {list.length === 0 && <li className="empty muted">No items.</li>}
                </ul>
              </div>
            );
          })}
          {grouped.size === 0 && (
            <div className="packing-card">
              <h2>Nothing yet</h2>
              <p className="muted">Add your first item above.</p>
            </div>
          )}
        </div>
      </section>

      <style>{css}</style>
    </div>
  );
}

const css = `
.packing { display:grid; gap:18px; padding:8px 0 28px; }
.packing__header { display:flex; align-items:flex-end; justify-content:space-between; gap:12px; }
.packing__header h1 { margin:0; font-size:clamp(24px,4vw,36px); }
.packing__header .route { margin:0; color:var(--muted); font-weight:700; letter-spacing:.6px; }

.packing__add { display:grid; grid-template-columns: 1fr 260px auto; gap:8px; }
.packing__add input {
  padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,.08);
  background:rgba(16,21,34,.6); color:var(--text);
}
.packing__add button {
  padding:12px 16px; border-radius:12px; border:1px solid rgba(255,255,255,.1);
  background:linear-gradient(180deg, rgba(24,30,48,.9), rgba(18,22,36,.85));
  color:var(--text); font-weight:700; cursor:pointer;
}
@media (max-width: 720px) {
  .packing__add { grid-template-columns: 1fr; }
}

.packing__controls { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.filters { display:flex; gap:8px; }
.filters button {
  padding:8px 12px; border-radius:10px; border:1px solid rgba(255,255,255,.08);
  background:rgba(16,21,34,.55); color:var(--text); cursor:pointer;
}
.filters .active { outline:2px solid var(--glow1); }

.packing-list { display:grid; gap:16px; }
.packing-card {
  background: linear-gradient(180deg, rgba(16,21,34,.85), rgba(12,15,22,.78));
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 28px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04);
}
.packing-card__head { display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:8px; }
.packing-card h2 { font-size: 18px; font-weight: 800; margin: 0; }
.card-actions { display:flex; flex-wrap:wrap; gap:8px; }
.card-actions button {
  padding:6px 10px; border-radius:10px; border:1px solid rgba(255,255,255,.08);
  background:rgba(16,21,34,.55); color:var(--text); cursor:pointer; font-size:12px;
}

.packing-card ul { list-style:none; padding:0; margin:0; display:grid; gap:8px; }
.packing-card li { display:flex; align-items:center; justify-content:space-between; }
.packing-card label { display:flex; align-items:center; gap:8px; cursor:pointer; }
.packing-card input[type="checkbox"] { accent-color: var(--glow1); width: 18px; height: 18px; }
.packing-card span { color: var(--text); font-size: 14px; }
.packing-card span.checked { text-decoration: line-through; opacity:.7; }
.packing-card .remove { background:transparent; border:none; color:var(--muted); font-size:18px; cursor:pointer; }
.empty { text-align:left; padding:6px 0; }
`;
