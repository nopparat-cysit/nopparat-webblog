import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useSupabaseNotifications } from "@/hooks/useSupabaseNotifications";
import { Loading } from "@/common/Loading";

const defaultAvatar =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=notify";

function NotificationPage() {
  const navigate = useNavigate();
  const { mappedForDropdown: items, markAsRead, loading } =
    useSupabaseNotifications();

  const handleView = async (item) => {
    if (item.unread) await markAsRead(item.id);
    if (item.articleId) navigate(`/posts/${item.articleId}`);
  };

  return (
    <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
      <AdminSidebar />

      <main className="flex-1 ml-[280px]">
        <div className="px-16 py-8 pr-16">
          <h1 className="text-headline-3 text-brown-600 font-semibold">
            Notification
          </h1>
        </div>
        <div className="border-t border-brown-300"></div>

        <div className="px-16 pt-8 pb-[120px]">
          <div className="bg-white border border-brown-200 rounded-xl overflow-hidden shadow-sm">
            {loading ? (
              <Loading />
            ) : items.length === 0 ? (
              <p className="px-6 py-12 text-center text-body-2 text-brown-400">
                No notifications yet
              </p>
            ) : (
              <ul className="divide-y divide-brown-200">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-start gap-4 px-6 py-5 hover:bg-brown-50/50 transition-colors ${
                      item.unread ? "bg-brown-50/30" : ""
                    }`}
                  >
                    <img
                      src={item.avatar || defaultAvatar}
                      alt={item.name}
                      className={`w-10 h-10 object-cover shrink-0 border border-brown-200 ${
                        item.type === "new_article"
                          ? "rounded-lg"
                          : "rounded-full"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-2 text-brown-600">
                        {item.type === "new_article" ? (
                          item.message
                        ) : (
                          <>
                            <span className="font-semibold text-brown-700">
                              {item.name}
                            </span>{" "}
                            {item.type === "comment"
                              ? "commented on your article"
                              : "liked your article"}
                          </>
                        )}
                      </p>
                      <p className="mt-2 text-body-3 text-[#F2B68C]">
                        {item.time}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleView(item)}
                      className="shrink-0 text-body-2 font-medium text-brown-600 hover:text-brown-700 hover:underline transition-colors"
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotificationPage;
