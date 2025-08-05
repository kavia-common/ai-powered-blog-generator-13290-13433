import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../api";
import { useAuth } from "../AuthContext";

/**
 * Dashboard: show own posts, drafts, published, plus option for new post.
 */
export default function Dashboard() {
  const { user, authToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) return;
    setLoading(true);
    api.getPosts(authToken).then(setPosts).catch(e => setErr(e.message)).finally(() => setLoading(false));
  }, [authToken]);

  function filterPosts(posts) {
    if (filter === "all") return posts;
    return posts.filter(p => p.status === filter);
  }

  if (!user) {
    return (
      <div style={{ margin: "70px auto", textAlign: "center" }}>
        <h2>Welcome to AI Blog Generator!</h2>
        <p>Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link></p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "38px auto" }}>
      <h2>My Blog Posts</h2>
      <div style={{ margin: "18px 0" }}>
        <Link to="/post/new" style={{
          background: "var(--button-bg)", color: "var(--button-text)",
          borderRadius: 6, padding: "7px 18px", textDecoration: "none", marginRight: 12
        }}>+ New Blog Post</Link>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </div>
      {loading && <div>Loading...</div>}
      {err && <div style={{ color: "#e74c3c", margin: 14 }}>{err}</div>}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--bg-secondary)" }}>
        <thead>
          <tr>
            <th align="left" style={{ padding: 7 }}>Title</th>
            <th align="left" style={{ padding: 7 }}>Status</th>
            <th align="left" style={{ padding: 7 }}>Modified</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filterPosts(posts).map(post =>
            <tr key={post.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
              <td style={{ padding: 7 }}>
                <Link to={`/post/${post.id}`} style={{ textDecoration: "none" }}>{post.title}</Link>
              </td>
              <td style={{ padding: 7 }}>{post.status}</td>
              <td style={{ padding: 7 }}>
                {new Date(post.updated_at || post.created_at).toLocaleString()}
              </td>
              <td style={{ padding: 7 }}>
                {["draft", "scheduled"].includes(post.status) &&
                  <Link to={`/post/${post.id}/edit`} style={{ color: "var(--text-secondary)" }}>Edit</Link>
                }
              </td>
            </tr>
          )}
          {filterPosts(posts).length === 0 && <tr><td colSpan={3} style={{ padding: 8 }}>No posts yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
