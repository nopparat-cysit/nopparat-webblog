import React, { useState, useRef, useEffect, usen } from 'react';
import { Image as ImageIcon, ChevronDown } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Button from '@/common/Button';
import { useNavigate

 } from 'react-router-dom';
const CreateArticlePage = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate()
  const [previewUrl, setPreviewUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [category, setCategory] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (selectedFile) {
      setThumbnailFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setThumbnailFile(null);
      setPreviewUrl('');
    }
  };

  const getFormPayload = (status) => ({
    status,
    category,
    authorName,
    title,
    introduction: introduction.slice(0, 120),
    content,
    thumbnailFile: thumbnailFile || null,
  });

  const handleSave = (status) => {
    const payload = getFormPayload(status);
    console.log('Submit payload:', payload);
    navigate('/articles')
    // TODO: ส่ง API เช่น POST /articles ด้วย payload + FormData ถ้ามี thumbnailFile
  };

  return (
    <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
      <AdminSidebar />

      <main className="flex-1 ml-[280px]">
        {/* Header ตามรูป: Create article + ปุ่ม Save as draft / Save and publish */}
        <div className="flex justify-between items-center px-16 py-8 pr-16">
          <h1 className="text-headline-3 text-brown-600 font-semibold">
            Create article
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => handleSave('draft')}>
              Save as draft
            </Button>
            <Button variant="primary" onClick={() => handleSave('published')}>
              Save and publish
            </Button>
          </div>
        </div>

        <div className="w-full mx-auto pt-10 px-[60px] pb-[120px]">
          <div className="bg-white border border-brown-200 rounded-xl p-10 shadow-sm">
            <div className="flex flex-col gap-[28px]">

              {/* Thumbnail Upload + แสดงภาพตัวอย่าง */}
              <div className="space-y-3">
                <label className="text-body-2 font-semibold text-brown-400">Thumbnail image</label>
                <div className="flex gap-6 items-end">
                  <div
                    role="button"
                    tabIndex={0}
                    className="w-[400px] h-[220px] bg-brown-100 rounded-xl border-2 border-dashed border-brown-300 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="text-brown-300" size={48} />
                    )}
                  </div>
                  <label htmlFor="upload-input">
                    <div className="px-5 py-2 border border-brown-300 rounded-full text-body-3 font-semibold hover:bg-brown-100 transition-colors cursor-pointer">
                      Upload thumbnail image
                    </div>
                    <input
                      ref={fileInputRef}
                      id="upload-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="text-body-2 font-semibold text-brown-400">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-[48px] px-4 bg-white border border-brown-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-brand-green/20 text-body-2"
                  >
                    <option value="">Select category</option>
                    <option value="tech">Tech</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="news">News</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Author Name */}
              <div className="space-y-3">
                <label className="text-body-2 font-semibold text-brown-400">Author name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Thompson P."
                  className="w-full h-[48px] px-4 bg-brown-100 border-none rounded-lg focus:outline-none text-body-2"
                />
              </div>

              {/* Title */}
              <div className="space-y-3">
                <label className="text-body-2 font-semibold text-brown-400">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article title"
                  className="w-full h-[48px] px-4 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 text-body-2"
                />
              </div>

              {/* Introduction (max 120 letters) */}
              <div className="space-y-3">
                <label className="text-body-2 font-semibold text-brown-400">Introduction (max 120 letters)</label>
                <textarea
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value.slice(0, 120))}
                  placeholder="Introduction"
                  rows={4}
                  className="w-full p-4 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 text-body-2 resize-none"
                />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <label className="text-body-2 font-semibold text-brown-400">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Content"
                  rows={12}
                  className="w-full p-4 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 text-body-2 resize-none"
                />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateArticlePage;