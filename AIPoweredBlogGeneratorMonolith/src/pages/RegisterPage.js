import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";

/**
 * Registration Page: form for creating a new account
 */
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const { register, login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await register({ email, name, password });
      setSuccess("Registration complete! Logging in...");
      await login(email, password);
      navigate("/");
    } catch (error) {
      setErr(error.message || "Signup failed");
    }
  }

  return (
    <div style={{
      maxWidth: 440, margin: "54px auto", background: "var(--bg-secondary)", borderRadius: 8,
      border: "1px solid var(--border-color)", padding: "2em"
    }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" value={name} required
            onChange={e => setName(e.target.value)}
            style={{display:"block", marginBottom:10, width:"100%"}} />
        </label>
        <label>
          Email
          <input type="email" required value={email}
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
        }}>Register</button>
      </form>
      <hr/>
      {success && <div style={{color:"#27ae60"}}>{success}</div>}
      <p>Already a user? <Link to="/login">Log in</Link></p>
    </div>
  );
}
