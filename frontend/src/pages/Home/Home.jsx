import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "../../config/axiosPrivate";
import "./Home.css";

const LS_KEY = "likedRecipes";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState("100");
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(20);
  const navigate = useNavigate();

  const [liked, setLiked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    } catch {
      return {};
    }
  });

  const [savedMap, setSavedMap] = useState({});

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(liked));
  }, [liked]);

  const likedCount = useMemo(() => Object.keys(savedMap).length, [savedMap]);

  const loadFavorites = async () => {
    try {
      const res = await axiosPrivate.get("/api/saved-recipes");
      const list = res.data || [];
      const map = {};
      const likedFromServer = {};
      list.forEach((r) => {
        map[r.recipeId] = r.id;
        likedFromServer[r.recipeId] = true;
      });
      setSavedMap(map);
      setLiked(likedFromServer);
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  };

  const fetchRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosPrivate.get("/api/recipes/generate", {
        params: { match, limit },
      });
      const data = res.data;
      if (Array.isArray(data)) {
        setRecipes(data);
      } else if (typeof data === "string") {
        setRecipes([]);
        setError(data);
      } else {
        setRecipes([]);
        setError("Unknown error from server");
      }
    } catch (err) {
      const msg =
        err?.response?.status === 401 || err?.response?.status === 403
          ? "You are not logged in. Please login and try again."
          : err?.response?.data || "Could not load recipes right now.";
      setError(msg);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigga ny hämtning vid ändrad match/limit
  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match, limit]);

  // Spara favorit (optimistic UI)
  const likeRecipe = async (recipe) => {
    setLiked((p) => ({ ...p, [recipe.id]: true }));
    try {
      const payload = {
        recipeId: recipe.id,
        title: recipe.title,
        imageUrl: recipe.image,
      };
      const res = await axiosPrivate.post("/api/saved-recipes/save", payload);
      const savedId = res?.data?.id;
      if (savedId) {
        setSavedMap((m) => ({ ...m, [recipe.id]: savedId }));
      } else {
        await loadFavorites();
      }
    } catch (err) {
      if (err?.response?.status === 409) {
        await loadFavorites();
      } else {
        console.error("Failed to save favorite", err);
        setLiked((p) => ({ ...p, [recipe.id]: false }));
      }
    }
  };

  const unlikeRecipe = async (recipeId) => {
    const savedId = savedMap[recipeId];

    setLiked((p) => ({ ...p, [recipeId]: false }));
    setSavedMap((m) => {
      const n = { ...m };
      delete n[recipeId];
      return n;
    });

    try {
      if (savedId) {
        await axiosPrivate.delete(`/api/saved-recipes/${savedId}`);
      } else {
        await loadFavorites();
      }
    } catch (err) {
      console.error("Failed to remove favorite", err);
      // rollback
      setLiked((p) => ({ ...p, [recipeId]: true }));
      await loadFavorites();
    }
  };

  const handleToggleLike = (recipe) => {
    const isLiked = !!liked[recipe.id];
    if (isLiked) unlikeRecipe(recipe.id);
    else likeRecipe(recipe);
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="search-header card">
          <div className="likes-pill">♥ {likedCount}</div>

          <div className="search-header-content">
            <h1>Find Recipes</h1>

            <div className="match-toggle">
              <label className="radio">
                <input
                  type="radio"
                  value="100"
                  checked={match === "100"}
                  onChange={(e) => setMatch(e.target.value)}
                />
                <span>100% Match</span>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  value="80"
                  checked={match === "80"}
                  onChange={(e) => setMatch(e.target.value)}
                />
                <span>80% Match</span>
              </label>
            </div>

            <button
              onClick={fetchRecipes}
              className="search-button"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search Recipes"}
            </button>
          </div>

          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
        </div>

        {loading ? (
          <p className="loading">Loading recipes...</p>
        ) : Array.isArray(recipes) && recipes.length > 0 ? (
          <>
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <article key={recipe.id} className="recipe-card card">
                  {}
                  <button
                    className={`like-bubble ${
                      liked[recipe.id] ? "active" : ""
                    }`}
                    onClick={() => handleToggleLike(recipe)}
                    aria-pressed={!!liked[recipe.id]}
                    aria-label={
                      liked[recipe.id] ? "Remove like" : "Like recipe"
                    }
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
                      src={recipe.image}
                      alt={recipe.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <h3 className="title" title={recipe.title}>
                    {recipe.title}
                  </h3>

                  <div className="badges">
                    <span className="badge badge-ok">
                      ✅ Used: {recipe.usedIngredientCount}
                    </span>
                    <span className="badge badge-warn">
                      ❌ Missed: {recipe.missedIngredientCount}
                    </span>
                  </div>

                  <div className="card-footer only-primary">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/recipes/${recipe.id}`)}
                      title="Visa hela receptet"
                    >
                      Show full
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Visa fler – under griden */}
            {recipes.length >= limit && (
              <div className="load-more">
                <button
                  className="search-button"
                  disabled={loading}
                  onClick={() => setLimit((l) => Math.min(l + 20, 50))}
                >
                  {loading ? "Loading..." : "Show more"}
                </button>
              </div>
            )}
          </>
        ) : !error ? (
          <p className="no-recipes">No recipes found. Try again!</p>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
