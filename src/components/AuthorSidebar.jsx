function AuthorSidebar({ author, authorImage }) {
  return (
    <div className="hidden md:block w-[280px] shrink-0">
      <div className="bg-brown-100 rounded-[16px] p-6 sticky top-24">
        <p className="text-body-2 text-brown-400 mb-3">Author</p>
        <div className="flex items-center gap-3 mb-4">
          <img
            src={authorImage}
            alt={author}
            className="w-12 h-12 rounded-full object-cover"
          />
          <h3 className="text-body-1 text-brown-600 font-semibold">
            {author}
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
  );
}

export default AuthorSidebar;
