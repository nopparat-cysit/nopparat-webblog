import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Footer } from "../components/Footer";
import axios from "axios";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { formatDate } from "../lib/utils";
import LoginModal from "../components/LoginModal";
import AuthorSidebar from "../components/AuthorSidebar";
import LikeShareSection from "../components/LikeShareSection";
import CommentSection from "../components/CommentSection";
import { UserMock } from "@/mockdata/userMock";
import NotFound from "./NotFound";
import { useAuth } from "@/context/AuthContext";

function avatarForComment(raw, authorLabel) {
  const pic =
    raw?.user_profile_pic ??
    raw?.profile_pic ??
    raw?.user?.profilePic ??
    raw?.user?.profile_pic;
  if (pic) return pic;
  const seed = authorLabel || "guest";
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(String(seed))}`;
}

function ArticleDetail() {
  const pageId = useParams();
  const { user, token, isAuthenticated } = useAuth();
  const [articleDetail, setArticleDetail] = useState({});
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [commentPagination, setCommentPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const VITE_API_BASE = import.meta.env.VITE_API_BASE_URL;

  const accessToken = token ?? sessionStorage.getItem("access_token");
  const isOnline = isAuthenticated || sessionStorage.getItem("online") === "true";
  const currentAuthorName = user?.username ?? user?.name ?? UserMock.username;
  const currentAuthorAvatar =
    user?.profilePic ?? user?.profile_pic ?? UserMock.img;

  const formatCommentDate = (dateInput) => {
    const date = dateInput ? new Date(dateInput) : new Date();
    return (
      date.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      " เวลา " +
      date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const fetchComments = async (page = 1) => {
    if (!pageId?.id) return;
    try {
      const res = await axios.get(
        `${VITE_API_BASE}/posts/${pageId.id}/comments`,
        { params: { page, order: "desc" } }
      );
      const raw = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];
      const mapped = raw
        .map((c) => {
          const author =
            c.user_name ?? c.user?.username ?? c.user?.name ?? "Member";
          return {
            id: c.id,
            author,
            avatar: avatarForComment(c, author),
            date: formatCommentDate(c.created_at),
            text: c.comment_text ?? c.text ?? "",
            created_at: c.created_at,
          };
        })
        .filter((c) => c.text);
      const newestFirst = [...mapped].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      setComments(newestFirst);
      setCommentPage(page);
      const pagination = res.data?.pagination;
      if (pagination) {
        setCommentPagination({
          page: pagination.page ?? page,
          limit: pagination.limit ?? 5,
          total: pagination.total ?? 0,
          totalPages: pagination.totalPages ?? 0,
        });
      } else {
        setCommentPagination((prev) => ({ ...prev, page, total: raw.length, totalPages: raw.length > 0 ? 1 : 0 }));
      }
    } catch (err) {
      console.error("Failed to fetch comments", err);
      setComments([]);
    }
  };

  const loadMoreComments = async () => {
    const nextPage = commentPage + 1;
    if (nextPage > (commentPagination.totalPages || 0)) return;
    if (!pageId?.id) return;
    try {
      const res = await axios.get(
        `${VITE_API_BASE}/posts/${pageId.id}/comments`,
        { params: { page: nextPage, order: "desc" } }
      );
      const raw = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];
      const mapped = raw
        .map((c) => {
          const author =
            c.user_name ?? c.user?.username ?? c.user?.name ?? "Member";
          return {
            id: c.id,
            author,
            avatar: avatarForComment(c, author),
            date: formatCommentDate(c.created_at),
            text: c.comment_text ?? c.text ?? "",
            created_at: c.created_at,
          };
        })
        .filter((c) => c.text);
      const newestFirst = [...mapped].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      setComments((prev) => [...prev, ...newestFirst]);
      setCommentPage(nextPage);
    } catch (err) {
      console.error("Failed to load more comments", err);
    }
  };

  const getData = async () => {
    if (!pageId?.id) return;
    try {
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined;
      const response = await axios.get(
        `${VITE_API_BASE}/posts/${pageId.id}`,
        { headers }
      );
      const data = response.data?.data ?? response.data;
      const isDraft = data && (data.status === 1 || data.status === "Draft");
      if (isDraft) {
        setNotFound(true);
        return;
      }
      setArticleDetail(data);

      const likesCount =
        data.likes_count ?? data.likes ?? response.data.likes ?? 0;
      setLikes(typeof likesCount === "number" ? likesCount : 0);

      const hasIsLikedField =
        Object.prototype.hasOwnProperty.call(data, "is_liked") ||
        Object.prototype.hasOwnProperty.call(data, "isLiked");
      const likedFlagRaw = data.is_liked ?? data.isLiked;
      const userId = user?.id ?? JSON.parse(sessionStorage.getItem("auth_user") || "{}")?.id;
      const storageKey = userId ? `liked_post_${userId}_${pageId.id}` : `liked_post_${pageId.id}`;
      const savedLiked = sessionStorage.getItem(storageKey);

      let initialLiked = false;
      if (!accessToken) {
        // ไม่ได้ล็อกอิน: แสดงเป็น "ยังไม่กด like" เสมอ (เฉพาะ user ที่กดเท่านั้นถึงจะเห็นว่ากดแล้ว)
        initialLiked = false;
      } else if (hasIsLikedField && likedFlagRaw != null) {
        // ล็อกอินแล้ว และ backend ส่ง is_liked มา → ใช้ค่าจาก DB (ต่อ user นี้)
        initialLiked = Boolean(likedFlagRaw);
      } else if (savedLiked !== null) {
        // ล็อกอินแล้ว แต่ backend ไม่ส่ง is_liked → ใช้ค่าเดิมที่เก็บต่อ user นี้
        initialLiked = savedLiked === "true";
      }
      setIsLiked(initialLiked);
      if (accessToken) {
        sessionStorage.setItem(storageKey, String(initialLiked));
      }

      await fetchComments(1);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getLikeStorageKey = () => {
    const userId = user?.id ?? JSON.parse(sessionStorage.getItem("auth_user") || "{}")?.id;
    return userId ? `liked_post_${userId}_${pageId.id}` : `liked_post_${pageId.id}`;
  };

  const handleLike = async () => {
    if (!isOnline || !accessToken) {
      setShowModal(true);
      return;
    }
    if (!pageId?.id) return;

    const wasLiked = isLiked;
    const prevLikes = likes;
    const storageKey = getLikeStorageKey();

    // Optimistic update
    setIsLiked(!wasLiked);
    setLikes(wasLiked ? Math.max(prevLikes - 1, 0) : prevLikes + 1);
    sessionStorage.setItem(storageKey, String(!wasLiked));

    try {
      if (!wasLiked) {
        const res = await axios.post(
          `${VITE_API_BASE}/posts/${pageId.id}/likes`,
          null,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const count = res.data?.likes_count;
        if (typeof count === "number") setLikes(count);
      } else {
        const res = await axios.delete(
          `${VITE_API_BASE}/posts/${pageId.id}/likes`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const count = res.data?.likes_count;
        if (typeof count === "number") setLikes(count);
      }
    } catch (err) {
      setIsLiked(wasLiked);
      setLikes(prevLikes);
      sessionStorage.setItem(storageKey, String(wasLiked));
      console.error("Failed to toggle like", err);
    }
  };

  const handleCommentFocus = () => {
    // ถ้าไม่ได้ login ให้เด้ง modal
    if (!isOnline || !accessToken) {
      setShowModal(true);
      return;
    }
    // ถ้า login แล้วให้ focus ได้เลย (ไม่ต้องเปิด modal)
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleSendComment = async () => {
    const trimmed = comment.trim();
    if (!trimmed) return;

    if (!isOnline || !accessToken) {
      setShowModal(true);
      return;
    }

    if (!pageId?.id) return;

    try {
      const res = await axios.post(
        `${VITE_API_BASE}/posts/${pageId.id}/comments`,
        { comment_text: trimmed },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const created = res.data?.data ?? res.data;
      const author =
        created?.user_name ??
        created?.user?.username ??
        currentAuthorName;
      const newComment = {
        id: created?.id ?? comments.length + 1,
        author,
        avatar: avatarForComment(created, author),
        date: formatCommentDate(created?.created_at),
        text: created?.comment_text ?? trimmed,
        created_at: created?.created_at,
      };
      setComments((prev) => [newComment, ...prev]);
      setComment("");
      setCommentPagination((prev) => ({
        ...prev,
        total: (prev.total ?? 0) + 1,
        totalPages: Math.ceil(((prev.total ?? 0) + 1) / (prev.limit || 5)),
      }));
    } catch (err) {
      console.error("Failed to send comment", err);
    }
  };

  // Author info
  const authorImage = "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg";

  if (notFound) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />

      <main className="flex-1">
        {/* Hero Image */}
        <section className="w-full md:px-32 md:pt-10">
          <div className="max-w-6xl mx-auto">
            <div className="w-full h-[220px] md:h-[578px] overflow-hidden md:rounded-[16px]">
              <img
                src={articleDetail.image}
                alt={articleDetail.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="w-full px-4 py-8 md:px-32 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Category & Date */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className="inline-block rounded-full px-3 py-1 text-body-2 font-medium"
                    style={{
                      backgroundColor: "var(--color-brand-green-soft)",
                      color: "var(--color-brand-green)",
                    }}
                  >
                    {articleDetail.category}
                  </span>
                  <span className="text-brown-400 text-body-2">
                    {formatDate(articleDetail.date)}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-headline-3 md:text-headline-2 text-brown-600 font-semibold mb-4 md:mb-6 leading-tight">
                  {articleDetail.title}
                </h1>

                {/* Description */}
                <p className="text-brown-400 text-body-2 md:text-body-1 mb-6 md:mb-8 leading-relaxed">
                  {articleDetail.description}
                </p>

                {/* Article Content */}
                <div className="article-content text-brown-500 text-body-2 md:text-body-1 leading-relaxed [&>h1]:text-headline-3 [&>h1]:font-semibold [&>h1]:text-brown-600 [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-headline-4 [&>h2]:font-semibold [&>h2]:text-brown-600 [&>h2]:mt-5 [&>h2]:mb-3 [&>h3]:text-body-1 [&>h3]:font-semibold [&>h3]:text-brown-600 [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>li]:mb-1 [&>blockquote]:border-l-4 [&>blockquote]:border-brown-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-brown-400 [&>a]:text-brand-green [&>a]:underline [&>strong]:font-semibold [&>strong]:text-brown-600 [&>code]:bg-brown-100 [&>code]:px-1 [&>code]:rounded">
                  <ReactMarkdown>{articleDetail.content}</ReactMarkdown>
                </div>
              </div>

              {/* Author Sidebar - Desktop Only */}
              <AuthorSidebar 
                author={articleDetail.author} 
                authorImage={authorImage} 
              />
            </div>

            {/* Like & Share Section */}
            <LikeShareSection
              likes={likes}
              isLiked={isLiked}
              onLike={handleLike}
              onCopyLink={handleCopyLink}
            />

            {/* Comments Section */}
            <CommentSection
              comments={comments}
              comment={comment}
              onCommentChange={setComment}
              onCommentFocus={handleCommentFocus}
              onSendComment={handleSendComment}
              hasMoreComments={commentPage < (commentPagination.totalPages || 0)}
              onLoadMoreComments={loadMoreComments}
            />
          </div>
        </section>
      </main>

      <Footer />

      {/* Login Modal */}
      <LoginModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}

export default ArticleDetail;
