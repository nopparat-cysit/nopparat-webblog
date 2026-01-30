import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    user: "Jacob Lash",
    avatar: "https://www.clipartmax.com/png/small/258-2582267_circled-user-male-skin-type-1-2-icon-male-user-icon.png",
    type: "comment",
    articleTitle: "The Fascinating World of Cats: Why We Love Our Furry Friends",
    comment: "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
    timeAgo: "4 hours ago",
    articleId: "1",
  },
  {
    id: "2",
    user: "Jacob Lash",
    avatar: "https://www.clipartmax.com/png/small/258-2582267_circled-user-male-skin-type-1-2-icon-male-user-icon.png",
    type: "like",
    articleTitle: "The Fascinating World of Cats: Why We Love Our Furry Friends",
    timeAgo: "4 hours ago",
    articleId: "1",
  },
];

function NotificationPage() {
  const navigate = useNavigate();

  const handleView = (articleId) => {
    if (articleId) navigate(`/posts/${articleId}`);
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
            <ul className="divide-y divide-brown-200">
              {MOCK_NOTIFICATIONS.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-4 px-6 py-5 hover:bg-brown-50/50 transition-colors"
                >
                  <img
                    src={item.avatar}
                    alt={item.user}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-brown-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-2 text-brown-600">
                      <span className="font-semibold text-brown-700">{item.user}</span>
                      {item.type === "comment"
                        ? " Commented on your article: "
                        : " liked your article: "}
                      <span className="text-brown-600">{item.articleTitle}</span>
                    </p>
                    {item.comment && (
                      <p className="mt-2 text-body-3 text-brown-500 pl-2 border-l-2 border-brown-200">
                        &quot;{item.comment}&quot;
                      </p>
                    )}
                    <p className="mt-2 text-body-3 text-[#F2B68C]">{item.timeAgo}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleView(item.articleId)}
                    className="shrink-0 text-body-2 font-medium text-brown-600 hover:text-brown-700 hover:underline transition-colors"
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotificationPage;
