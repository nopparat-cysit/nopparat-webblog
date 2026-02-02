import React from 'react'
import { Search, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Loading } from '@/common/Loading';
import Button from '@/common/Button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

 function ArticleManagement({ blogList, isLoad }) {
  const navigate = useNavigate()
  const categories = [
    { id: 1, name: "Cat" },
    { id: 2, name: "General" },
    { id: 3, name: "Inspiration" },
  ];
  return (
    <>
      <div>
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
                {isLoad ? (
                  <tr>
                    <td colSpan={4}>
                      <Loading />
                    </td>
                  </tr>
                ) : (
                  blogList.map((item, index) => (
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
                          <span className="text-brand-green font-semibold text-body-2">Published</span>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>

  )
}

