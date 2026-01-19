import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Footer } from "../components/Footer";
import axios from "axios";
import { useState, useEffect } from "react";
import { Heart, Copy, Facebook, Linkedin, Twitter, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

function ArticleDetail() {
  const pageId = useParams();
  const [articleDetail, setArticleDetail] = useState({});
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  console.log(articleDetail);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-EN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  

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
              <div className="hidden md:block w-[280px] shrink-0">
                <div className="bg-brown-100 rounded-[16px] p-6 sticky top-24">
                  <p className="text-body-2 text-brown-400 mb-3">Author</p>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={authorImage}
                      alt={articleDetail.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <h3 className="text-body-1 text-brown-600 font-semibold">
                      {articleDetail.author}
                    </h3>
                  </div>
                  <p className="text-body-2 text-brown-400 leading-relaxed">
                    I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
                  </p>
                  <p className="text-body-2 text-brown-400 leading-relaxed mt-4">
                    When I'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.
                  </p>
                </div>
              </div>
            </div>

            {/* Like & Share Section */}
            <div className="flex items-center justify-between gap-4 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-brown-300">
              {/* Like & Copy Link Buttons */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border transition-all duration-300 ${
                    isLiked
                      ? "border-brand-green bg-brand-green-soft text-brand-green"
                      : "border-brown-300 bg-white text-brown-500 hover:border-brown-400"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 md:w-5 md:h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span className="text-body-2 md:text-body-1 font-medium">{likes}</span>
                </button>

                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border border-brown-300 bg-white text-brown-500 hover:border-brown-400 transition-all duration-300"
                >
                  <Copy className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-body-2 md:text-body-1 font-medium">Copy link</span>
                </button>
              </div>

              {/* Social Share */}
              <div className="flex items-center gap-2 md:gap-3">
                <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brown-600 text-white flex items-center justify-center hover:bg-brown-500 transition-all duration-300">
                  <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brown-600 text-white flex items-center justify-center hover:bg-brown-500 transition-all duration-300">
                  <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brown-600 text-white flex items-center justify-center hover:bg-brown-500 transition-all duration-300">
                  <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8 md:mt-12">
              <h3 className="text-body-1 md:text-headline-4 text-brown-600 font-semibold mb-4 md:mb-6">
                Comment
              </h3>

              {/* Comment Input */}
              <div className="mb-6 md:mb-8">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onFocus={handleCommentFocus}
                  placeholder="What are your thoughts?"
                  className="w-full p-3 md:p-4 border border-brown-300 rounded-[16px] text-body-2 md:text-body-1 text-brown-500 placeholder:text-brown-400 resize-none focus:outline-none focus:ring-2 focus:ring-brown-400 transition-all duration-300"
                  rows={3}
                />
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleSendComment}
                    className="px-6 py-2 bg-brown-600 text-white rounded-full text-body-2 md:text-body-1 font-medium hover:bg-brown-500 transition-all duration-300"
                  >
                    Send
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4 md:space-y-6">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="border-b border-brown-200 pb-4 md:pb-6 last:border-b-0"
                  >
                    <div className="flex items-center gap-3 mb-2 md:mb-3">
                      <img
                        src={c.avatar}
                        alt={c.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-body-2 md:text-body-1 text-brown-600 font-semibold">
                          {c.author}
                        </h4>
                        <p className="text-xs md:text-body-2 text-brown-400">{c.date}</p>
                      </div>
                    </div>
                    <p className="text-body-2 md:text-body-1 text-brown-500 leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Login Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] p-6 md:p-8 w-[90%] max-w-[400px] relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-brown-400 hover:text-brown-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <h2 className="text-headline-4 text-brown-600 font-semibold mb-2">
                Create an account to continue
              </h2>
              

              {/* Login Button */}
              <button className="w-full py-3 bg-brown-600 text-white rounded-full text-body-1 font-medium hover:bg-brown-500 transition-all duration-300 mb-3">
                Create account
              </button>

              {/* Sign Up Link */}
              <p className="text-body-2 text-brown-400">
                  Already have an account?{" "}
                <a href="#" className="text-brand-green font-medium hover:underline">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleDetail;
