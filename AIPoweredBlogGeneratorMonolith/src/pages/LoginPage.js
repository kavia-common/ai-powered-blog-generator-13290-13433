import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";

/**
 * LoginPage: form for user authentication
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setErr(error.message || "Login failed");
    }
  }

  return (
    <div style={{
      maxWidth: 400, margin: "54px auto", background: "var(--bg-secondary)", borderRadius: 8,
      border: "1px solid var(--border-color)", padding: "2em"
    }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" required autoFocus value={email}
            onChange={e => setEmail(e.target.value)}
            style={{display:"block", marginBottom:10, width:"100%"}} />
        </label>
        <label>
          Password
          <input type="password" required value={password}
            onChange={e => setPassword(e.target.value)}
            style={{display:"block", marginBottom:18, width:"100%"}} />
        </label>
        {err && <div style={{color:"#e74c3c"}}>{err}</div>}
        <button type="submit" style={{
          marginTop: 8, width: "100%", background: "var(--button-bg)", color: "var(--button-text)", border: "none",
          padding: "10px", borderRadius: 6, fontWeight: 700, fontSize: 16
        }}>Log In</button>
      </form>
      <hr/>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
