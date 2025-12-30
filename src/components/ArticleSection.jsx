import * as React from "react";
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

function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = React.useState("highlight");

  return (
    <section className="w-full px-4 py-12 md:px-32 md:py-20 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Header */}
        <h2 className="text-headline-3 text-brown-600 font-sans font-weight-headline mb-6">
          Latest articles
        </h2>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-4 bg-brown-100 rounded-t-[16px] px-6 py-4 mb-6">
          {/* Category Select - Mobile */}
          <div className="block md:hidden w-full">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full bg-white border-0">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="highlight">Highlight</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="inspiration">Inspiration</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Category Tabs - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Tabs defaultValue="highlight" value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="bg-transparent p-0 h-auto gap-2">
                <TabsTrigger 
                  value="highlight"
                  className="bg-transparent text-brown-400 data-[state=active]:bg-brown-200 data-[state=active]:text-brown-600 rounded-md px-4 py-2"
                >
                  Highlight
                </TabsTrigger>
                <TabsTrigger 
                  value="cat"
                  className="bg-transparent text-brown-400 data-[state=active]:bg-brown-200 data-[state=active]:text-brown-600 rounded-md px-4 py-2"
                >
                  Cat
                </TabsTrigger>
                <TabsTrigger 
                  value="inspiration"
                  className="bg-transparent text-brown-400 data-[state=active]:bg-brown-200 data-[state=active]:text-brown-600 rounded-md px-4 py-2"
                >
                  Inspiration
                </TabsTrigger>
                <TabsTrigger 
                  value="general"
                  className="bg-transparent text-brown-400 data-[state=active]:bg-brown-200 data-[state=active]:text-brown-600 rounded-md px-4 py-2"
                >
                  General
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search Bar - Right Side */}
          <div className="relative flex-1 max-w-xs w-full md:w-[360px] ">
            <input
              type="search"
              placeholder="Search"
              className="w-full bg-white border border-brown-100 rounded-[12px] pl-4 pr-12 py-3 text-brown-400 font-sans font-weight-body text-body-1 leading-[1.5rem] focus:outline-none focus:ring-2 focus:ring-brown-300 transition placeholder:text-brown-400 placeholder:font-weight-body placeholder:text-body-1 placeholder:leading-[1.5rem]"
              style={{
                fontFamily: "var(--font-family-sans)",
                fontWeight: "var(--font-weight-body)",
                fontSize: "var(--font-size-body-1)",
                lineHeight: "1.5rem",
                letterSpacing: "0",
                boxShadow: "0 1px 4px 0 rgba(38, 35, 30, 0.04)"
              }}
            />
            <svg
              className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-brown-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Articles Grid - Responsive: 1 column on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <BlogCard
              key={post.id}
              image={post.image}
              category={post.category}
              title={post.title}
              description={post.description}
              author={post.author}
              date={post.date}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArticleSection;
