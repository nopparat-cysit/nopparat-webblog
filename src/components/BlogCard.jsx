import * as React from "react";

function BlogCard({ image, category, title, description, author, date }) {
  // Author avatar image
  const authorImage = "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg";

  return (
    <div className="flex flex-col gap-4">
      {/* Image Container */}
      <a href="#" className="relative h-[212px] sm:h-[360px] overflow-hidden rounded-[16px]">
        <img
          className="w-full h-full object-cover"
          src={image}
          alt={title}
        />
      </a>

      {/* Content Section */}
      <div className="flex flex-col">
        {/* Category Badge - Below image */}
        <div className="flex mb-2">
          <span 
            className="inline-block rounded-full px-3 py-1 text-sm font-medium" 
            style={{ 
              backgroundColor: "var(--color-brand-green-soft)", 
              color: "var(--color-brand-green)"
            }}
          >
            {category}
          </span>
        </div>

        {/* Title */}
        <a href="#" className="block">
          <h2 className="text-start font-headline text-headline-4 mb-2 line-clamp-2 text-brown-600 hover:underline">
            {title}
          </h2>
        </a>

        {/* Description */}
        <p className="text-brown-400 text-body-2 mb-4 grow line-clamp-3">
          {description}
        </p>

        {/* Author & Date */}
        <div className="flex items-center text-sm text-brown-400">
          <img
            className="w-8 h-8 rounded-full mr-2"
            src={authorImage}
            alt={author}
          />
          <span className="font-medium">{author}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;

