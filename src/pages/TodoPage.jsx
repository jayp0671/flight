import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

const UNCATEGORIZED = 'Uncategorized';

function getCategory(item) {
  return item.category?.trim() || UNCATEGORIZED;
}

function getCreatedTime(item) {
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;

  return 0;
}

function SidebarButton({ icon, label, count, active, onClick }) {
  return (
    <button
      type="button"
      className={`sidebar-filter ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="sidebar-filter__icon">{icon}</span>
      <span>{label}</span>
      <strong>{count}</strong>
    </button>
  );
}

export default function TodoPage() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const q = query(collection(db, 'todos'), orderBy('createdAt', 'asc'));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setItems(list);
    });

    return () => unsub();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(items.map(getCategory));

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const stats = useMemo(() => {
    const completed = items.filter((item) => item.done).length;
    const active = items.length - completed;

    return {
      all: items.length,
      active,
      completed,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const itemCategory = getCategory(item);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !item.done) ||
        (statusFilter === 'completed' && item.done);

      const matchesCategory =
        categoryFilter === 'all' || itemCategory === categoryFilter;

      const searchableText = [item.text ?? '', itemCategory]
        .join(' ')
        .toLowerCase();

      const matchesSearch = !search || searchableText.includes(search);

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [items, statusFilter, categoryFilter, searchQuery]);

  const visibleItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => getCreatedTime(a) - getCreatedTime(b));
  }, [filteredItems]);

  const pageCount = Math.max(1, Math.ceil(visibleItems.length / pageSize));
  const pageStart = visibleItems.length === 0 ? 0 : (currentPage - 1) * pageSize;
  const pageEnd = Math.min(currentPage * pageSize, visibleItems.length);
  const paginatedItems = visibleItems.slice(pageStart, pageEnd);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, searchQuery, pageSize]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(Math.max(page, 1), pageCount));
  }, [pageCount]);

  const activeTitle = useMemo(() => {
    if (categoryFilter !== 'all') return categoryFilter;
    if (statusFilter === 'active') return 'To Do';
    if (statusFilter === 'completed') return 'Done';

    return 'All Tasks';
  }, [categoryFilter, statusFilter]);

  const addItem = async (e) => {
    e.preventDefault();

    const cleanText = text.trim();
    const cleanCategory = category.trim() || UNCATEGORIZED;

    if (!cleanText) return;

    await addDoc(collection(db, 'todos'), {
      text: cleanText,
      category: cleanCategory,
      done: false,
      createdAt: serverTimestamp(),
    });

    setText('');
    setCategory('');
  };

  const toggleItem = async (id, done) => {
    await updateDoc(doc(db, 'todos', id), {
      done: !done,
    });
  };

  const removeItem = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  const clearSidebarFilters = () => {
    setSearchQuery('');
    setPageSize(5);
  };

  const showAll = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const showActive = () => {
    setStatusFilter('active');
    setCategoryFilter('all');
  };

  const showCompleted = () => {
    setStatusFilter('completed');
    setCategoryFilter('all');
  };

  const showCategory = (selectedCategory) => {
    setStatusFilter('all');
    setCategoryFilter(selectedCategory);
  };

  return (
    <section className="todo-page">
      <div className="todo-shell">
        <header className="todo-hero">
          <div>
            <p className="todo-kicker">Trip tasks</p>
            <h1>To-Do List</h1>
            <p>
              Stay organized before the trip. Add tasks, assign categories, and
              keep everything synced through Firebase.
            </p>
          </div>

          <div className="todo-summary-pill">
            <span>{stats.active}</span>
            <strong>left</strong>
          </div>
        </header>

        <div className="todo-layout">
          <aside className="todo-sidebar">
            <div className="sidebar-section">
              <p className="sidebar-title">Overview</p>

              <SidebarButton
                icon="☷"
                label="All Tasks"
                count={stats.all}
                active={statusFilter === 'all' && categoryFilter === 'all'}
                onClick={showAll}
              />

              <SidebarButton
                icon="○"
                label="To Do"
                count={stats.active}
                active={statusFilter === 'active' && categoryFilter === 'all'}
                onClick={showActive}
              />

              <SidebarButton
                icon="✓"
                label="Done"
                count={stats.completed}
                active={statusFilter === 'completed' && categoryFilter === 'all'}
                onClick={showCompleted}
              />
            </div>

            <div className="sidebar-section">
              <p className="sidebar-title">Categories</p>

              {categories.length > 0 ? (
                categories.map((name) => (
                  <SidebarButton
                    key={name}
                    icon="✦"
                    label={name}
                    count={items.filter((item) => getCategory(item) === name).length}
                    active={categoryFilter === name}
                    onClick={() => showCategory(name)}
                  />
                ))
              ) : (
                <p className="sidebar-empty">
                  Categories will appear here after tasks are added.
                </p>
              )}
            </div>

            <div className="sidebar-section sidebar-filter-panel">
              <div className="filter-header">
                <div>
                  <p className="sidebar-title">Filters</p>
                  <span>Controls for the task card</span>
                </div>

                <button type="button" className="reset-filters" onClick={clearSidebarFilters}>
                  Reset
                </button>
              </div>

              <label className="filter-field">
                <span>Search</span>
                <input
                  type="search"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </label>

              <label className="filter-field">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={25}>25 per page</option>
                </select>
              </label>
            </div>
          </aside>

          <main className="todo-main">
            <div className="todo-main__top">
              <div>
                <h2>{activeTitle}</h2>
                <p>
                  {visibleItems.length > 0
                    ? `Showing ${pageStart + 1}-${pageEnd} of ${visibleItems.length} · ${stats.active} remaining`
                    : `0 shown · ${stats.active} remaining`}
                </p>
              </div>
            </div>

            <form onSubmit={addItem} className="todo-add">
              <input
                type="text"
                placeholder="Add a task..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="todo-category-options"
              />

              <datalist id="todo-category-options">
                {categories.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>

              <button type="submit">Add Task</button>
            </form>

            <ul className="todo-list">
              {paginatedItems.map((item) => (
                <li key={item.id} className={item.done ? 'done' : ''}>
                  <label className="task-check">
                    <input
                      type="checkbox"
                      checked={!!item.done}
                      onChange={() => toggleItem(item.id, !!item.done)}
                    />
                    <span className="custom-check" />
                  </label>

                  <div className="task-content">
                    <strong>{item.text ?? ''}</strong>

                    <div className="task-meta">
                      <span className="category-pill">{getCategory(item)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="task-remove"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove task"
                  >
                    ✕
                  </button>
                </li>
              ))}

              {visibleItems.length === 0 && (
                <li className="todo-empty">
                  <strong>No tasks match this view.</strong>
                  <span>Try clearing the search or add a new task above.</span>
                </li>
              )}
            </ul>

            {visibleItems.length > 0 && (
              <div className="todo-pagination">
                <span>
                  Page {currentPage} of {pageCount}
                </span>

                <div className="pagination-buttons">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(page + 1, pageCount))
                    }
                    disabled={currentPage === pageCount}
                  >
                    Next
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(pageCount)}
                    disabled={currentPage === pageCount}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
.todo-page {
  min-height: calc(100vh - 76px);
  padding: 68px 24px;
}

.todo-shell {
  width: min(100%, 1160px);
  margin: 0 auto;
}

.todo-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.todo-kicker {
  margin: 0 0 10px;
  color: var(--accent-3);
  font-size: 13px;
  font-weight: 950;
  letter-spacing: 0.26em;
  text-transform: uppercase;
}

.todo-hero h1 {
  margin: 0;
  color: var(--text);
  font-size: clamp(48px, 7vw, 84px);
  line-height: 0.92;
  letter-spacing: -0.075em;
  font-weight: 950;
  text-shadow: 0 18px 52px rgba(9, 6, 18, 0.42);
}

.todo-hero p:not(.todo-kicker) {
  max-width: 640px;
  margin: 14px 0 0;
  color: var(--text-soft);
  font-size: 17px;
  line-height: 1.65;
  font-weight: 700;
}

.todo-summary-pill {
  min-width: 126px;
  min-height: 72px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 2px;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.055)),
    rgba(21, 15, 34, 0.46);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 24px 70px rgba(9, 6, 18, 0.22);
  backdrop-filter: blur(18px);
}

.todo-summary-pill span {
  color: #fff;
  font-size: 30px;
  line-height: 1;
  font-weight: 950;
}

.todo-summary-pill strong {
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.todo-layout {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.todo-sidebar,
.todo-main {
  border-radius: 34px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.055)),
    rgba(21, 15, 34, 0.52);
  border: 1px solid rgba(255,255,255,0.16);
  box-shadow: 0 28px 90px rgba(9, 6, 18, 0.28);
  backdrop-filter: blur(20px);
}

.todo-sidebar {
  position: sticky;
  top: 104px;
  display: grid;
  gap: 22px;
  padding: 20px;
}

.sidebar-section {
  display: grid;
  gap: 8px;
}

.sidebar-title {
  margin: 0 0 4px;
  color: var(--accent-3);
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.sidebar-filter {
  min-height: 46px;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border-radius: 15px;
  color: rgba(255, 248, 243, 0.76);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  text-align: left;
  font-weight: 850;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.sidebar-filter:hover {
  color: #fff;
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.1);
}

.sidebar-filter.active {
  color: #fff;
  background:
    linear-gradient(135deg, rgba(255,122,184,0.22), rgba(154,92,255,0.18)),
    rgba(255,255,255,0.08);
  border-color: rgba(255,122,184,0.28);
  box-shadow: 0 14px 34px rgba(255,122,184,0.12);
}

.sidebar-filter__icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: var(--accent);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
}

.sidebar-filter strong {
  min-width: 28px;
  min-height: 24px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: rgba(255, 248, 243, 0.78);
  background: rgba(255,255,255,0.09);
  font-size: 12px;
  font-weight: 950;
}

.sidebar-empty {
  margin: 0;
  padding: 12px;
  border-radius: 14px;
  color: var(--text-muted);
  background: rgba(255,255,255,0.06);
  font-size: 13px;
  line-height: 1.45;
  font-weight: 700;
}

.sidebar-filter-panel {
  padding-top: 4px;
}

.filter-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 2px;
}

.filter-header .sidebar-title {
  margin-bottom: 3px;
}

.filter-header span {
  color: rgba(255, 248, 243, 0.52);
  font-size: 12px;
  font-weight: 700;
}

.reset-filters,
.pagination-buttons button {
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  color: var(--text);
  background: rgba(255,255,255,0.075);
  border: 1px solid rgba(255,255,255,0.12);
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  transition: background 0.18s ease, border-color 0.18s ease, opacity 0.18s ease, transform 0.18s ease;
}

.reset-filters:hover,
.pagination-buttons button:hover {
  transform: translateY(-1px);
  background: rgba(255,255,255,0.13);
  border-color: rgba(255,255,255,0.2);
}

.pagination-buttons button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
  transform: none;
}

.filter-field {
  display: grid;
  gap: 7px;
}

.filter-field span {
  color: rgba(255, 211, 168, 0.78);
  font-size: 10px;
  font-weight: 950;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.filter-field input,
.filter-field select {
  width: 100%;
  min-height: 42px;
  border-radius: 15px;
  color: #fff8f3;
  background: rgba(18, 12, 29, 0.62);
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
}

.filter-field input::placeholder {
  color: rgba(255, 248, 243, 0.42);
}

.filter-field input:focus,
.filter-field select:focus {
  border-color: rgba(255, 122, 184, 0.64);
  box-shadow: 0 0 0 4px rgba(255, 122, 184, 0.12);
}

.filter-field select option {
  color: #241738;
  background: #fff8f3;
}

.todo-main {
  padding: clamp(20px, 3vw, 28px);
}

.todo-main__top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.todo-main__top h2 {
  margin: 0;
  color: var(--text);
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1;
  letter-spacing: -0.055em;
  font-weight: 950;
}

.todo-main__top p {
  margin: 8px 0 0;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 750;
}

.todo-add {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 170px auto;
  gap: 10px;
  margin-bottom: 18px;
}

.todo-add input {
  min-height: 48px;
}

.todo-add button {
  min-height: 48px;
  padding: 0 18px;
  border-radius: 15px;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border: 0;
  box-shadow: 0 18px 42px rgba(255, 122, 184, 0.22);
  cursor: pointer;
  font-weight: 950;
  white-space: nowrap;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.todo-add button:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 52px rgba(255, 122, 184, 0.28);
}

.todo-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.todo-list li {
  min-height: 72px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 20px;
  background: rgba(255,255,255,0.075);
  border: 1px solid rgba(255,255,255,0.1);
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.todo-list li:hover {
  transform: translateY(-1px);
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.16);
}

.todo-list li.done .task-content strong {
  text-decoration: line-through;
  opacity: 0.62;
}

.task-check {
  position: relative;
  width: 26px;
  height: 26px;
  cursor: pointer;
}

.task-check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.custom-check {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.34);
  background: rgba(255,255,255,0.06);
}

.task-check input:checked + .custom-check {
  border-color: transparent;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 12px 26px rgba(255,122,184,0.2);
}

.task-check input:checked + .custom-check::after {
  content: "✓";
  color: white;
  font-size: 14px;
  font-weight: 950;
}

.task-content {
  display: grid;
  gap: 8px;
}

.task-content strong {
  color: var(--text);
  font-size: 15px;
  font-weight: 900;
}

.task-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 800;
}

.category-pill {
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  color: #ffc9e5;
  background: rgba(255,122,184,0.12);
  border: 1px solid rgba(255,122,184,0.18);
  font-size: 11px;
  font-weight: 950;
}

.task-remove {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: rgba(255, 248, 243, 0.62);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.task-remove:hover {
  color: #fff;
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.12);
}

.todo-empty {
  display: grid !important;
  grid-template-columns: 1fr !important;
  gap: 6px !important;
  place-items: center;
  min-height: 150px !important;
  text-align: center;
  color: var(--text-muted);
}

.todo-empty strong {
  color: var(--text);
  font-size: 18px;
  font-weight: 950;
}

.todo-empty span {
  font-size: 14px;
  font-weight: 700;
}

.todo-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.todo-pagination > span {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 850;
}

.pagination-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 980px) {
  .todo-layout {
    grid-template-columns: 1fr;
  }

  .todo-sidebar {
    position: static;
  }

  .sidebar-section:first-child,
  .sidebar-section:nth-child(2) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sidebar-title,
  .sidebar-empty {
    grid-column: 1 / -1;
  }

  .todo-add {
    grid-template-columns: 1fr 1fr;
  }

  .todo-add button {
    grid-column: 1 / -1;
  }
}

@media (max-width: 680px) {
  .todo-page {
    padding: 42px 16px;
  }

  .todo-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .todo-summary-pill {
    width: 100%;
    min-height: 62px;
  }

  .sidebar-section:first-child,
  .sidebar-section:nth-child(2),
  .todo-add {
    grid-template-columns: 1fr;
  }

  .todo-sidebar,
  .todo-main {
    border-radius: 26px;
  }

  .todo-list li {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .task-remove {
    grid-column: 2;
    justify-self: start;
  }

  .todo-pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagination-buttons {
    justify-content: flex-start;
  }
}
`;
