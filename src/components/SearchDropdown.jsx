import { Link } from "react-router-dom";

function SearchDropdown({ posts, searchTerm, isLoading, onSelect }) {
  if (!searchTerm.trim()) return null;

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-brown-200 z-50">
        <div className="px-4 py-3 text-brown-400 text-body-2">
          Searching...
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-brown-200 z-50">
        <div className="px-4 py-3 text-brown-400 text-body-2">
          No articles found
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-brown-200 max-h-[400px] overflow-y-auto z-50">
      <div className="py-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect();
            }}
            className="block px-4 py-3 hover:bg-brown-50 transition-colors cursor-pointer"
          >
            <h3 className="text-body-1 text-brown-600 font-medium">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SearchDropdown;
