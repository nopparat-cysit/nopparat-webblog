import { SmilePlus, Copy, Facebook, Linkedin, Twitter } from "lucide-react";

function LikeShareSection({ likes, isLiked, onLike, onCopyLink }) {
  return (
    <div className="flex items-center justify-between gap-4 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-brown-300">
      {/* Like & Copy Link Buttons */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Like Button */}
        <button
          onClick={onLike}
          className={`cursor-pointer flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border transition-all duration-300 ${
            isLiked
              ? "border-brand-green bg-brand-green-soft text-brand-green"
              : "border-brown-300 bg-white text-brown-500 hover:border-brown-400"
          }`}
        >
          <SmilePlus
            className={`w-4 h-4 md:w-5 md:h-5 ${isLiked ? "fill-current" : ""}`}
          />
          <span className="text-body-2 md:text-body-1 font-medium">{likes}</span>
        </button>

        {/* Copy Link Button */}
        <button
          onClick={onCopyLink}
          className="cursor-pointer flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border border-brown-300 bg-white text-brown-500 hover:border-brown-400 transition-all duration-300"
        >
          <Copy className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-body-2 md:text-body-1 font-medium">Copy link</span>
        </button>
      </div>

      {/* Social Share */}
      <div className="flex items-center gap-2 md:gap-3">
        <button className="cursor-pointer w-8 h-8 md:w-10 md:h-10 rounded-full bg-brown-600 text-white flex items-center justify-center hover:bg-brown-500 transition-all duration-300">
          <Facebook className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button className="cursor-pointer w-8 h-8 md:w-10 md:h-10 rounded-full bg-brown-600 text-white flex items-center justify-center hover:bg-brown-500 transition-all duration-300">
          <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button className="cursor-pointer w-8 h-8 md:w-10 md:h-10 rounded-full bg-brown-600 text-white flex items-center justify-center hover:bg-brown-500 transition-all duration-300">
          <Twitter className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}

export default LikeShareSection;
