import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "../../config/axiosPrivate";
import "./Home.css";

const LS_KEY = "likedRecipes";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState("100");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // likes (lokalt)
  const [liked, setLiked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    } catch {
      return {};
    }
  });
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(liked));
  }, [liked]);
  const toggleLike = (id) => setLiked((p) => ({ ...p, [id]: !p[id] }));
  const likedCount = useMemo(
    () => Object.values(liked).filter(Boolean).length,
    [liked]
  );

  const fetchRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosPrivate.get("/api/recipes/generate", {
        params: { match },
      });
      const data = res.data;
      if (Array.isArray(data)) setRecipes(data);
      else if (typeof data === "string") {
        setRecipes([]);
        setError(data);
      } else {
        setRecipes([]);
        setError("Oväntat svar från servern.");
      }
    } catch (err) {
      const msg =
        err?.response?.status === 401 || err?.response?.status === 403
          ? "Du är inte inloggad. Logga in och försök igen."
          : err?.response?.data || "Kunde inte hämta recept just nu.";
      setError(msg);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(); /* eslint-disable-next-line */
  }, [match]);

  return (
    <div className="home-page">
      <div className="container">
        <div className="search-header card">
          <h1>Find Recipes</h1>

          <div className="top-row">
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

            <div className="likes-pill" title="Gillade recept">
              ♥ {likedCount}
            </div>
          </div>

          <button
            onClick={fetchRecipes}
            className="search-button"
            disabled={loading}
          >
            {loading ? "Söker..." : "Search Recipes"}
          </button>

          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
        </div>

        {loading ? (
          <p className="loading">Loading recipes...</p>
        ) : Array.isArray(recipes) && recipes.length > 0 ? (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <article key={recipe.id} className="recipe-card card">
                <div className="image-wrap">
                  <img src={recipe.image} alt={recipe.title} loading="lazy" />
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

                <div className="card-footer">
                  <button
                    className={`btn btn-like ${
                      liked[recipe.id] ? "active" : ""
                    }`}
                    onClick={() => toggleLike(recipe.id)}
                    aria-pressed={!!liked[recipe.id]}
                  >
                    <span className="heart">♥</span>
                    {liked[recipe.id] ? " Gillad" : " Gilla"}
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                  >
                    Visa detaljer
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : !error ? (
          <p className="no-recipes">Inga recept hittades. Försök igen!</p>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
