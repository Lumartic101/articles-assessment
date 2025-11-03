import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createArticle, fetchArticle, updateArticle } from "../api";
import "./page.css";

export default function ArticleForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(isEdit);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!isEdit) return;
      setInitialLoad(true);
      setErr("");
      try {
        const a = await fetchArticle(id);
        if (!ignore && a) {
          setTitle(a.title || "");
          setContent(a.content || "");
          if (a.image_path) {
            setPreview(`${import.meta.env.VITE_API_BASE_URL?.replace("/api","")}/storage/${a.image_path}`);
          }
        }
      } catch (e) {
        setErr(e?.response?.data?.message || "Artikel laden mislukt");
      } finally {
        setInitialLoad(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id, isEdit]);

  const validate = () => {
    if (!title.trim()) return "Titel is verplicht.";
    if ((content?.trim()?.length || 0) < 10) return "Content te kort.";
    return "";
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setLoading(true);
    setErr("");
    try {
      const payload = { title, content };
      if (image) payload.image = image;
      if (isEdit) await updateArticle(id, payload);
      else await createArticle(payload);
      navigate("/");
    } catch (e) {
      setErr(e?.response?.data?.message || "Opslaan mislukt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-container">
      <h2>{isEdit ? "Artikel bewerken" : "Nieuw artikel"}</h2>
      {initialLoad ? (
        <p>Laden…</p>
      ) : (
        <form onSubmit={onSubmit} className="card centered-form">
          <label>Titel *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel"
          />

          <label>Content *</label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Schrijf iets moois…"
          />

          <label>Afbeelding (optioneel)</label>
          <input type="file" accept="image/*" onChange={onFileChange} />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxWidth: "400px",
                margin: "10px auto",
                display: "block",
                borderRadius: "8px",
              }}
            />
          )}

          {err && <p className="error">{err}</p>}

          <div className="row">
            <button type="submit" disabled={loading}>
              {loading ? "Bezig..." : isEdit ? "Bijwerken" : "Aanmaken"}
            </button>
            <Link to="/" className="secondary">Annuleren</Link>
          </div>
        </form>
      )}
    </div>
  );
}
