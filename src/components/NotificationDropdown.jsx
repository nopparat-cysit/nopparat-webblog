import { useEffect, useRef } from "react";
import { Bell } from "lucide-react";

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    name: "Thompson P.",
    action: "Published new article.",
    time: "2 hours ago",
    avatar: "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg",
    unread: true,
  },
  {
    id: 2,
    name: "Jacob Lash",
    action: "Comment on the article you have commented on.",
    time: "12 September 2024 at 18:30",
    avatar: "https://ui-avatars.com/api/?name=Jacob+Lash&background=dad6d1",
    unread: true,
  },
];

function NotificationDropdown({ isOpen, onOpenChange, notifications = DEFAULT_NOTIFICATIONS }) {
  const ref = useRef(null);
  const hasUnread = notifications.some((n) => n.unread);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOpenChange(false);
    };
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen, onOpenChange]);

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
          <ul className="max-h-[320px] overflow-y-auto">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className="flex gap-3 w-full px-4 py-3 text-left hover:bg-brown-200/50 transition-colors"
                  onClick={() => onOpenChange(false)}
                >
                  <img
                    src={n.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-body-1 text-brown-500">
                      <span className="font-semibold">{n.name}</span> <span className="text-brown-400">{n.action}</span> 
                    </p>
                    <p className="text-body-3 font-medium text-brand-orange mt-0.5">{n.time}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {notifications.length === 0 && (
            <p className="px-4 py-6 text-body-2 text-brown-400 text-center">
              No notifications yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
