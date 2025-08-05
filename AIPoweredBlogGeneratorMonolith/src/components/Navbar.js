import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar" style={{
      background: "var(--bg-secondary)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)"
    }}>
      <div style={{display: "flex", alignItems: "center", gap: 12}}>
        <Link to="/" style={{fontWeight: 700, color: "var(--text-primary)", textDecoration: "none", fontSize: 22}}>
          AI Blog Generator
        </Link>
        <Link to="/post/new" style={{marginLeft: 18, textDecoration: "none", color: "var(--text-secondary)"}}>New Post</Link>
        {user && user.role === "admin" && (
          <Link to="/admin" style={{marginLeft: 18, textDecoration: "none", color: "var(--text-secondary)"}}>Admin</Link>
        )}
      </div>
      <div style={{display: "flex", alignItems: "center", gap: 10}}>
        {user ? (
          <>
            <span style={{color: "var(--text-primary)"}}>Hi, {user.name || user.email}</span>
            <Link to="/profile" aria-label="Profile" style={{marginRight: 8, color: "var(--text-secondary)"}}>Profile</Link>
            <button onClick={logout} style={{
              background: "var(--button-bg)", color: "var(--button-text)", border: "none", borderRadius: 6,
              padding: "6px 14px", cursor: "pointer"
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{marginRight: 8, color: "var(--text-secondary)"}}>Login</Link>
            <Link to="/register" style={{color: "var(--text-secondary)"}}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
