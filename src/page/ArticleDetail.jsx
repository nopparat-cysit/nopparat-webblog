import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Footer } from "../components/Footer";
import axios from "axios";
import { useState, useEffect } from "react";
import { Heart, Copy, Facebook, Linkedin, Twitter } from "lucide-react";

function ArticleDetail() {
  const [articleDetail, setArticleDetail] = useState({});
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const pageId = useParams();

  const getData = async () => {
    const response = await axios.get(
      `https://blog-post-project-api.vercel.app/posts/${pageId.id}`
    );
    setArticleDetail(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
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
          date: new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }) + " at " + new Date().toLocaleTimeString("en-US", {
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
        <div className="w-full h-[300px] md:h-[500px] overflow-hidden md:flex  md:w-[1200px]">
          <img
            src={articleDetail.image}
            alt={articleDetail.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="w-full px-4 py-8 md:px-32 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              {/* Main Content */}
              <div className="flex-1">
                {/* Category & Date */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-block rounded-full px-3 py-1 text-sm font-medium"
                    style={{
                      backgroundColor: "var(--color-brand-green-soft)",
                      color: "var(--color-brand-green)",
                    }}
                  >
                    {articleDetail.category}
                  </span>
                  <span className="text-brown-400 text-body-2">
                    {articleDetail.date}
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
                <div className="text-brown-500 text-body-2 md:text-body-1 leading-relaxed whitespace-pre-line">
                  {articleDetail.content}
                </div>
              </div>

              {/* Author Sidebar - Desktop Only */}
              <div className="hidden md:block md:w-[280px] shrink-0">
                <div className="bg-brown-100 rounded-2xl p-6 sticky top-24">
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
                  placeholder="What are your thoughts?"
                  className="w-full p-3 md:p-4 border border-brown-300 rounded-xl text-body-2 md:text-body-1 text-brown-500 placeholder:text-brown-400 resize-none focus:outline-none focus:ring-2 focus:ring-brown-400 transition-all duration-300"
                  rows={3}
                />
                <div className="flex justify-center mt-3">
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
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
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
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ArticleDetail;
