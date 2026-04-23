import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/common/Button";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fromState = location.state?.category;
    if (fromState) {
      setName(fromState.name ?? "");
    }
    setIsLoading(false);
  }, [location.state]);

  const validate = () => {
    const trimmed = name?.trim() ?? "";
    if (!trimmed) return { name: "กรุณากรอก Category name" };
    return {};
  };

  const handleSave = async () => {
    setFieldErrors({});
    const err = validate();
    if (Object.keys(err).length > 0) {
      setFieldErrors(err);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axios.put(`${apiBase}/categories`, { id: Number(id), name: name.trim() });
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      const updatedCategory = list[0] ?? { id: Number(id), name: name.trim() };
      navigate("/categories", {
        state: {
          updatedCategory,
          toast: { title: "Update category", message: "Category has been successfully updated.", type: "success" },
        },
      });
    } catch (err) {
      const msg = err.response?.data?.message ?? "Could not update category.";
      setFieldErrors({ name: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
        <AdminSidebar />
        <main className="flex-1 ml-[280px] flex items-center justify-center">
          <span className="text-brown-400">กำลังโหลด...</span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
      <AdminSidebar />

      <main className="flex-1 ml-[280px]">
        <div className="flex justify-between items-center px-16 py-8 pr-16">
          <h1 className="text-headline-3 text-brown-600 font-semibold">
            Edit category
          </h1>
          <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="w-full mx-auto pt-10 px-[60px] pb-[120px]">
          <div className=" border-brown-200 rounded-xl shadow-sm ">
            <div className="space-y-1 flex flex-col gap-1">
              <label className=" text-body-2  font-semibold text-brown-400">
                Category name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="Category name"
                className={`w-full bg-white h-[48px] px-4 border rounded-lg focus:outline-none text-body-2 ${
                  fieldErrors.name
                    ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-brown-200 focus:ring-2 focus:ring-brand-green/20"
                }`}
              />
              {fieldErrors.name && (
                <p className="text-body-3 text-red-500 mt-1">{fieldErrors.name}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditCategoryPage;
