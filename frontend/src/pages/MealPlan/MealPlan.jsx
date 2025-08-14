import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosPrivate from "../../config/axiosPrivate";
import "./MealPlan.css";

// Days Monday–Sunday for backend DayOfWeek enum
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
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const normalizeFavorite = (raw) => {
  const r = raw || {};
  const rec = r.recipe || {};
  return {
    id: r.recipeId ?? r.id ?? rec.id ?? null,
    title: r.title ?? r.name ?? rec.title ?? "",
    image: r.imageUrl ?? r.image ?? rec.imageUrl ?? rec.image ?? "",
  };
};

export default function MealPlan() {
  const [plan, setPlan] = useState({ weekStart: null, entries: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState([]);
  const [favFilter, setFavFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [activeDay, setActiveDay] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const pickedRecipe = location.state?.recipe || null;

  const byDay = useMemo(() => {
    const map = {};
    (plan.entries || []).forEach((e) => {
      map[e.dayOfWeek] = e;
    });
    return map;
  }, [plan]);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosPrivate.get("/api/mealplan/week");
      setPlan(res.data || { weekStart: null, entries: [] });
    } catch (e) {
      setError(
        e?.response?.data?.message || "Could not load this week's plan."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/api/saved-recipes");
      const list = Array.isArray(res.data) ? res.data : res.data?.items || [];
      setFavorites(list.map(normalizeFavorite).filter((f) => !!f.id));
    } catch (e) {
      console.error("GET /api/saved-recipes failed:", e);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    fetchPlan();
    fetchFavorites();
  }, [fetchPlan, fetchFavorites]);

  const weekLabel = useMemo(() => {
    if (!plan.weekStart) return "";
    try {
      const d = new Date(plan.weekStart);
      return d.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return plan.weekStart;
    }
  }, [plan.weekStart]);

  const handleAdd = async (day, fav) => {
    try {
      await axiosPrivate.post("/api/mealplan/add", {
        dayOfWeek: day,
        recipeId: Number(fav.id),
        title: fav.title,
        imageUrl: fav.image,
      });
      setShowModal(false);
      setActiveDay(null);
      await fetchPlan();
      if (pickedRecipe) navigate(".", { replace: true, state: {} });
    } catch (e) {
      alert(e?.response?.data?.message || "Could not save meal plan entry.");
    }
  };

  const handleRemove = async (day) => {
    try {
      await axiosPrivate.delete(`/api/mealplan/remove/${day}`);
      await fetchPlan();
    } catch (e) {
      alert(e?.response?.data?.message || "Could not remove from that day.");
    }
  };

  const openPickerForDay = (day) => {
    setActiveDay(day);

    if (pickedRecipe) {
      const normalized = normalizeFavorite(pickedRecipe);
      const isFav = favorites.some(
        (f) => String(f.id) === String(normalized.id)
      );
      if (isFav && normalized.id) {
        handleAdd(day, normalized);
        return;
      } else {
        alert("Only recipes in your Favorites can be added to the meal plan.");
      }
    }

    setShowModal(true);
  };

  const filteredFavorites = useMemo(() => {
    const q = favFilter.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter((f) => f.title.toLowerCase().includes(q));
  }, [favorites, favFilter]);

  return (
    <div className="home-page meal-page">
      <div className="container">
        <div className="search-header card">
          <div className="search-header-content">
            <h1>Meal Plan</h1>
            {weekLabel && (
              <p className="week-subtle">Week starts: {weekLabel}</p>
            )}

            {pickedRecipe && (
              <div className="pick-banner">
                Pick a day for: <strong>{pickedRecipe.title}</strong>
                <button
                  className="link-cancel"
                  onClick={() => navigate(".", { replace: true, state: {} })}
                >
                  Cancel
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
          <p className="loading">Loading…</p>
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
                        title="Remove from day"
                      >
                        Remove
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
                            View recipe
                          </button>
                          <button
                            className="btn btn-ghost"
                            onClick={() => openPickerForDay(day)}
                            title="Replace with another favorite"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="empty-slot">
                      <p>No recipe selected</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => openPickerForDay(day)}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Favorites picker modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Pick a favorite – {activeDay ? DAY_LABEL[activeDay] : ""}</h2>

            <div className="field" style={{ marginBottom: 12 }}>
              <input
                type="text"
                placeholder="Search favorites…"
                value={favFilter}
                onChange={(e) => setFavFilter(e.target.value)}
              />
            </div>

            {favorites.length === 0 ? (
              <p className="hint">
                You have no favorites yet. Go to <strong>Favorites</strong> to
                add some!
              </p>
            ) : (
              <div className="favorite-grid">
                {filteredFavorites.map((fav) => (
                  <button
                    key={fav.id}
                    type="button"
                    className="favorite-card"
                    onClick={() => handleAdd(activeDay, fav)}
                    title="Use this recipe"
                  >
                    <div className="image-wrap">
                      {fav.image ? (
                        <img src={fav.image} alt={fav.title} loading="lazy" />
                      ) : (
                        <div className="no-image">No image</div>
                      )}
                    </div>
                    <div className="fav-title" title={fav.title}>
                      {fav.title}
                    </div>
                  </button>
                ))}

                {filteredFavorites.length === 0 && (
                  <p className="hint">No favorites match your search.</p>
                )}
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
