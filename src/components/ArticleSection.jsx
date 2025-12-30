import * as React from "react";
import { Search } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

function ArticleSection() {
  return (
    <section className="w-full px-4 py-12 md:px-32 md:py-20 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 bg-brown-100 rounded-t-[16px] px-6 py-4">
          {/* Category Tabs - Left Side */}
          <div className="flex items-center gap-2">
            <Tabs defaultValue="highlight">
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
          <div className="relative flex-1 max-w-xs">
            <Input
              type="search"
              placeholder="Search"
              className="bg-white border-0 rounded-md pl-4 pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArticleSection;
