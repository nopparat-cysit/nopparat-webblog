import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/common/Button";
import Dialog from "@/common/Dialog";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

const MOCK_CATEGORIES = [
  { id: "1", name: "Cat" },
  { id: "2", name: "General" },
  { id: "3", name: "Inspiration" },
];

function CategoriesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const state = location.state;
    if (state?.newCategory) {
      setCategories((prev) => [...prev, { ...state.newCategory, id: String(Date.now()) }]);
      window.history.replaceState({}, document.title, "/categories");
    }
    if (state?.updatedCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === state.updatedCategory.id ? state.updatedCategory : c))
      );
      window.history.replaceState({}, document.title, "/categories");
    }
  }, [location.state]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleDeleteClick = (category) => {
    setDeleteTarget(category);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
    setDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
    setDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
      <AdminSidebar />

      <main className="flex-1 ml-[280px]">
        <div className='flex justify-between items-center pr-16'>
          <h1 className="text-headline-3 text-brown-600 font-semibold px-16 py-8">
            Category Management
          </h1>
          <Button variant="primary" onClick={() => navigate('/categories/create')}>
            <div className='flex items-center gap-2'>
              <Plus />Create article
            </div>
          </Button>
        </div>
        <div className="border-t border-brown-300"></div>
        <div className="px-16 py-8 pb-[120px]">
          <div className="space-y-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 text-body-2 bg-white"
              />
            </div>

            <div className="bg-white border border-brown-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-brown-200">
                <span className="text-body-2 font-semibold text-brown-400">Category</span>
              </div>
              <ul className="divide-y divide-brown-100">
                {filteredCategories.map((category, index) => (
                  <li
                    key={category.id}
                    className={`flex items-center justify-between px-6 py-4 transition-colors hover:bg-brown-100/50 ${index % 2 === 0 ? "bg-white" : "bg-brown-100/30"
                      }`}
                  >
                    <span className="text-body-2 text-brown-600">{category.name}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="cursor-pointer text-brown-400 hover:text-yellow-500 transition-colors"
                        onClick={() => navigate(`/categories/edit/${category.id}`, { state: { category } })}
                        aria-label="Edit"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer text-brown-400 hover:text-red-500 transition-colors"
                        onClick={() => handleDeleteClick(category)}
                        aria-label="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Dialog
        isOpen={dialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete category"
        description="Do you want to delete this category?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  );
}

export default CategoriesPage;
