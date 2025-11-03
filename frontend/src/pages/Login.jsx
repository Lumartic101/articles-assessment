import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./page.css";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !password) {
      setErr("Email en wachtwoord zijn verplicht.");
      return;
    }
    try {
      setLoading(true);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Login mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="card">
        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Wachtwoord</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && <p className="error">{err}</p>}

        <button disabled={loading} type="submit">
          {loading ? "Bezig..." : "Inloggen"}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        <Link to="/">← Terug naar artikelen</Link>
      </p>
    </div>
  );
}
