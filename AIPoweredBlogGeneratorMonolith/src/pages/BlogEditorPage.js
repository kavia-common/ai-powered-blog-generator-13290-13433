import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as api from "../api";
import { useAuth } from "../AuthContext";

/**
 * BlogEditorPage: create or edit a post, get AI content suggestions, schedule/publish.
 */
export default function BlogEditorPage() {
  const { id } = useParams();
  const { authToken } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [scheduleAt, setScheduleAt] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const navigate = useNavigate();

  // Load post if edit mode
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getPost(id, authToken)
      .then(post => {
        setTitle(post.title || "");
        setContent(post.content || "");
        setStatus(post.status);
        setScheduleAt(post.schedule_at ? post.schedule_at.substring(0, 16) : "");
      })
      .catch(e => setErr("Could not load post: " + (e.message || "")))
      .finally(() => setLoading(false));
  }, [id, authToken]);

  // Save or update post
  async function handleSave(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (id) {
        await api.updatePost(id, {
          title, content
        }, authToken);
      } else {
        const post = await api.createPost({ title, content }, authToken);
        navigate(`/post/${post.id}/edit`);
      }
    } catch (error) {
      setErr(error.message);
    }
    setLoading(false);
  }

  async function handlePublish(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (!id) {
        const post = await api.createPost({ title, content, status: "published" }, authToken);
        navigate(`/post/${post.id}`);
      } else {
        await api.updatePost(id, { title, content, status: "published" }, authToken);
        navigate(`/post/${id}`);
      }
    } catch (error) {
      setErr(error.message);
    }
    setLoading(false);
  }

  async function handleSchedule(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.schedulePost(id, scheduleAt, authToken);
      setStatus("scheduled");
    } catch (error) {
      setErr("Scheduling failed: " + error.message);
    }
    setLoading(false);
  }

  // AI Content handler
  async function handleAIGenerate(e) {
    e.preventDefault();
    setAiLoading(true);
    setErr("");
    try {
      const res = await api.generateAiContent(aiPrompt || title, authToken);
      setContent(content + "\n\n" + res.content);
    } catch(error) {
      setErr("AI error: " + error.message);
    }
    setAiLoading(false);
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "var(--bg-secondary)", borderRadius: 10, boxShadow: "0 6px 18px rgba(0,0,0,.08)", border: "1px solid var(--border-color)", padding: "34px" }}>
      <h2>{id ? "Edit Blog Post" : "New Blog Post"}</h2>
      <form onSubmit={handleSave}>
        <label>
          Title
          <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
            style={{ width: "100%", fontSize: 17, marginBottom: 7 }} />
        </label>
        <label>
          Content (supports Markdown or Rich text)
          <textarea required rows={12} value={content} onChange={e => setContent(e.target.value)}
            style={{ width: "100%", fontSize: 15, marginBottom: 7, resize: "vertical" }} />
        </label>
        <div style={{marginBottom: 14, display:"flex", alignItems: "center", gap: 10}}>
          <input type="text" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
            style={{width:"50%"}} placeholder="AI prompt or topic..." />
          <button disabled={aiLoading} onClick={handleAIGenerate} style={{
            background: "var(--button-bg)", color: "var(--button-text)",
            border: 0, borderRadius: 6, padding: "7px 15px", fontWeight: 700
          }}>
            {aiLoading ? "Generating..." : "Get AI Suggestion"}
          </button>
        </div>
        {err && <div style={{ color: "#e74c3c", marginBottom: 10 }}>{err}</div>}
        <div style={{display: "flex", gap: 12, marginTop: 8}}>
          <button type="submit" disabled={loading}
            style={{background: "var(--button-bg)", color: "var(--button-text)", border: "none",
              borderRadius: 7, padding: "10px 18px", fontWeight: 700 }}>Save Draft</button>
          <button type="button" disabled={loading} onClick={handlePublish}
            style={{background: "#27ae60", color: "#fff", border: "none",
              borderRadius: 7, padding: "10px 18px", fontWeight: 700 }}>Publish Now</button>
        </div>
        {id && (
          <div style={{marginTop: 24, marginBottom: 12}}>
            <label>
              Schedule for later:
              <input
                type="datetime-local"
                value={scheduleAt}
                onChange={e=>setScheduleAt(e.target.value)}
                style={{marginLeft: 10}}
              />
              <button type="button" onClick={handleSchedule}
                style={{
                  marginLeft: 10, background: "#007bff", color: "#fff", border: 0,
                  borderRadius: 6, padding: "7px 15px"
                }}>
                Schedule
              </button>
              {status === "scheduled" && <span style={{marginLeft:12, color:"#2980b9"}}>Scheduled!</span>}
            </label>
          </div>
        )}
      </form>
      <div style={{marginTop: 24}}>
        <Link to="/">← Back to dashboard</Link>
      </div>
    </div>
  );
}
