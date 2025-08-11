import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  updateDoc, serverTimestamp, query, orderBy, writeBatch
} from 'firebase/firestore';

export default function TodoPage() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | completed

  // realtime listener ordered by createdAt
  useEffect(() => {
    const q = query(collection(db, 'todos'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setItems(list);
    });
    return () => unsub();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    await addDoc(collection(db, 'todos'), {
      text: t,
      done: false,
      createdAt: serverTimestamp(),
    });
    setText('');
  };

  const toggleItem = async (id, done) => {
    await updateDoc(doc(db, 'todos', id), { done: !done });
  };

  const removeItem = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  // bulk actions
  const markAll = async (done) => {
    const batch = writeBatch(db);
    items.forEach(it => batch.update(doc(db, 'todos', it.id), { done }));
    await batch.commit();
  };

  const clearCompleted = async () => {
    const batch = writeBatch(db);
    items.filter(i => i.done).forEach(it => batch.delete(doc(db, 'todos', it.id)));
    await batch.commit();
  };

  // filtering
  const visible = useMemo(() => {
    if (filter === 'active') return items.filter(i => !i.done);
    if (filter === 'completed') return items.filter(i => i.done);
    return items;
  }, [items, filter]);

  const remaining = items.filter(i => !i.done).length;

  return (
    <div className="container">
      <section className="todo">
        <header className="todo__header">
          <h1>To‑Do</h1>
          <p className="muted">{remaining} left</p>
        </header>

        <form onSubmit={addItem} className="todo__add">
          <input
            type="text"
            placeholder="Add a task…"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        <div className="todo__controls">
          <div className="filters">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
              type="button"
            >All</button>
            <button
              className={filter === 'active' ? 'active' : ''}
              onClick={() => setFilter('active')}
              type="button"
            >Active</button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
              type="button"
            >Completed</button>
          </div>
          <div className="bulk">
            <button type="button" onClick={() => markAll(true)}>Mark all done</button>
            <button type="button" onClick={() => markAll(false)}>Mark all active</button>
            <button type="button" onClick={clearCompleted}>Clear completed</button>
          </div>
        </div>

        <ul className="todo__list">
          {visible.map(item => (
            <li key={item.id} className={item.done ? 'done' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={!!item.done}
                  onChange={() => toggleItem(item.id, !!item.done)}
                />
                <span>{item.text ?? ''}</span>
              </label>
              <button className="remove" onClick={() => removeItem(item.id)} aria-label="Remove">✕</button>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="empty muted">No tasks here. Add one above!</li>
          )}
        </ul>
      </section>

      <style>{css}</style>
    </div>
  );
}

const css = `
.todo { display:grid; gap:16px; padding:8px 0 28px; }
.todo__header { display:flex; align-items:flex-end; justify-content:space-between; gap:12px; }
.todo__header h1 { margin:0; font-size:clamp(24px,4vw,36px); }
.muted { color:var(--muted); }
.todo__add { display:flex; gap:8px; }
.todo__add input {
  flex:1; padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,.08);
  background:rgba(16,21,34,.6); color:var(--text);
}
.todo__add button {
  padding:12px 16px; border-radius:12px; border:1px solid rgba(255,255,255,.1);
  background:linear-gradient(180deg, rgba(24,30,48,.9), rgba(18,22,36,.85));
  color:var(--text); font-weight:700; cursor:pointer;
}
.todo__controls { display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; }
.filters, .bulk { display:flex; gap:8px; }
.filters button, .bulk button {
  padding:8px 12px; border-radius:10px; border:1px solid rgba(255,255,255,.08);
  background:rgba(16,21,34,.55); color:var(--text); cursor:pointer;
}
.filters .active { outline:2px solid var(--glow1); }
.todo__list { list-style:none; padding:0; margin:0; display:grid; gap:10px; }
.todo__list li {
  display:flex; align-items:center; justify-content:space-between;
  padding:12px; border-radius:14px;
  background:linear-gradient(180deg, rgba(16,21,34,.85), rgba(12,15,22,.78));
  border:1px solid rgba(255,255,255,.06);
  box-shadow:0 10px 28px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04);
}
.todo__list li.done span { text-decoration:line-through; opacity:.7; }
.todo__list label { display:flex; align-items:center; gap:10px; cursor:pointer; }
.todo__list input[type="checkbox"] { width:18px; height:18px; accent-color:var(--glow1); }
.todo__list .remove { background:transparent; border:none; color:var(--muted); font-size:18px; cursor:pointer; }
.empty { text-align:center; padding:18px 0; }
`;
