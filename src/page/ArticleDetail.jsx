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

function ArticleDetail() {
  const pageId = useParams();
  const [articleDetail, setArticleDetail] = useState({});
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const getData = async () => {
    const response = await axios.get(
      `https://blog-post-project-api.vercel.app/posts/${pageId.id}`
    );
    setArticleDetail(response.data);
    setLikes(response.data.likes || 0);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleLike = () => {
    setShowModal(true);
  };

  const handleCommentFocus = () => {
    setShowModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleSendComment = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          author: "You",
          avatar: "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg",
          date: new Date().toLocaleDateString("th-TH", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }) + " เวลา " + new Date().toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: comment,
        },
      ]);
      setComment("");
    }
  };

  // Author info
  const authorImage = "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg";

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
