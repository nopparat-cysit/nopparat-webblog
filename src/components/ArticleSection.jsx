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
import { blogPosts } from "@/data/blogPosts";
import axios from "axios";

function ArticleSection() {

  const [blogData,setBlogData] = useState([])

  const [selectedCategory, setSelectedCategory] = useState("highlight");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCheck,setfilterCheck] = useState(false)

  const getData = async () => {
    const response = await axios.get("https://blog-post-project-api.vercel.app/posts");
    console.log(response.data.posts);
    setfilterCheck(true)
    setBlogData(response.data.posts);
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(blogData);
  const dataCategories = blogData.map((n) => n.category)
  const categories = ["Highlight", ...new Set(dataCategories)];
  console.log(categories);
  
  const matchesCategory = (post) =>
    selectedCategory === "highlight"
      ? true
      : (post.category || "").toLowerCase() === selectedCategory;

  const matchesSearch = (post, term) =>

    (post.title || "").toLowerCase().includes(term) ||
    (post.description || "").toLowerCase().includes(term) ||
    (post.author || "").toLowerCase().includes(term);

  const filteredPosts = (() => {
    const term = searchTerm.trim().toLowerCase();
    return blogData.filter((post) => matchesCategory(post) && matchesSearch(post, term));
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
            <div className="relative flex-1 max-w-xs w-[360px]">
              <input
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
      </div>
    </section>
  );
}

export default ArticleSection;
