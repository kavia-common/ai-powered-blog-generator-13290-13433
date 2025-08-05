import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as api from "../api";
import { useAuth } from "../AuthContext";

/**
 * Page for viewing a blog post (read-only)
 */
export default function BlogViewPage() {
  const { id } = useParams();
  const { authToken } = useAuth();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getPost(id, authToken)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, authToken]);

  if (loading) return <div>Loading...</div>;
  if (notFound || !post) return <div>Post not found. <Link to="/">Back</Link></div>;

  return (
    <div style={{ maxWidth: 700, background: "var(--bg-secondary)", borderRadius: 10, boxShadow: "0 6px 18px rgba(0,0,0,.09)", margin: "56px auto", padding: 36 }}>
      <h1>{post.title}</h1>
      <div style={{color: "#888", marginBottom: 18, fontSize: 14}}>
        By {post.author_name || "Unknown"} on {new Date(post.created_at).toLocaleDateString()} &middot; {post.status}
      </div>
      <div style={{
        whiteSpace: "pre-wrap",
        fontSize: 17,
        color: "var(--text-primary)",
        background: "#fff9", border: "1px solid var(--border-color)",
        padding: 18, borderRadius: 12, marginBottom: 22
      }}>{post.content}</div>
      <Link to="/">← Back to dashboard</Link>
    </div>
  );
}
