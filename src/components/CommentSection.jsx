function CommentSection({ 
  comments, 
  comment, 
  onCommentChange, 
  onCommentFocus, 
  onSendComment 
}) {
  return (
    <div className="mt-8 md:mt-12">
      <h3 className="text-body-1 md:text-headline-4 text-brown-600 font-semibold mb-4 md:mb-6">
        Comment
      </h3>

      {/* Comment Input */}
      <div className="mb-6 md:mb-8">
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          onFocus={onCommentFocus}
          placeholder="What are your thoughts?"
          className="w-full p-3 md:p-4 border border-brown-300 rounded-[16px] text-body-2 md:text-body-1 text-brown-500 placeholder:text-brown-400 resize-none focus:outline-none focus:ring-2 focus:ring-brown-400 transition-all duration-300"
          rows={3}
        />
        <div className="flex justify-center mt-4">
          <button
            onClick={onSendComment}
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
  );
}

export default CommentSection;
