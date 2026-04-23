import { useEffect, useRef } from "react";
import { Bell } from "lucide-react";

const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=notify";

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Array<{ id: string|number, message: string, unread?: boolean, time?: string, avatar?: string, articleId?: string|null }>} props.items
 * @param {(id: string|number) => void} [props.markAsRead]
 * @param {(path: string) => void} [props.onNavigate]
 * @param {boolean} [props.loading]
 */
function NotificationDropdown({
  isOpen,
  onOpenChange,
  items = [],
  markAsRead,
  onNavigate,
  loading = false,
}) {
  const ref = useRef(null);
  const hasUnread = items.some((n) => n.unread);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOpenChange(false);
    };
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen, onOpenChange]);

  const handleItemClick = async (e, n) => {
    e.stopPropagation();
    if (n.unread && markAsRead) await markAsRead(n.id);
    if (n.articleId && onNavigate) onNavigate(`/posts/${n.articleId}`);
    onOpenChange(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(!isOpen);
        }}
        className="relative p-2 rounded-full hover:bg-brown-100 text-brown-600 transition-colors focus:outline-none"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-6 h-6" />
        {hasUnread && (
          <span
            className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"
            aria-hidden
          />
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-brown-200 py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="px-4 pb-2 border-b border-brown-200">
            <span className="text-body-2 font-semibold text-brown-600">Notifications</span>
          </div>
          {loading && (
            <p className="px-4 py-6 text-body-2 text-brown-400 text-center">Loading...</p>
          )}
          {!loading && (
            <ul className="max-h-[320px] overflow-y-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className="flex gap-3 w-full px-4 py-3 text-left hover:bg-brown-200/50 transition-colors"
                    onClick={(e) => handleItemClick(e, n)}
                  >
                    <img
                      src={n.avatar || defaultAvatar}
                      alt=""
                      className={`w-10 h-10 object-cover shrink-0 ${
                        n.type === "new_article" ? "rounded-lg" : "rounded-full"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-body-1 text-brown-600 line-clamp-3">{n.message}</p>
                      {n.time && (
                        <p className="text-body-3 font-medium text-brand-orange mt-0.5">{n.time}</p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!loading && items.length === 0 && (
            <p className="px-4 py-6 text-body-2 text-brown-400 text-center">No notifications yet</p>
          )}
        </div>
      )}
    </div>
  );
}

/** Full-width notification panel (mobile) */
export function NotificationPanel({ items, markAsRead, onNavigate, onClose, loading }) {
  const handleItemClick = async (n) => {
    if (n.unread && markAsRead) await markAsRead(n.id);
    if (n.articleId && onNavigate) onNavigate(`/posts/${n.articleId}`);
    onClose();
  };

  return (
    <div className="bg-white border-b border-brown-200 shadow-lg max-h-[70vh] flex flex-col">
      <div className="px-4 py-3 border-b border-brown-200 flex justify-between items-center">
        <span className="text-body-2 font-semibold text-brown-600">Notifications</span>
        <button type="button" className="text-body-2 text-brown-500" onClick={onClose}>
          Close
        </button>
      </div>
      {loading && <p className="px-4 py-6 text-center text-brown-400">Loading...</p>}
      {!loading && (
        <ul className="overflow-y-auto flex-1">
          {items.map((n) => (
            <li key={n.id} className="border-b border-brown-100">
              <button
                type="button"
                className="flex gap-3 w-full px-4 py-3 text-left hover:bg-brown-50"
                onClick={() => handleItemClick(n)}
              >
                <img
                  src={n.avatar || defaultAvatar}
                  alt=""
                  className={`w-10 h-10 object-cover shrink-0 ${
                    n.type === "new_article" ? "rounded-lg" : "rounded-full"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-body-1 text-brown-600 line-clamp-3">{n.message}</p>
                  {n.time && (
                    <p className="text-body-3 font-medium text-brand-orange mt-0.5">{n.time}</p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {!loading && items.length === 0 && (
        <p className="px-4 py-8 text-body-2 text-brown-400 text-center">No notifications yet</p>
      )}
    </div>
  );
}

export default NotificationDropdown;
