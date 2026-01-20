import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import BlogCard from "./BlogCard";
import { blogPosts } from "@/data/blogPosts";
import axios from "axios";
import SearchDropdown from "./SearchDropdown";

function ArticleSection() {

  const [blogData, setBlogData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("highlight");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCheck, setfilterCheck] = useState(false);
  const [postsWithContent, setPostsWithContent] = useState([]);
  const [isFetchingContent, setIsFetchingContent] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // รีเซ็ตโพสต์เมื่อเปลี่ยน category
  useEffect(() => {
    setBlogData([]);
    setPage(1);
    setHasMore(true);
    setfilterCheck(false);
  }, [selectedCategory]);

  // โหลดข้อมูลเมื่อ page หรือ selectedCategory เปลี่ยน
  useEffect(() => {
    // ป้องกันการโหลดซ้ำถ้ายังโหลดไม่เสร็จ
    if (isLoading) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categoryParam = selectedCategory === "highlight" ? "" : selectedCategory;

        const response = await axios.get("https://blog-post-project-api.vercel.app/posts", {
          params: {
            page: page,
            limit: 6,
            category: categoryParam,
          },
        });

        if (page === 1) {
          // แทนที่โพสต์เดิม
          setBlogData(response.data.posts);
          setPostsWithContent([]);
        } else {
          // รวมโพสต์ใหม่กับโพสต์เดิม
          setBlogData((prevPosts) => [...prevPosts, ...response.data.posts]);
        }

        // ตรวจสอบว่าถึงหน้าสุดท้ายหรือยัง
        if (response.data.currentPage >= response.data.totalPages) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setfilterCheck(true);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setfilterCheck(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory]);
  console.log(blogData);
  const dataCategories = blogData.map((n) => n.category)
  const categories = ["Highlight", ...new Set(dataCategories)];
  console.log(categories);
  
  // Fetch content สำหรับ posts ที่ตรงกับ search
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term || blogData.length === 0) {
      setPostsWithContent([]);
      return;
    }

    const fetchContentForSearch = async () => {
      setIsFetchingContent(true);
      try {
        // ค้นหา title และ description ก่อน (ไม่ต้อง fetch content)
        const titleDescMatches = blogData.filter((post) => {
          const titleMatch = (post.title || "").toLowerCase().includes(term);
          const descMatch = (post.description || "").toLowerCase().includes(term);
          return titleMatch || descMatch;
        });

        // Posts ที่ไม่ match title/description ต้อง fetch content เพื่อค้นหา
        const otherPosts = blogData.filter((post) => {
          const titleMatch = (post.title || "").toLowerCase().includes(term);
          const descMatch = (post.description || "").toLowerCase().includes(term);
          return !titleMatch && !descMatch;
        });

        // Fetch content สำหรับ posts ที่ไม่ match title/description
        const postsWithContentData = await Promise.all(
          otherPosts.map(async (post) => {
            try {
              const response = await axios.get(
                `https://blog-post-project-api.vercel.app/posts/${post.id}`
              );
              const content = (response.data.content || "").toLowerCase();
              if (content.includes(term)) {
                return {
                  ...post,
                  content: response.data.content || "",
                };
              }
              return null;
            } catch (error) {
              console.error(`Error fetching content for post ${post.id}:`, error);
              return null;
            }
          })
        );

        // รวม posts ที่ match title/description กับ posts ที่ match content
        const allMatches = [
          ...titleDescMatches,
          ...postsWithContentData.filter((post) => post !== null),
        ];

        setPostsWithContent(allMatches);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setIsFetchingContent(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchContentForSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, blogData]);

  const matchesSearch = (post, term) => {
    const titleMatch = (post.title || "").toLowerCase().includes(term);
    const descMatch = (post.description || "").toLowerCase().includes(term);
    const contentMatch = (post.content || "").toLowerCase().includes(term);
    return titleMatch || descMatch || contentMatch;
  };

  // Search results สำหรับ dropdown
  const searchResults = (() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return [];
    }
    return postsWithContent.filter((post) => matchesSearch(post, term));
  })();

  // Filtered posts สำหรับแสดงใน grid
  const filteredPosts = (() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return blogData;
    }
    
    // ค้นหาใน blogData ที่มี title/description match
    const titleDescMatches = blogData.filter((post) => {
      const titleMatch = (post.title || "").toLowerCase().includes(term);
      const descMatch = (post.description || "").toLowerCase().includes(term);
      return titleMatch || descMatch;
    });

    // รวมกับ posts ที่ match content
    const contentMatches = postsWithContent.filter((post) => {
      const titleMatch = (post.title || "").toLowerCase().includes(term);
      const descMatch = (post.description || "").toLowerCase().includes(term);
      // ถ้า match title/description แล้วจะอยู่ใน titleDescMatches แล้ว
      if (titleMatch || descMatch) return false;
      // ตรวจสอบ content
      return (post.content || "").toLowerCase().includes(term);
    });

    // รวมผลลัพธ์และลบ duplicates
    const allMatches = [...titleDescMatches, ...contentMatches];
    const uniqueMatches = allMatches.filter((post, index, self) =>
      index === self.findIndex((p) => p.id === post.id)
    );
    
    return uniqueMatches;
  })();

  // ฟังก์ชันเพิ่มหน้า
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // ปิด dropdown เมื่อคลิกนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="w-full px-4 py-12 md:px-32 md:py-20 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Header */}
        <h2 className="text-headline-3 text-brown-600 font-sans font-weight-headline mb-6 animate-in fade-in slide-in-from-bottom duration-700">
          Latest articles
        </h2>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-4 bg-brown-100 rounded-[16px] px-4 py-4 mb-12 shadow-sm transition-all duration-300 hover:shadow-md ">
          {/* Mobile Layout: Search on top, Category below */}
          <div className="block md:hidden w-full space-y-4">
            {/* Search Bar - Top (Mobile) */}
            <div className="relative w-full" ref={searchContainerRef}>
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full bg-white border border-brown-100 rounded-[12px] pl-4 pr-12 py-3 text-brown-400 font-sans font-weight-body text-body-1 leading-6 focus:outline-none focus:ring-2 focus:ring-brown-300 transition placeholder:text-brown-400 placeholder:font-weight-body placeholder:text-body-1 placeholder:leading-6"
                style={{
                  fontFamily: "var(--font-family-sans)",
                  fontWeight: "var(--font-weight-body)",
                  fontSize: "var(--font-size-body-1)",
                  lineHeight: "1.5rem",
                  letterSpacing: "0",
                  boxShadow: "0 1px 4px 0 rgba(38, 35, 30, 0.04)"
                }}
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400 pointer-events-none" />
              {isSearchFocused && (
                <SearchDropdown
                  posts={searchResults}
                  searchTerm={searchTerm}
                  isLoading={isFetchingContent}
                  onSelect={() => {
                    setSearchTerm("");
                    setIsSearchFocused(false);
                  }}
                />
              )}
            </div>

            {/* Category Select - Bottom (Mobile) */}
            <div className="w-full">
              <label className="block text-body-2 text-brown-400 font-weight-body mb-2">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full bg-white border-0 pl-4 pr-5 py-3 rounded-[12px] text-brown-400 !text-brown-400 data-[placeholder]:text-brown-400 data-[placeholder]:!text-brown-400 font-sans font-weight-body text-body-1 leading-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-brown-300 transition"
                  style={{
                    fontFamily: "var(--font-family-sans)",
                    fontWeight: "var(--font-weight-body)",
                    fontSize: "var(--font-size-body-1)",
                    lineHeight: "1.5rem",
                    letterSpacing: "0",
                    boxShadow: "0 1px 4px 0 rgba(38, 35, 30, 0.04)"
                  }}
                >
                  <SelectValue
                    placeholder="Select category"
                    className="text-brown-400 !text-brown-400 data-[placeholder]:text-brown-400 data-[placeholder]:!text-brown-400"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((category) => (
                      <SelectItem value={category.toLowerCase()} key={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desktop Layout: Category Tabs on left, Search on right */}
          <div className="hidden md:flex items-center justify-between w-full gap-4">
            {/* Category Tabs - Desktop */}
            <div className="flex items-center gap-2 rounded-[12px] bg-white p-2">
              <Tabs defaultValue="highlight" value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="bg-transparent p-0 h-auto gap-2">
                  {categories.map((category) => (
                    <TabsTrigger
                      value={category.toLowerCase()}
                      key={category}
                      onClick={() => setSelectedCategory(category.toLowerCase())}
                      className={
                        selectedCategory === category.toLowerCase()
                          ? "bg-brown-500 text-white font-semibold shadow-md rounded-[8px]"
                          : "bg-brown-100 text-brown-400 font-normal hover:bg-brown-200 rounded-[8px]"
                      }
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Search Bar - Right Side (Desktop) */}
            <div className="relative flex-1 max-w-xs w-[360px]" ref={searchContainerRef}>
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full bg-white border border-brown-100 rounded-[16px] pl-4 pr-12 py-3 text-brown-400 font-sans font-weight-body text-body-1 leading-6 focus:outline-none focus:ring-2 focus:ring-brown-300 transition placeholder:text-brown-400 placeholder:font-weight-body placeholder:text-body-1 placeholder:leading-6"
                style={{
                  fontFamily: "var(--font-family-sans)",
                  fontWeight: "var(--font-weight-body)",
                  fontSize: "var(--font-size-body-1)",
                  lineHeight: "1.5rem",
                  letterSpacing: "0",
                  boxShadow: "0 1px 4px 0 rgba(38, 35, 30, 0.04)"
                  
                }}
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-brown-500 pointer-events-none" />
              {isSearchFocused && (
                <SearchDropdown
                  posts={searchResults}
                  searchTerm={searchTerm}
                  isLoading={isFetchingContent}
                  onSelect={() => {
                    setSearchTerm("");
                    setIsSearchFocused(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Articles Grid - Responsive: 1 column on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both"
              }}
            >
              <BlogCard
                id={post.id}
                image={post.image}
                category={post.category}
                title={post.title}
                description={post.description}
                author={post.author}
                date={post.date}
              />
            </div>
          ))}
          {filterCheck && filteredPosts.length === 0 && (
            <div className="col-span-full text-center text-brown-400">
              No articles match your filters.
            </div>
          )}
          {!filterCheck && (
            <div className="col-span-full text-center text-brown-400">
              <h1>Loading...</h1>
            </div>
          )}
        </div>

        {/* View More Button */}
        {hasMore && filterCheck && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="hover:text-brown-500 font-medium underline text-brown-400 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "View more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ArticleSection;
