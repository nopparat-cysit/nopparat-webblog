import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/common/Button";

function CreateCategoryPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const trimmed = name?.trim() ?? "";
    if (!trimmed) return { name: "กรุณากรอก Category name" };
    return {};
  };

  const handleSave = () => {
    setFieldErrors({});
    const err = validate();
    if (Object.keys(err).length > 0) {
      setFieldErrors(err);
      return;
    }
    navigate("/categories", { state: { newCategory: { name: name.trim() } } });
  };

  return (
    <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
      <AdminSidebar />

      <main className="flex-1 ml-[280px]">
        <div className="flex justify-between items-center px-16 py-8 pr-16">
          <h1 className="text-headline-3 text-brown-600 font-semibold">
            Create category
          </h1>
          <Button variant="primary" onClick={handleSave}>
            Save
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
                className={`bg-white w-full h-[48px] px-4 border rounded-lg focus:outline-none text-body-2 ${
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

export default CreateCategoryPage;
