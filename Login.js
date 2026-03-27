import React, { useState } from "react";
import { login, register } from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (isRegister) {
      res = await register(username, password);
      if (res.status === "registered") {
        setIsRegister(false);
        setError("Registered successfully! Please login.");
        return;
      }
    } else {
      res = await login(username, password);
      if (res.status === "ok") {
        onLogin(res.user_id);
        return;
      }
    }
    setError(res.error || "Something went wrong");
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isRegister ? "Login" : "Register"}
        </span>
      </p>
    </div>
  );
}