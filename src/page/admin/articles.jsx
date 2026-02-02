import { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import React from 'react'
import { Search, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Loading } from '@/common/Loading';
import Button from '@/common/Button';
import Toast from '@/common/Toast';
import Dialog from '@/common/Dialog';
import { Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function Admin() {
  const [activeTab, setActiveTab] = useState("article");
  const [blogList, setBlogList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, title: '', message: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate()
  const location = useLocation()

  const uniqueCategories = [...new Set(blogList.map((b) => b.category).filter(Boolean))].sort();
  const filteredBlogList = blogList.filter((item) => {
    const matchSearch = !searchQuery.trim() || (item.title ?? "").toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchStatus = !statusFilter || (item.status ?? "Published") === statusFilter;
    const matchCategory = !categoryFilter || item.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  useEffect(() => {
    const state = location.state;
    if (state?.toast?.title) {
      setToast({ show: true, title: state.toast.title, message: state.toast.message ?? '' });
      window.history.replaceState({}, document.title, '/articles');
    }
  }, [location.state]);

  const handleEdit = (id) => {
    navigate(`/article/edit/${id}`)
  }

  const handleDeleteClick = (item) => {
    setDeleteTarget(item);
    setDialogOpen(true);
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setBlogList((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDialogOpen(false);
      setToast({ show: true, title: 'Delete article', message: 'Article has been successfully deleted.' });
    }
  }

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
    setDialogOpen(false);
  }


  const getData = async () => {
    setIsLoading(true)
    try {
      const respone = await axios.get('https://blog-post-project-api.vercel.app/posts',
        {
          params: {
            limit: 15,
          }
        }
      )
      setBlogList(respone.data.posts)
    } catch (error) {
      console.log(error);

    }
    setIsLoading(false)

  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="flex min-h-screen bg-brown-100">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 ">
        <div className="">
          {/* <h1 className="text-headline-3 text-brown-600 font-semibold px-16 py-8">
            {activeTab === "article" && "Article management"}
            {activeTab === "category" && "Category management"}
            {activeTab === "profile" && "Profile"}
            {activeTab === "notification" && "Notification"}
            {activeTab === "reset" && "Reset password"}
          </h1> */}
          {/* Artice section*/}
          <div className="border-t border-brown-300"></div>
          {activeTab === "article" &&
            <div className="ml-[280px]">
              <div className="">
                <div className='flex justify-between items-center pr-16'>
                  <h1 className="text-headline-3 text-brown-600 font-semibold px-16 py-8">
                    Article Management
                  </h1>
                  <Button variant="primary" onClick={() => navigate('/articles/create')}>
                    <div className='flex items-center gap-2'>
                      <Plus />Create article
                    </div>
                  </Button>
                </div>

                {/* Artice section*/}
                <div className="border-t border-brown-300"></div>

              </div>

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border bg-white border-brown-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange text-body-2"
                      />
                    </div>

                    <div className="flex gap-4">
                      {/* Status Filter */}
                      <div className="relative">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="appearance-none bg-white border border-brown-300 rounded-lg px-4 py-2 pr-10 text-brown-500 text-body-2 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                        >
                          <option value="">Status</option>
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 w-4 h-4 pointer-events-none" />
                      </div>

                      {/* Category Filter */}
                      <div className="relative">
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="appearance-none bg-white border border-brown-300 rounded-lg px-4 py-2 pr-10 text-brown-500 text-body-2 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                        >
                          <option value="">Category</option>
                          {uniqueCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
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
                        {isLoading ? (
                          <tr>
                            <td colSpan={4}>
                              <Loading />
                            </td>
                          </tr>
                        ) : blogList.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-body-2 text-brown-400">
                              No articles found.
                            </td>
                          </tr>
                        ) : filteredBlogList.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-body-2 text-brown-400">
                              No articles match your filters.
                            </td>
                          </tr>
                        ) : (
                          filteredBlogList.map((item, index) => (
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
                                  <span className={`w-2 h-2 rounded-full ${(item.status ?? "Published") === "Published" ? "bg-brand-green" : "bg-brown-400"}`}></span>
                                  <span className={`font-semibold text-body-2 ${(item.status ?? "Published") === "Published" ? "text-brand-green" : "text-brown-400"}`}>
                                    {item.status ?? "Published"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <button className="cursor-pointer text-brown-400 hover:text-yellow-500 transition-colors" onClick={()=>handleEdit(item.id)}>
                                    <Pencil className="w-5 h-5" />
                                  </button>
                                  <button className="cursor-pointer text-brown-400 hover:text-brand-red transition-colors" onClick={() => handleDeleteClick(item)} aria-label="Delete">
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
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

      <Dialog
        isOpen={dialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete article"
        description="Do you want to delete this article?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />

      <Toast
        type="success"
        title={toast.title}
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast((p) => ({ ...p, show: false }))}
        autoClose={3000}
      />
    </div>
  );
}

export default Admin;
