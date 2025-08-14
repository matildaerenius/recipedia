import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "../../config/axiosPrivate";
import "../Home/Home.css";

const Favorites = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosPrivate.get("/api/saved-recipes");
      setItems(res.data || []);
    } catch (e) {
      setError(e?.response?.data || "Could not load favorites right now.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (savedId) => {
    const prev = items;
    setItems(prev.filter((x) => x.id !== savedId));
    try {
      await axiosPrivate.delete(`/api/saved-recipes/${savedId}`);
    } catch (e) {
      setItems(prev);
      console.error(e);
      alert("Failed to remove favorite. Try again.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="home-page">
      <div className="container">
        <div className="search-header card">
          <div className="search-header-content">
            <h1>My Favorites</h1>
          </div>
          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
        </div>

        {loading ? (
          <p className="loading">Loading favorites...</p>
        ) : items.length > 0 ? (
          <div className="recipe-grid">
            {items.map((item) => (
              <article key={item.id} className="recipe-card card">
                {}
                <button
                  className="like-bubble active"
                  onClick={() => remove(item.id)}
                  aria-label="Remove from favorites"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="heart-icon"
                    aria-hidden="true"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>

                <div className="image-wrap">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <h3 className="title" title={item.title}>
                  {item.title}
                </h3>

                <div className="card-footer only-primary">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/recipes/${item.recipeId}`)}
                    title="Show full recipe"
                  >
                    Show full
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="no-recipes">You have no favorites yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
