// src/api.js
const API_URL = "http://127.0.0.1:5001";

// ---------------- AUTH -----------------
export async function login(username, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: "Network error" };
  }
}

export async function register(username, password) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: "Network error" };
  }
}

// ---------------- DOCUMENTS -----------------
export async function getDocuments(userId) {
  try {
    const res = await fetch(`${API_URL}/documents/${userId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getDocument(docId) {
  try {
    const res = await fetch(`${API_URL}/document/${docId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function saveDocument(docId, content) {
  try {
    const res = await fetch(`${API_URL}/document/${docId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: "Network error" };
  }
}