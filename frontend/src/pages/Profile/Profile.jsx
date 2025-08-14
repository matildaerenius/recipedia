import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "../../config/axiosPrivate";
import "./Profile.css";

// ---- Normalizers ----
const normalizeUser = (raw) => {
  const r = raw || {};
  const pick = (...keys) => {
    for (const k of keys) if (r[k] !== undefined && r[k] !== null) return r[k];
    return "";
  };
  const pref = (
    pick("preference", "dietPreference", "diet_preference") || "NONE"
  )
    .toString()
    .toUpperCase();

  return {
    firstName: pick("firstName", "firstname", "first_name"),
    lastName: pick("lastName", "lastname", "last_name"),
    username: pick("username", "userName", "name"),
    email: pick("email"),
    address: pick("address", "adress"),
    preference: pref,
  };
};

const normalizeReview = (raw) => {
  const r = raw || {};
  const rec = r.recipe || {};
  return {
    id: r.id ?? r.reviewId ?? null,
    recipeId: r.recipeId ?? rec.id ?? null,
    recipeTitle: r.recipeTitle ?? r.title ?? rec.title ?? "",
    rating: Number(r.rating ?? r.score ?? r.rank ?? 0),
    comment: r.comment ?? r.text ?? r.review ?? "",
    createdAt: r.createdAt ?? r.created_at ?? r.date ?? null,
  };
};

const Profile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefSaving, setPrefSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    address: "",
  });
  const [preference, setPreference] = useState("NONE");

  // ---- Reviews state ----
  const [reviews, setReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState("");

  const fetchMe = useCallback(async () => {
    setError("");
    try {
      setLoading(true);
      const res = await axiosPrivate.get("/api/user/me");
      const root = res?.data?.data ?? res?.data?.user ?? res?.data ?? {};
      const u = normalizeUser(root);
      setForm({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        username: u.username || "",
        email: u.email || "",
        address: u.address || "",
      });
      setPreference(u.preference || "NONE");
    } catch (e) {
      const status = e?.response?.status;
      setError(
        e?.response?.data?.message ||
          (status === 401
            ? "Not logged in."
            : `Failed to load profile (status ${status ?? "?"}).`)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    setReviewsError("");
    try {
      const res = await axiosPrivate.get("/api/ratings/my");
      const list = Array.isArray(res?.data) ? res.data : res?.data?.items || [];
      setReviews(list.map(normalizeReview).filter((x) => x.recipeId));
    } catch (e) {
      setReviews([]);
      setReviewsError(
        e?.response?.data?.message || "Could not load your ratings & comments."
      );
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!active) return;
      await fetchMe();
      await fetchReviews();
    })();
    return () => {
      active = false;
    };
  }, [fetchMe, fetchReviews]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const saveProfile = async () => {
    setSaving(true);
    setError("");
    try {
      await axiosPrivate.put("/api/user/update", {
        firstName: form.firstName || null,
        lastName: form.lastName || null,
        username: form.username || null,
        email: form.email || null,
        address: form.address || null,
      });
      await fetchMe();
    } catch (e) {
      setError(e?.response?.data?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const savePreference = async () => {
    setPrefSaving(true);
    setError("");
    try {
      await axiosPrivate.put(
        "/api/user/preference",
        { preference },
        { headers: { "Content-Type": "application/json" } }
      );
      await fetchMe();
    } catch (e) {
      setError(e?.response?.data?.message || "Could not save preference.");
    } finally {
      setPrefSaving(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const stars = (n) => {
    const v = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
    return "★".repeat(v) + "☆".repeat(5 - v);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-grid">
        {/* Profile info */}
        <section className="profile-card">
          <h2>My profile</h2>

          <div className="profile-two-col">
            <div className="form-group">
              <label>First name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                placeholder="First name"
              />
            </div>
            <div className="form-group">
              <label>Last name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="profile-two-col">
            <div className="form-group">
              <label>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="Username"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder="Street, city"
            />
          </div>

          {error && <div className="profile-error">{error}</div>}

          <button
            className="primary-btn"
            onClick={saveProfile}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </section>

        {/* Diet preference */}
        <section className="profile-card">
          <h2>Diet preference</h2>
          <p className="hint">Used in generated recipes</p>

          <div className="chips">
            {[
              { key: "NONE", label: "None" },
              { key: "VEGAN", label: "Vegan" },
              { key: "VEGETARIAN", label: "Vegetarian" },
              { key: "LACTOSE_FREE", label: "Lactose-free" },
              { key: "GLUTEN_FREE", label: "Gluten-free" },
              { key: "DAIRY_FREE", label: "Dairy-free" },
              { key: "NUT_FREE", label: "Nut-free" },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`chip ${
                  preference === opt.key ? "chip-active" : ""
                }`}
                onClick={() => setPreference(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <hr className="divider" />
          <button
            className="primary-btn"
            onClick={savePreference}
            disabled={prefSaving}
          >
            {prefSaving ? "Saving…" : "Save preference"}
          </button>
        </section>

        {/* ---- ratings & comments ---- */}
        <section className="profile-card" style={{ gridColumn: "1 / -1" }}>
          <h2>My ratings & comments</h2>

          {averageRating && (
            <p className="hint" style={{ marginTop: 0 }}>
              Average rating: <strong>{averageRating}</strong> / 5 (
              {reviews.length} total)
            </p>
          )}

          {reviewsError && <div className="profile-error">{reviewsError}</div>}

          {reviews.length === 0 ? (
            <p className="hint">You haven't rated any recipes yet.</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((r) => (
                <div
                  key={r.id ?? `${r.recipeId}-${r.createdAt}`}
                  className="review-item"
                >
                  <div className="review-head">
                    <div className="review-title" title={r.recipeTitle}>
                      {r.recipeTitle}
                    </div>
                    <div
                      className="review-stars"
                      aria-label={`${r.rating} out of 5`}
                    >
                      {stars(r.rating)}
                    </div>
                  </div>

                  {r.comment && <p className="review-text">{r.comment}</p>}

                  <div className="review-foot">
                    <span className="review-date">
                      {formatDate(r.createdAt)}
                    </span>
                    {r.recipeId && (
                      <button
                        className="btn btn-small"
                        onClick={() => navigate(`/recipes/${r.recipeId}`)}
                      >
                        View recipe
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
