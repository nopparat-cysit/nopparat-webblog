import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffM = Math.floor((now - d) / 60000);
  if (diffM < 1) return "Just now";
  if (diffM < 60) return `${diffM} min ago`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `${diffH} hr ago`;
  return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function normalizeMeta(row) {
  const m = row.meta;
  if (m == null) return {};
  if (typeof m === "string") {
    try {
      return JSON.parse(m);
    } catch {
      return {};
    }
  }
  return typeof m === "object" ? m : {};
}

/** Legacy rows in DB may still store Thai; show English in the UI */
function normalizeNotificationMessage(msg) {
  if (msg == null || typeof msg !== "string") return msg ?? "";
  const m = msg.replace(/^\s*บทความใหม่:\s*/, "New article: ");
  if (m !== msg) return m;
  if (/ แสดงความคิดเห็นในบทความของคุณ$/.test(msg)) {
    return msg.replace(/ แสดงความคิดเห็นในบทความของคุณ$/, " commented on your article");
  }
  if (/ ถูกใจบทความของคุณ$/.test(msg)) {
    return msg.replace(/ ถูกใจบทความของคุณ$/, " liked your article");
  }
  return msg;
}

/**
 * Load + Realtime on `notifications` table (requires Supabase session from setSession after API login)
 */
export function useSupabaseNotifications() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async (uid) => {
    if (!supabase || !uid) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("id, type, message, meta, is_read, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[notifications] fetch:", error.message);
      setItems([]);
    } else {
      setItems((data ?? []).map((row) => ({ ...row, meta: normalizeMeta(row) })));
    }
    setLoading(false);
  }, []);

  const markAsRead = useCallback(async (id) => {
    if (!supabase || id == null) return;
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
    if (error) {
      console.error("[notifications] mark read:", error.message);
      return;
    }
    setItems((prev) =>
      prev.map((row) => (String(row.id) === String(id) ? { ...row, is_read: true } : row))
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!supabase) return;
    const unreadIds = items.filter((r) => !r.is_read).map((r) => r.id);
    if (unreadIds.length === 0) return;
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);
    if (error) {
      console.error("[notifications] mark all read:", error.message);
      return;
    }
    setItems((prev) => prev.map((row) => ({ ...row, is_read: true })));
  }, [items]);

  useEffect(() => {
    if (!supabase || !isAuthenticated) {
      setItems([]);
      setLoading(false);
      return undefined;
    }

    let channel;
    let cancelled = false;

    const attach = async (session) => {
      if (channel) {
        await supabase.removeChannel(channel);
        channel = null;
      }
      const uid = session?.user?.id ?? null;
      if (!uid) {
        if (!cancelled) {
          setItems([]);
          setLoading(false);
        }
        return;
      }

      await fetchList(uid);
      if (cancelled) return;

      channel = supabase
        .channel(`notifications-${uid}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${uid}`,
          },
          (payload) => {
            const row = payload.new;
            if (!row) return;
            const normalized = { ...row, meta: normalizeMeta(row) };
            setItems((prev) => {
              if (prev.some((p) => String(p.id) === String(normalized.id))) return prev;
              return [normalized, ...prev];
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${uid}`,
          },
          (payload) => {
            const row = payload.new;
            if (!row) return;
            const normalized = { ...row, meta: normalizeMeta(row) };
            setItems((prev) =>
              prev.map((p) => (String(p.id) === String(normalized.id) ? { ...p, ...normalized } : p))
            );
          }
        )
        .subscribe();
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      attach(session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      if (channel) supabase.removeChannel(channel);
    };
  }, [isAuthenticated, fetchList]);

  const mappedForDropdown = items.map((row) => {
    const meta = row.meta || {};
    const name = meta.user_name || "Notification";
    const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(String(name))}`;
    let avatar = fallbackAvatar;
    if (row.type === "new_article" && meta.article_cover) {
      avatar = meta.article_cover;
    } else if (meta.avatar && String(meta.avatar).trim()) {
      avatar = meta.avatar;
    }
    return {
      id: row.id,
      type: row.type ?? null,
      message: normalizeNotificationMessage(row.message || row.type || ""),
      unread: !row.is_read,
      time: formatTime(row.created_at),
      avatar,
      name,
      articleId: meta.article_id ? String(meta.article_id) : null,
    };
  });

  const hasUnread = items.some((r) => !r.is_read);

  return {
    items,
    mappedForDropdown,
    loading,
    hasUnread,
    markAsRead,
    markAllAsRead,
  };
}
