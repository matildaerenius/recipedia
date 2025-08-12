import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosPrivate from "../../config/axiosPrivate";
import "./MealPlan.css";

// Ordning: Mån–Sön
const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];
const DAY_LABEL = {
  MONDAY: "Måndag",
  TUESDAY: "Tisdag",
  WEDNESDAY: "Onsdag",
  THURSDAY: "Torsdag",
  FRIDAY: "Fredag",
  SATURDAY: "Lördag",
  SUNDAY: "Söndag",
};

const emptyEntry = { recipeId: null, title: "", imageUrl: "" };

export default function MealPlan() {
  const [plan, setPlan] = useState({ weekStart: null, entries: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal/form state
  const [showModal, setShowModal] = useState(false);
  const [activeDay, setActiveDay] = useState(null);
  const [form, setForm] = useState(emptyEntry);

  // Support “välj dag för recept” när man navigerar hit med state
  const location = useLocation();
  const navigate = useNavigate();
  const pickedRecipe = location.state?.recipe || null;

  // indexera entries per dag för enkel render
  const byDay = useMemo(() => {
    const map = {};
    (plan.entries || []).forEach((e) => {
      map[e.dayOfWeek] = e;
    });
    return map;
  }, [plan]);

  const fetchPlan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosPrivate.get("/api/mealplan/week");
      setPlan(res.data || { weekStart: null, entries: [] });
    } catch (e) {
      setError(e?.response?.data || "Kunde inte hämta veckans plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const openAddForDay = (day) => {
    setActiveDay(day);
    // Om vi har ett valt recept via navigation → förifyll och lägg direkt
    if (pickedRecipe) {
      handleAdd(day, {
        recipeId: pickedRecipe.id,
        title: pickedRecipe.title,
        imageUrl: pickedRecipe.image,
      });
      return;
    }
    // annars visa modal för manuellt val/inmatning
    setForm(emptyEntry);
    setShowModal(true);
  };

  const handleAdd = async (day, data) => {
    try {
      await axiosPrivate.post("/api/mealplan/add", {
        dayOfWeek: day,
        recipeId: Number(data.recipeId),
        title: data.title,
        imageUrl: data.imageUrl,
      });
      setShowModal(false);
      setActiveDay(null);
      await fetchPlan();
      // rensa pickat recept från history när det placerats
      if (pickedRecipe) navigate(".", { replace: true, state: {} });
    } catch (e) {
      alert(e?.response?.data || "Kunde inte spara på dagen.");
    }
  };

  const handleRemove = async (day) => {
    try {
      await axiosPrivate.delete(`/api/mealplan/remove/${day}`);
      await fetchPlan();
    } catch (e) {
      alert(e?.response?.data || "Kunde inte ta bort från dagen.");
    }
  };

  const weekLabel = useMemo(() => {
    if (!plan.weekStart) return "";
    try {
      const d = new Date(plan.weekStart);
      return d.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return plan.weekStart;
    }
  }, [plan.weekStart]);

  return (
    <div className="home-page meal-page">
      <div className="container">
        <div className="search-header card">
          <div className="search-header-content">
            <h1>Meal Plan</h1>
            {weekLabel && (
              <p className="week-subtle">Vecka start: {weekLabel}</p>
            )}
            {pickedRecipe && (
              <div className="pick-banner">
                Välj en dag för: <strong>{pickedRecipe.title}</strong>
                <button
                  className="link-cancel"
                  onClick={() => navigate(".", { replace: true, state: {} })}
                >
                  Avbryt
                </button>
              </div>
            )}
          </div>
          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
        </div>

        {loading ? (
          <p className="loading">Laddar...</p>
        ) : (
          <div className="week-grid">
            {DAYS.map((day) => {
              const entry = byDay[day];
              return (
                <section key={day} className="day-card card">
                  <header className="day-header">
                    <h3>{DAY_LABEL[day]}</h3>
                    {entry ? (
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleRemove(day)}
                        title="Ta bort från dagen"
                      >
                        Ta bort
                      </button>
                    ) : null}
                  </header>

                  {entry ? (
                    <>
                      <div className="image-wrap">
                        <img
                          src={entry.imageUrl}
                          alt={entry.title}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="day-body">
                        <h4 className="title" title={entry.title}>
                          {entry.title}
                        </h4>
                        <div className="day-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              navigate(`/recipes/${entry.recipeId}`)
                            }
                          >
                            Visa recept
                          </button>
                          <button
                            className="btn"
                            onClick={() => openAddForDay(day)}
                            title="Ersätt med annat recept"
                          >
                            Byt recept
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="empty-slot">
                      <p>Ingen rätt vald.</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => openAddForDay(day)}
                      >
                        Lägg till
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal för manuell inmatning */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Lägg till recept – {activeDay ? DAY_LABEL[activeDay] : ""}</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.recipeId || !form.title) return;
                handleAdd(activeDay, form);
              }}
            >
              <label className="field">
                <span>Recipe ID</span>
                <input
                  type="number"
                  value={form.recipeId || ""}
                  onChange={(e) =>
                    setForm({ ...form, recipeId: e.target.value })
                  }
                  required
                />
              </label>

              <label className="field">
                <span>Titel</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </label>

              <label className="field">
                <span>Bild-URL</span>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                />
              </label>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Spara
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
