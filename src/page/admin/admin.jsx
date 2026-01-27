import { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import { Search, ChevronDown, Pencil, Trash2 } from "lucide-react";

function Admin() {
  const [activeTab, setActiveTab] = useState("article");
  const [blogList, setBlogList] = useState([])
  console.log(blogList);

  const categories = [
    { id: 1, name: "Cat" },
    { id: 2, name: "General" },
    { id: 3, name: "Inspiration" },
  ];

  const getData = async () => {
    try {
      const respone = await axios.get('https://blog-post-project-api.vercel.app/posts',
        {
          params: {
            limit: 10,
          }
        }
      )
      setBlogList(respone.data.posts)
    } catch (error) {
      console.log(error);

    }

  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 ">
        <div className="">
          <h1 className="text-headline-3 text-brown-600 font-semibold px-16 py-8">
            {activeTab === "article" && "Article management"}
            {activeTab === "category" && "Category management"}
            {activeTab === "profile" && "Profile"}
            {activeTab === "notification" && "Notification"}
            {activeTab === "reset" && "Reset password"}
          </h1>
          {/* Artice section*/}
          <div className="border-t border-brown-300"></div>
          {activeTab === "article" &&
            <div className="px-16 py-8">
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 border border-brown-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange text-body-2"
                    />
                  </div>

                  <div className="flex gap-4">
                    {/* Status Filter */}
                    <div className="relative">
                      <select className="appearance-none bg-white border border-brown-300 rounded-lg px-4 py-2 pr-10 text-brown-500 text-body-2 min-w-[140px] focus:outline-none">
                        <option>Status</option>
                        <option>Published</option>
                        <option>Draft</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 w-4 h-4 pointer-events-none" />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                      <select className="appearance-none bg-white border border-brown-300 rounded-lg px-4 py-2 pr-10 text-brown-500 text-body-2 min-w-[140px] focus:outline-none">
                        <option>Category</option>
                        <option>Cat</option>
                        <option>General</option>
                        <option>Inspiration</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Table Section */}
                <div className="bg-white border border-brown-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-brown-200">
                        <th className="px-6 py-4 text-brown-400 font-medium text-body-2">Article title</th>
                        <th className="px-6 py-4 text-brown-400 font-medium text-body-2 w-32">Category</th>
                        <th className="px-6 py-4 text-brown-400 font-medium text-body-2 w-40">Status</th>
                        <th className="px-6 py-4 text-brown-400 font-medium text-body-2 w-24"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brown-100">
                      {blogList.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-brown-100 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-brown-100/50'}`}
                        >
                          <td className="px-6 py-4 text-brown-600 text-body-2 font-medium truncate max-w-xs md:max-w-md">
                            {item.title}
                          </td>
                          <td className="px-6 py-4 text-brown-500 text-body-2">
                            {item.category}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                              <span className="text-brand-green font-semibold text-body-2">"Published"</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <button className="cursor-pointer text-brown-400 hover:text-yellow-500 transition-colors">
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button className="cursor-pointer text-brown-400 hover:text-brand-red transition-colors">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
          {/* Category management section*/}
          {activeTab === "category" &&
            <div className="px-16 py-8">"Category management"</div>
          }

          {/* Profile section*/}
          {activeTab === "profile" && 
          <div className="px-16 py-8">"Profile"</div>
          }

          {/* Notification section*/}
          {activeTab === "notification" && 
          <div className="px-16 py-8">"Notification"</div>
          }

          {/* Reset password section*/}
          {activeTab === "reset" && 
          <div className="px-16 py-8">"Reset password"</div>
          }
          
        </div>
      </main>
    </div>
  );
}

export default Admin;
