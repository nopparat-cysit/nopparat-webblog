import * as React from "react";
import { useState, useEffect } from "react";
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
import axios from "axios";
import SearchDropdown from "./SearchDropdown";

function ArticleSection() {

  const [blogData,setBlogData] = useState([])

  const [selectedCategory, setSelectedCategory] = useState("highlight");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCheck,setfilterCheck] = useState(false)
  const [page , setPage] = useState(1)
  const [totalPage , setTotalPage] = useState(0)
  const [isLoad,setIsLoad] = useState(false)
  const [dataCategory, setDataCategory] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isFetchingContent, setIsFetchingContent] = useState(false)
  console.log(searchResults);
  
  
  const getData = async () => {
    if (isLoad) return;
    setIsLoad(true)
    const response = await axios.get("https://blog-post-project-api.vercel.app/posts",
     { params: {
        page: page,
        limit: 6,
        category: selectedCategory === "highlight" ? "" : selectedCategory,
      }}
    );
    
    
    setfilterCheck(true)
    
    if (page === 1) {
      setBlogData(response.data.posts);
    } else {
      setBlogData((prevBlog) => [...prevBlog , ...response.data.posts]);
    }
    setTotalPage(response.data.totalPages);
    setIsLoad(false)
  };

  const getSearch = async() => {
    setIsFetchingContent(true)
    const catagoryData = await axios.get("https://blog-post-project-api.vercel.app/posts",
      { params: {
         keyword: searchTerm,
         limit: 100
       }})
       

       
    setSearchResults(catagoryData.data.posts)
    setIsFetchingContent(false)
  }

  const getCategory = async() => {
    const catagoryData = await axios.get("https://blog-post-project-api.vercel.app/posts")
    setDataCategory(catagoryData.data.posts)
  }
  
  

  useEffect(() => {
    getData();
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      getData(); 
    } else {
      setPage(1);
    }
  }, [selectedCategory]);

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(()=>{
    getSearch()
  },[searchTerm])


  const dataCategories = dataCategory.map((n) => n.category)
  const categories = ["Highlight", ...new Set(dataCategories)];
  
  const matchesCategory = (post) =>
    selectedCategory === "highlight"
      ? true
      : (post.category || "").toLowerCase() === selectedCategory;

  const matchesSearch = (post, term) =>
    (post.title || "").toLowerCase().includes(term) 

  const filteredPosts = (() => {
    return blogData.filter((post) => matchesCategory(post));
  })();

  // Filter searchResults based on searchTerm for dropdown
  const filteredSearchResults = (() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return searchResults.filter((post) => matchesSearch(post, term)).slice(0, 5);
  })();

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
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={(e) => {
                  // Delay to allow Link click to work
                  setTimeout(() => {
                    setIsSearchFocused(false);
                  }, 200);
                }}
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
                  posts={filteredSearchResults}
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
              <Select value={selectedCategory} onValueChange={() => {setSelectedCategory , setSearchTerm('')}}>
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
              <Tabs defaultValue="highlight" value={selectedCategory} onValueChange={() => {setSelectedCategory , setSearchTerm('')}}>
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
            <div className="relative flex-1 max-w-xs w-[360px]">
              <input
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={(e) => {
                  // Delay to allow Link click to work
                  setTimeout(() => {
                    setIsSearchFocused(false);
                  }, 200);
                }}
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
                  posts={filteredSearchResults}
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
          {page !== totalPage && page !== 0 && !isLoad && filteredPosts.length !== 0 ? (
            <div className="col-span-full pt-10 text-center text-brown-400 text-body-1 underline"
            onClick={() => setPage((page) => page + 1)}>
              View More
            </div>
            )
            : page !== totalPage && page !== 0 && page > 1 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-brown-400 min-h-[300px]">
              <h1 className="text-2xl text-center text-brown-500">Loading...</h1>
            </div>
            )
            : null
           }
          {filterCheck && filteredPosts.length === 0 && !isLoad && (
            <div className="col-span-full text-center text-brown-400">
              No articles match your filters.
            </div>
          )}
          {!filterCheck && (
            <div className="col-span-full flex flex-col items-center justify-center text-brown-400 min-h-[300px]">
              <svg className="w-[128px] h-[128px]" fill="#26231e" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
                <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                  <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
                </path>
              </svg>
              <h1 className="text-4xl text-center">Loading...</h1>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ArticleSection;
