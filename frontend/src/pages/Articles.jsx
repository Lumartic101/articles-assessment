import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteArticle, fetchArticles } from "../api";
import { useAuth } from "../AuthContext";
import "./page.css";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // filters
  const [title, setTitle] = useState("");
  const [createdFrom, setCreatedFrom] = useState(""); // yyyy-mm-dd
  const [createdTo, setCreatedTo] = useState("");     // yyyy-mm-dd

  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  async function load(params = {}) {
    setErr("");
    setLoading(true);
    try {
      const list = await fetchArticles(params);
      setArticles(list);
    } catch (e) {
      setErr(e?.response?.data?.message || "Kon artikelen niet laden");
    } finally {
      setLoading(false);
    }
  }

  // kleine helper: van "yyyy-mm-dd" naar "yyyy-mm-dd" (al goed voor backend met date)
  const filters = useMemo(() => {
    const p = {};
    if (title.trim()) p.title = title.trim();
    if (createdFrom) p.created_from = createdFrom; // bv "2025-01-01"
    if (createdTo) p.created_to = createdTo;       // bv "2025-01-31"
    return p;
  }, [title, createdFrom, createdTo]);

  // debounce: 400ms na laatste wijziging
  useEffect(() => {
    const t = setTimeout(() => load(filters), 400);
    return () => clearTimeout(t);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // initial load (zonder filters)
  useEffect(() => {
    load({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetFilters() {
    setTitle("");
    setCreatedFrom("");
    setCreatedTo("");
  }

  async function onDelete(id) {
    if (!confirm("Weet je zeker dat je dit artikel wil verwijderen?")) return;
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Verwijderen mislukt");
    }
  }

  return (
    <div className="centered-container">
      <div className="toolbar">
        <h2>Artikelen</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {isAuthed ? (
            <>
              <button onClick={() => navigate("/articles/new")}>+ Nieuw</button>
              <button onClick={logout} className="secondary">Uitloggen</button>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>Inloggen</button>
          )}
        </div>
      </div>

      {/* Filterbalk */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Zoek op titel…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <label className="muted" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            Van:
            <input
              type="date"
              value={createdFrom}
              onChange={(e) => setCreatedFrom(e.target.value)}
            />
          </label>
          <label className="muted" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            Tot en met:
            <input
              type="date"
              value={createdTo}
              onChange={(e) => setCreatedTo(e.target.value)}
            />
          </label>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button className="secondary" onClick={resetFilters}>Reset</button>
            {/* Optioneel: forceer fetch meteen zonder debounce */}
            <button onClick={() => load(filters)}>Zoeken</button>
          </div>
        </div>
      </div>

      {loading && <p>Laden…</p>}
      {err && <p className="error">{err}</p>}
      {!loading && !articles.length && <p>Geen artikelen.</p>}

      <ul className="list">
        {articles.map((a) => (
          <li key={a.id} className="card article-card">
            {a.image_url && (
              <img src={a.image_url} alt={a.title} className="article-image" />
            )}

            <h3>{a.title}</h3>
            <small className="muted">
              {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
            </small>

            <p style={{ whiteSpace: "pre-wrap" }}>
              {a.content?.length > 240 ? a.content.slice(0, 240) + "…" : a.content}
            </p>

            <div className="row">
              <Link to={`/articles/${a.id}/edit`}>Bewerken</Link>
              {isAuthed && (
                <button onClick={() => onDelete(a.id)} className="danger">
                  Verwijderen
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
