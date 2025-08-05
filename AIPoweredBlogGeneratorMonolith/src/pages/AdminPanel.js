import React, { useEffect, useState } from "react";
import * as api from "../api";
import { useAuth } from "../AuthContext";

/**
 * AdminPanel: site analytics and user management.
 */
export default function AdminPanel() {
  const { authToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setLoadingUsers(true);
    api.getUsers(authToken).then(setUsers).catch(e => setErr(e.message)).finally(() => setLoadingUsers(false));
    setLoadingStats(true);
    api.getAdminStats(authToken).then(setStats).catch(e => setErr(e.message)).finally(() => setLoadingStats(false));
  }, [authToken]);

  return (
    <div style={{ maxWidth: 1050, margin: "44px auto" }}>
      <h1>Admin Dashboard</h1>
      {err && <div style={{ color: "#e74c3c", marginBottom: 10 }}>{err}</div>}
      <section style={{
        background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border-color)",
        padding: 22, marginBottom: 32
      }}>
        <h2>Site Analytics</h2>
        {loadingStats && <div>Loading dashboard...</div>}
        {stats &&
          <ul>
            <li><b>Total Posts:</b> {stats.total_posts}</li>
            <li><b>Published:</b> {stats.published_posts}</li>
            <li><b>Drafts:</b> {stats.draft_posts}</li>
            <li><b>Scheduled:</b> {stats.scheduled_posts}</li>
            <li><b>Registered Users:</b> {stats.total_users}</li>
            <li><b>Active Today:</b> {stats.active_today}</li>
          </ul>
        }
      </section>
      <section style={{
        background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border-color)", padding: 22
      }}>
        <h2>User Management</h2>
        {loadingUsers && <div>Loading users...</div>}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u =>
              <tr key={u.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td>{u.email}</td>
                <td>{u.name}</td>
                <td>{u.role}</td>
                <td>{new Date(u.created_at).toLocaleString()}</td>
              </tr>
            )}
            {users.length === 0 && <tr><td colSpan={4}>No users.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
