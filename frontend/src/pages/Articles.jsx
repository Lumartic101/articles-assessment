import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteArticle, fetchArticles } from "../api";
import { useAuth } from "../AuthContext";
import "./page.css";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const list = await fetchArticles();
      setArticles(list);
    } catch (e) {
      setErr(e?.response?.data?.message || "Kon artikelen niet laden");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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
              <button onClick={logout} className="secondary">
                Uitloggen
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>Inloggen</button>
          )}
        </div>
      </div>

      {loading && <p>Laden…</p>}
      {err && <p className="error">{err}</p>}
      {!loading && !articles.length && <p>Geen artikelen.</p>}

      <ul className="list">
        {articles.map((a) => (
          <li key={a.id} className="card article-card">
            {/* Afbeelding tonen als die bestaat */}
            {a.image_url && (
              <img
                src={a.image_url}
                alt={a.title}
                className="article-image"
              />
            )}

            <h3>{a.title}</h3>
            <small className="muted">
              {a.created_at
                ? new Date(a.created_at).toLocaleString()
                : ""}
            </small>
            <p style={{ whiteSpace: "pre-wrap" }}>
              {a.content?.length > 240
                ? a.content.slice(0, 240) + "…"
                : a.content}
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
