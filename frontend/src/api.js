import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// --- Auth ---
export async function loginRequest({ email, password }) {
  // Verwacht: { token: "..." }
  const { data } = await api.post("/token/login", { email, password });
  return data;
}

// --- Articles ---
export async function fetchArticles(params = {}) {
  // params: { title?: string, created_from?: string, created_to?: string }
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      search.append(k, v);
    }
  });

  const url = search.toString() ? `/articles?${search}` : `/articles`;
  const { data } = await client.get(url);
  // Als je backend paginate() gebruikt, haal dan hier .data uit data
  return Array.isArray(data) ? data : (data.data ?? []);
}

export async function fetchArticle(id) {
  const { data } = await api.get(`/articles/${id}`);
  return data;
}

export async function createArticle(payload) {
  const form = new FormData();
  for (const key in payload) {
    if (payload[key] !== undefined && payload[key] !== null)
      form.append(key, payload[key]);
  }

  const { data } = await api.post("/articles", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateArticle(id, payload) {
  const form = new FormData();
  for (const key in payload) {
    if (payload[key] !== undefined && payload[key] !== null)
      form.append(key, payload[key]);
  }

  const { data } = await api.put(`/articles/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteArticle(id) {
  const { data } = await api.delete(`/articles/${id}`);
  return data;
}
