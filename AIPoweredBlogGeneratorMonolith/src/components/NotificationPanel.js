import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import * as api from "../api";
import { Link } from "react-router-dom";

/**
 * Displays notifications for logged-in user, with mark as read.
 */
export default function NotificationPanel() {
  const { user, authToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  const unread = notifications.filter((n) => !n.read);

  useEffect(() => {
    if (!user || !authToken) return;
    api.getNotifications(authToken).then(setNotifications).catch(()=>{});
    // Optionally: polling update interval for new notifications
    const interval = setInterval(() => {
      api.getNotifications(authToken).then(setNotifications).catch(()=>{});
    }, 30000); // every 30s
    return () => clearInterval(interval);
  }, [user, authToken]);

  const handleMarkRead = async (id) => {
    await api.markNotificationAsRead(id, authToken);
    setNotifications((n) => n.map(notif =>
      notif.id === id ? {...notif, read: true} : notif
    ));
  };

  if (!user) return null;

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, margin: 0, zIndex: 70
    }}>
      <button
        type="button"
        title="Notifications"
        aria-label="Notifications"
        onClick={() => setShow((s) => !s)}
        style={{
          position: "absolute", top: 10, right: 24, background: "var(--button-bg)", color: "var(--button-text)", borderRadius: "50%", width: 44, height: 44, border: "none"
        }}
      >
        🔔
        {unread.length > 0 &&
          <span style={{
            background: "#e74c3c", color: "#fff", borderRadius: "50%", fontSize: 12, padding: "2px 6px", position: "absolute", top: 2, right: 2
          }}>{unread.length}</span>
        }
      </button>
      {show && (
        <div style={{
          position: "absolute", top: 60, right: 8, minWidth: 320, background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.10)", padding: 14
        }}>
          <strong>Notifications</strong>
          <ul style={{listStyle: "none", padding: 0}}>
            {(notifications.length === 0) && <li>No notifications.</li>}
            {notifications.map(n =>
              <li key={n.id} style={{
                padding: 9, borderBottom: "1px solid var(--border-color)",
                background: n.read ? "transparent" : "#e7f4ff"
              }}>
                <div>
                  {n.link ? (
                    <Link to={n.link} onClick={() => handleMarkRead(n.id)}>{n.text}</Link>
                  ) : n.text}
                  {!n.read && (
                    <button
                      style={{marginLeft: 10, fontSize: 11}}
                      onClick={() => handleMarkRead(n.id)}
                    >Mark read</button>
                  )}
                </div>
                <div style={{fontSize: 11, color: "var(--text-secondary)"}}>
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
