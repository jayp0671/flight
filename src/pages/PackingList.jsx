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
} from 'firebase/firestore';

const PACKING_COLLECTION = 'packingItems';
const UNASSIGNED_BAG = 'Unassigned Bag';
const DEFAULT_BAGS = ['Carry-on', 'Backpack', 'Checked Bag', 'Personal Item'];

function getItemName(item) {
  return item.name?.trim() || item.text?.trim() || '';
}

function getBag(item) {
  return item.bag?.trim() || UNASSIGNED_BAG;
}

function getCategory(item) {
  return item.category?.trim() || 'Misc';
}

function getCreatedTime(item) {
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;

  return 0;
}

function getBagIcon(bagName) {
  const value = bagName.toLowerCase();

  if (value.includes('carry')) return '🧳';
  if (value.includes('back')) return '🎒';
  if (value.includes('checked')) return '🧳';
  if (value.includes('personal')) return '👜';
  if (value.includes('doc')) return '📄';
  if (value.includes('tech')) return '🔌';

  return '🎒';
}

function EmptyBagState({ selectedBag }) {
  return (
    <div className="packing-empty-state">
      <strong>No matching items here.</strong>
      <span>
        {selectedBag === 'all'
          ? 'Add a packing item above or adjust your filters.'
          : 'Add something to this bag or switch back to all bags.'}
      </span>
    </div>
  );
}

