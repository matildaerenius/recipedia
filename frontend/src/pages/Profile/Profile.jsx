import React, { useEffect, useMemo, useState } from "react";
import axiosPrivate from "../../config/axiosPrivate";
import "./Profile.css";

const Profile = () => {
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

  const token = useMemo(
    () => localStorage.getItem("jwt") || sessionStorage.getItem("jwt"),
    []
  );

  useEffect(() => {
    let active = true;

    const loadMe = async () => {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axiosPrivate.get("/api/user/me");
        if (!active) return;

        console.log("GET /api/user/me ->", res.status, res.data); // <— see what we got

        const me = res.data || {};
        setForm({
          firstName: me.firstName ?? "",
          lastName: me.lastName ?? "",
          username: me.username ?? "",
          email: me.email ?? "",
          address: me.address ?? "",
        });
        setPreference((me.preference || "NONE").toString().toUpperCase());
      } catch (e) {
        console.error("Fetch /api/user/me failed:", e);
        setError(
          e.response?.data?.message ||
            `Failed to load profile (status ${e.response?.status ?? "?"}).`
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMe();
    return () => {
      active = false;
    };
  }, [token]);

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
    } catch (e) {
      setError(e.response?.data?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const savePreference = async () => {
    setPrefSaving(true);
    setError("");
    try {
      await axiosPrivate.put("/api/user/preference", preference, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      setError(e.response?.data?.message || "Could not save preference.");
    } finally {
      setPrefSaving(false);
    }
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
        <section className="profile-card">
          <h2>Min profil</h2>

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
            {saving ? "Sparar…" : "Spara profil"}
          </button>
        </section>

        <section className="profile-card">
          <h2>Kostpreferens</h2>
          <p className="hint">Används i recept-matchning och filtrering.</p>

          <div className="chips">
            {[
              { key: "NONE", label: "Ingen" },
              { key: "VEGAN", label: "Vegan" },
              { key: "VEGETARIAN", label: "Vegetarian" },
              { key: "LACTOSE_FREE", label: "Laktosfri" },
              { key: "GLUTEN_FREE", label: "Glutenfri" },
              { key: "DAIRY_FREE", label: "Dairy-free" },
              { key: "NUT_FREE", label: "Nötfri" },
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
            {prefSaving ? "Sparar…" : "Spara preferens"}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Profile;
