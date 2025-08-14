import React, { useEffect, useMemo, useState } from "react";
import axiosPrivate from "../../config/axiosPrivate";
import "./ShoppingList.css";

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // add-form
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);

  const uncheckedCount = useMemo(
    () => items.filter((i) => !i.checked).length,
    [items]
  );
  const checkedCount = items.length - uncheckedCount;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosPrivate.get("/api/shopping-list");
      setItems(res.data || []);
    } catch (e) {
      setError(e?.response?.data || "Kunde inte hämta inköpslistan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const res = await axiosPrivate.post("/api/shopping-list/add", {
        name: trimmed,
        quantity: Number(qty) || 1,
      });
      setItems((prev) => [...prev, res.data]);
      setName("");
      setQty(1);
    } catch (e) {
      alert(e?.response?.data || "Kunde inte lägga till varan.");
    }
  };

  const removeItem = async (id) => {
    // optimistic UI
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id));
    try {
      await axiosPrivate.delete(`/api/shopping-list/remove/${id}`);
    } catch (e) {
      setItems(prev);
      alert(e?.response?.data || "Kunde inte ta bort varan.");
    }
  };

  const toggleChecked = async (id) => {
    // optimistic toggle
    setItems((p) =>
      p.map((x) => (x.id === id ? { ...x, checked: !x.checked } : x))
    );
    try {
      await axiosPrivate.patch(`/api/shopping-list/check/${id}`);
    } catch (e) {
      // rollback
      setItems((p) =>
        p.map((x) => (x.id === id ? { ...x, checked: !x.checked } : x))
      );
      console.error(e);
    }
  };

  const generateFromMealPlan = async () => {
    setLoading(true);
    try {
      await axiosPrivate.post("/api/shopping-list/generate");
      await load();
    } catch (e) {
      alert(e?.response?.data || "Kunde inte generera från Meal Plan.");
    } finally {
      setLoading(false);
    }
  };

  const clearChecked = async () => {
    const toDelete = items.filter((i) => i.checked);
    if (toDelete.length === 0) return;
    // optimistic
    const prev = items;
    setItems((p) => p.filter((i) => !i.checked));
    try {
      await Promise.all(
        toDelete.map((i) =>
          axiosPrivate.delete(`/api/shopping-list/remove/${i.id}`)
        )
      );
    } catch (e) {
      setItems(prev);
      alert("Kunde inte rensa markerade just nu.");
    }
  };

  return (
    <div className="home-page shopping-page">
      <div className="container">
        <div className="search-header card">
          <div className="search-header-content">
            <h1>Shopping List</h1>
            <p className="sub">
              {uncheckedCount} kvar • {checkedCount} klara
            </p>

            <div className="actions-row">
              <button
                className="btn btn-primary"
                onClick={generateFromMealPlan}
                disabled={loading}
                title="Skapa lista från din Meal Plan"
              >
                Generera från Meal Plan
              </button>
              <button
                className="btn"
                onClick={clearChecked}
                disabled={loading || checkedCount === 0}
                title="Ta bort alla som är markerade"
              >
                Rensa markerade
              </button>
            </div>
          </div>

          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="list-card card">
          <form className="add-row" onSubmit={addItem}>
            <input
              className="input"
              type="text"
              placeholder="Lägg till vara…"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="qty-input"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              title="Antal"
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Lägg till
            </button>
          </form>

          {loading ? (
            <p className="loading">Laddar…</p>
          ) : items.length > 0 ? (
            <ul className="shopping-list">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`shopping-item ${item.checked ? "done" : ""}`}
                >
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecked(item.id)}
                    />
                    <span aria-hidden="true" />
                  </label>

                  <div className="name" title={item.name}>
                    {item.name}
                  </div>

                  <div className="qty">x{item.quantity}</div>

                  <button
                    className="remove"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Ta bort ${item.name}`}
                    title="Ta bort"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-recipes">Listan är tom. Lägg till något! 📝</p>
          )}
        </div>
      </div>
    </div>
  );
}