export default function PackingList() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [bagName, setBagName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedBag, setSelectedBag] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, PACKING_COLLECTION), (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setItems(list);
    });

    return () => unsub();
  }, []);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => getCreatedTime(a) - getCreatedTime(b));
  }, [items]);

  const bags = useMemo(() => {
    const names = new Set(DEFAULT_BAGS);

    sortedItems.forEach((item) => {
      names.add(getBag(item));
    });

    return Array.from(names);
  }, [sortedItems]);

  const categories = useMemo(() => {
    const names = new Set();

    sortedItems.forEach((item) => {
      names.add(getCategory(item));
    });

    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [sortedItems]);

  const stats = useMemo(() => {
    const total = sortedItems.length;
    const packed = sortedItems.filter((item) => item.packed).length;
    const remaining = total - packed;
    const percent = total === 0 ? 0 : Math.round((packed / total) * 100);

    return {
      total,
      packed,
      remaining,
      percent,
    };
  }, [sortedItems]);

  const filteredItems = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return sortedItems.filter((item) => {
      const name = getItemName(item);
      const itemBag = getBag(item);
      const itemCategory = getCategory(item);

      const matchesBag = selectedBag === 'all' || itemBag === selectedBag;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'packed' && item.packed) ||
        (statusFilter === 'unpacked' && !item.packed);

      const searchableText = [name, itemBag, itemCategory]
        .join(' ')
        .toLowerCase();

      const matchesSearch = !search || searchableText.includes(search);

      return matchesBag && matchesStatus && matchesSearch;
    });
  }, [sortedItems, selectedBag, statusFilter, searchQuery]);

  const visibleBags = useMemo(() => {
    const names = selectedBag === 'all' ? bags : [selectedBag];

    return names.map((bag) => {
      const allBagItems = sortedItems.filter((item) => getBag(item) === bag);
      const visibleBagItems = filteredItems.filter((item) => getBag(item) === bag);
      const packed = allBagItems.filter((item) => item.packed).length;
      const total = allBagItems.length;
      const percent = total === 0 ? 0 : Math.round((packed / total) * 100);

      return {
        name: bag,
        icon: getBagIcon(bag),
        items: visibleBagItems,
        packed,
        total,
        percent,
      };
    });
  }, [bags, filteredItems, selectedBag, sortedItems]);

  const addItem = async (e) => {
    e.preventDefault();

    const cleanName = itemName.trim();
    const cleanBag = bagName.trim() || UNASSIGNED_BAG;
    const cleanCategory = category.trim() || 'Misc';

    if (!cleanName) return;

    await addDoc(collection(db, PACKING_COLLECTION), {
      name: cleanName,
      bag: cleanBag,
      category: cleanCategory,
      packed: false,
      createdAt: serverTimestamp(),
    });

    setItemName('');
    setBagName('');
    setCategory('');
  };

  const togglePacked = async (item) => {
    await updateDoc(doc(db, PACKING_COLLECTION, item.id), {
      packed: !item.packed,
    });
  };

  const removeItem = async (id) => {
    await deleteDoc(doc(db, PACKING_COLLECTION, id));
  };

  const resetView = () => {
    setSelectedBag('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <section className="packing-page">
      <div className="packing-shell">
        <header className="packing-hero">
          <div>
            <p className="packing-kicker">Trip essentials</p>
            <h1>Packing by Bag</h1>
            <p>
              Organize everything by where it goes, then check items off as they
              get packed.
            </p>
          </div>

          <div className="packing-summary">
            <span>{stats.packed}</span>
            <strong>of {stats.total} packed</strong>
            <div className="summary-track">
              <i style={{ width: `${stats.percent}%` }} />
            </div>
          </div>
        </header>

        <div className="packing-layout">
          <aside className="packing-sidebar">
            <div className="sidebar-section">
              <p className="sidebar-title">Bags</p>

              <button
                type="button"
                className={`bag-filter ${selectedBag === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedBag('all')}
              >
                <span>✦</span>
                <strong>All Bags</strong>
                <em>{stats.total}</em>
              </button>

              {bags.map((bag) => {
                const bagItems = sortedItems.filter((item) => getBag(item) === bag);
                const packed = bagItems.filter((item) => item.packed).length;

                return (
                  <button
                    key={bag}
                    type="button"
                    className={`bag-filter ${selectedBag === bag ? 'active' : ''}`}
                    onClick={() => setSelectedBag(bag)}
                  >
                    <span>{getBagIcon(bag)}</span>
                    <strong>{bag}</strong>
                    <em>
                      {packed}/{bagItems.length}
                    </em>
                  </button>
                );
              })}
            </div>

            <div className="sidebar-section">
              <p className="sidebar-title">Status</p>

              <div className="status-pills">
                <button
                  type="button"
                  className={statusFilter === 'all' ? 'active' : ''}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </button>

                <button
                  type="button"
                  className={statusFilter === 'unpacked' ? 'active' : ''}
                  onClick={() => setStatusFilter('unpacked')}
                >
                  Unpacked
                </button>

                <button
                  type="button"
                  className={statusFilter === 'packed' ? 'active' : ''}
                  onClick={() => setStatusFilter('packed')}
                >
                  Packed
                </button>
              </div>
            </div>

            <div className="sidebar-section">
              <p className="sidebar-title">Search</p>

              <label className="packing-search">
                <input
                  type="search"
                  placeholder="Search packing..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </label>

              <button type="button" className="reset-view" onClick={resetView}>
                Reset view
              </button>
            </div>
          </aside>

          <main className="packing-main">
            <div className="packing-main__top">
              <div>
                <h2>
                  {selectedBag === 'all' ? 'All Bags' : selectedBag}
                </h2>
                <p>
                  {filteredItems.length} shown · {stats.remaining} left to pack
                </p>
              </div>
            </div>

            <form onSubmit={addItem} className="packing-add">
              <input
                type="text"
                placeholder="Add packing item..."
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Bag"
                value={bagName}
                onChange={(e) => setBagName(e.target.value)}
                list="packing-bag-options"
              />

              <datalist id="packing-bag-options">
                {bags.map((bag) => (
                  <option key={bag} value={bag} />
                ))}
              </datalist>

              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="packing-category-options"
              />

              <datalist id="packing-category-options">
                {categories.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>

              <button type="submit">Add Item</button>
            </form>

            <div className="bag-grid">
              {visibleBags.map((bag) => (
                <article key={bag.name} className="bag-card">
                  <div className="bag-card__top">
                    <div className="bag-icon">{bag.icon}</div>

                    <div>
                      <h3>{bag.name}</h3>
                      <p>
                        {bag.total === 0
                          ? 'No items yet'
                          : `${bag.packed} of ${bag.total} packed`}
                      </p>
                    </div>

                    <span className="bag-count">
                      {bag.packed}/{bag.total}
                    </span>
                  </div>

                  <div className="bag-progress">
                    <i style={{ width: `${bag.percent}%` }} />
                  </div>

                  <ul className="packing-items">
                    {bag.items.map((item) => (
                      <li key={item.id} className={item.packed ? 'packed' : ''}>
                        <label className="pack-check">
                          <input
                            type="checkbox"
                            checked={!!item.packed}
                            onChange={() => togglePacked(item)}
                          />
                          <span />
                        </label>

                        <div className="pack-item-content">
                          <strong>{getItemName(item)}</strong>
                          <small>{getCategory(item)}</small>
                        </div>

                        <button
                          type="button"
                          className="remove-pack-item"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove packing item"
                        >
                          ✕
                        </button>
                      </li>
                    ))}

                    {bag.items.length === 0 && <EmptyBagState selectedBag={selectedBag} />}
                  </ul>
                </article>
              ))}
            </div>
          </main>
        </div>
      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
.packing-page {
  min-height: calc(100vh - 76px);
  padding: 68px 24px;
}

.packing-shell {
  width: min(100%, 1160px);
  margin: 0 auto;
}

.packing-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.packing-kicker {
  margin: 0 0 10px;
  color: var(--accent-3);
  font-size: 13px;
  font-weight: 950;
  letter-spacing: 0.26em;
  text-transform: uppercase;
}

.packing-hero h1 {
  margin: 0;
  color: var(--text);
  font-size: clamp(46px, 7vw, 82px);
  line-height: 0.92;
  letter-spacing: -0.075em;
  font-weight: 950;
  text-shadow: 0 18px 52px rgba(9, 6, 18, 0.42);
}

.packing-hero p:not(.packing-kicker) {
  max-width: 660px;
  margin: 14px 0 0;
  color: var(--text-soft);
  font-size: 17px;
  line-height: 1.65;
  font-weight: 700;
}

.packing-summary {
  min-width: 180px;
  padding: 18px;
  border-radius: 26px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.055)),
    rgba(21, 15, 34, 0.46);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 24px 70px rgba(9, 6, 18, 0.22);
  backdrop-filter: blur(18px);
}

.packing-summary span {
  display: block;
  color: #fff;
  font-size: 34px;
  line-height: 1;
  font-weight: 950;
}

.packing-summary strong {
  display: block;
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.summary-track,
.bag-progress {
  height: 8px;
  overflow: hidden;
  margin-top: 14px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
}

.summary-track i,
.bag-progress i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 20px rgba(255, 122, 184, 0.3);
}

.packing-layout {
  display: grid;
  grid-template-columns: 282px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.packing-sidebar,
.packing-main,
.bag-card {
  border-radius: 34px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.055)),
    rgba(21, 15, 34, 0.52);
  border: 1px solid rgba(255,255,255,0.16);
  box-shadow: 0 28px 90px rgba(9, 6, 18, 0.28);
  backdrop-filter: blur(20px);
}

.packing-sidebar {
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

.bag-filter {
  min-height: 48px;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border-radius: 16px;
  color: rgba(255, 248, 243, 0.76);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.bag-filter:hover {
  color: #fff;
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.1);
}

.bag-filter.active {
  color: #fff;
  background:
    linear-gradient(135deg, rgba(255,122,184,0.22), rgba(154,92,255,0.18)),
    rgba(255,255,255,0.08);
  border-color: rgba(255,122,184,0.28);
}

.bag-filter span {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
}

.bag-filter strong {
  overflow: hidden;
  font-size: 14px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bag-filter em {
  min-width: 38px;
  min-height: 24px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: rgba(255, 248, 243, 0.78);
  background: rgba(255,255,255,0.09);
  font-size: 12px;
  font-style: normal;
  font-weight: 950;
}

.status-pills {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.status-pills button,
.reset-view {
  min-height: 40px;
  border-radius: 14px;
  color: rgba(255, 248, 243, 0.78);
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  font-weight: 900;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.status-pills button:hover,
.reset-view:hover {
  color: #fff;
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.18);
}

.status-pills button.active {
  color: #fff;
  background: linear-gradient(135deg, rgba(255,122,184,0.25), rgba(154,92,255,0.18));
  border-color: rgba(255,122,184,0.28);
}

.packing-search input {
  width: 100%;
  min-height: 44px;
}

.packing-main {
  padding: clamp(20px, 3vw, 28px);
}

.packing-main__top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.packing-main__top h2 {
  margin: 0;
  color: var(--text);
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1;
  letter-spacing: -0.055em;
  font-weight: 950;
}

.packing-main__top p {
  margin: 8px 0 0;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 750;
}

.packing-add {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 150px 150px auto;
  gap: 10px;
  margin-bottom: 18px;
}

.packing-add input {
  min-height: 48px;
}

.packing-add button {
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

.packing-add button:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 52px rgba(255, 122, 184, 0.28);
}

.bag-grid {
  display: grid;
  gap: 14px;
}

.bag-card {
  padding: 18px;
  border-radius: 28px;
}

.bag-card__top {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 13px;
}

.bag-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(255,122,184,0.22), rgba(154,92,255,0.16)),
    rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  font-size: 26px;
}

.bag-card h3 {
  margin: 0;
  color: var(--text);
  font-size: 22px;
  line-height: 1;
  letter-spacing: -0.04em;
  font-weight: 950;
}

.bag-card p {
  margin: 6px 0 0;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 800;
}

.bag-count {
  min-width: 58px;
  min-height: 32px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #ffc9e5;
  background: rgba(255,122,184,0.12);
  border: 1px solid rgba(255,122,184,0.18);
  font-size: 12px;
  font-weight: 950;
}

.packing-items {
  display: grid;
  gap: 9px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.packing-items li {
  min-height: 58px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 18px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
}

.packing-items li.packed .pack-item-content strong {
  text-decoration: line-through;
  opacity: 0.62;
}

.pack-check {
  position: relative;
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.pack-check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.pack-check span {
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.34);
  background: rgba(255,255,255,0.06);
}

.pack-check input:checked + span {
  border-color: transparent;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 12px 26px rgba(255,122,184,0.2);
}

.pack-check input:checked + span::after {
  content: "✓";
  color: #fff;
  font-size: 13px;
  font-weight: 950;
}

.pack-item-content {
  display: grid;
  gap: 4px;
}

.pack-item-content strong {
  color: var(--text);
  font-size: 15px;
  font-weight: 900;
}

.pack-item-content small {
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 800;
}

.remove-pack-item {
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

.remove-pack-item:hover {
  color: #fff;
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.12);
}

.packing-empty-state {
  display: grid;
  gap: 6px;
  place-items: center;
  min-height: 96px;
  padding: 18px;
  text-align: center;
  color: var(--text-muted);
  border-radius: 20px;
  background: rgba(255,255,255,0.055);
  border: 1px dashed rgba(255,255,255,0.14);
}

.packing-empty-state strong {
  color: var(--text);
  font-size: 15px;
  font-weight: 950;
}

.packing-empty-state span {
  max-width: 280px;
  font-size: 13px;
  line-height: 1.4;
  font-weight: 700;
}

.packing-add input,
.packing-search input {
  color: #fff8f3;
  background: rgba(18, 12, 29, 0.62);
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
}

.packing-add input::placeholder,
.packing-search input::placeholder {
  color: rgba(255, 248, 243, 0.42);
}

.packing-add input:focus,
.packing-search input:focus {
  border-color: rgba(255, 122, 184, 0.64);
  box-shadow: 0 0 0 4px rgba(255, 122, 184, 0.12);
}

@media (max-width: 980px) {
  .packing-layout {
    grid-template-columns: 1fr;
  }

  .packing-sidebar {
    position: static;
  }

  .sidebar-section:first-child {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sidebar-title {
    grid-column: 1 / -1;
  }

  .packing-add {
    grid-template-columns: 1fr 1fr;
  }

  .packing-add button {
    grid-column: 1 / -1;
  }
}

@media (max-width: 680px) {
  .packing-page {
    padding: 42px 16px;
  }

  .packing-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .packing-summary {
    width: 100%;
  }

  .sidebar-section:first-child,
  .packing-add {
    grid-template-columns: 1fr;
  }

  .packing-sidebar,
  .packing-main {
    border-radius: 26px;
  }

  .bag-card {
    border-radius: 24px;
  }

  .bag-card__top {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .bag-count {
    grid-column: 2;
    justify-self: start;
  }

  .packing-items li {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .remove-pack-item {
    grid-column: 2;
    justify-self: start;
  }
}
`;
