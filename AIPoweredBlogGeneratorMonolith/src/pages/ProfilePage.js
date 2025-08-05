import React, { useState } from "react";
import { useAuth } from "../AuthContext";

/**
 * User profile page: shows info, allows for display only.
 */
export default function ProfilePage() {
  const { user } = useAuth();
  const [showData, setShowData] = useState(false);

  if (!user) return <div>Not logged in.</div>;

  return (
    <div style={{
      maxWidth: 430, margin: "44px auto", background: "var(--bg-secondary)",
      border: "1px solid var(--border-color)", borderRadius: 11, padding: 34
    }}>
      <h2>My Profile</h2>
      <div>
        <b>Name:</b> {user.name}
      </div>
      <div>
        <b>Email:</b> {user.email}
      </div>
      <div>
        <b>Role:</b> {user.role}
      </div>
      <button style={{
        marginTop: 24, background: "var(--button-bg)", color: "var(--button-text)",
        border: "none", borderRadius: 8, padding: "8px 13px"
      }} onClick={() => setShowData(!showData)}>
        {showData ? "Hide raw data" : "Show raw user data"}
      </button>
      {showData && (
        <pre style={{
          background: "#ececec", color: "#000", borderRadius: 8, padding: 10,
          fontSize: 12, marginTop: 12
        }}>{JSON.stringify(user, null, 2)}</pre>
      )}
    </div>
  );
}
