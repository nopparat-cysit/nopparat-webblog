import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, ChevronDown } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Button from '@/common/Button';
import { useNavigate } from 'react-router-dom';

const CreateArticlePage = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [category, setCategory] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [content, setContent] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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
      setFieldErrors((prev) => ({ ...prev, thumbnail: '' }));
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

  const validate = (status) => {
    const err = {};
    const trimmedTitle = title?.trim() ?? '';
    const trimmedAuthor = authorName?.trim() ?? '';
    const trimmedIntro = introduction?.trim() ?? '';
    const trimmedContent = content?.trim() ?? '';
    const trimmedCategory = category?.trim() ?? '';
    if (!trimmedTitle) err.title = 'กรุณากรอก Title';
    if (!trimmedAuthor) err.authorName = 'กรุณากรอก Author name';
    if (!trimmedIntro) err.introduction = 'กรุณากรอก Introduction';
    if (!trimmedContent) err.content = 'กรุณากรอก Content';
    if (!trimmedCategory) err.category = 'กรุณาเลือก Category';
    if (!previewUrl && !thumbnailFile) err.thumbnail = 'กรุณาอัปโหลด Thumbnail image';
    return err;
  };

  const handleSave = (status) => {
    setFieldErrors({});
    const err = validate(status);
    if (Object.keys(err).length > 0) {
      setFieldErrors(err);
      return;
    }
    const payload = getFormPayload(status);
    console.log('Submit payload:', payload);
    navigate('/articles');
    // TODO: ส่ง API เช่น POST /articles ด้วย payload + FormData ถ้ามี thumbnailFile
  };

  return (
    <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
      <AdminSidebar />

      <main className="flex-1 ml-[280px]">
        {/* Header ตามรูป: Create article + ปุ่ม Save as draft / Save and publish */}

        <div className='flex justify-between items-center pr-16'>
          <h1 className="text-headline-3 text-brown-600 font-semibold px-16 py-8">
            Create article
          </h1>
          <div className='flex gap-4'>
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
              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">Thumbnail image</label>
                <div className="flex gap-6 items-end">
                  <div
                    role="button"
                    tabIndex={0}
                    className={`w-[400px] h-[220px] bg-brown-100 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0 cursor-pointer ${fieldErrors.thumbnail ? 'border-red-500' : 'border-brown-300'}`}
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
                {fieldErrors.thumbnail && (
                  <p className="text-body-3 text-red-500 mt-1">{fieldErrors.thumbnail}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setFieldErrors((prev) => ({ ...prev, category: '' })); }}
                    className={`w-full h-[48px] px-4 bg-white border rounded-lg appearance-none focus:outline-none text-body-2 ${fieldErrors.category ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-brown-200 focus:ring-2 focus:ring-brand-green/20'}`}
                  >
                    <option value="">Select category</option>
                    <option value="tech">Tech</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="news">News</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none" size={18} />
                </div>
                {fieldErrors.category && (
                  <p className="text-body-3 text-red-500 mt-1">{fieldErrors.category}</p>
                )}
              </div>

              {/* Author Name */}
              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">Author name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => { setAuthorName(e.target.value); setFieldErrors((prev) => ({ ...prev, authorName: '' })); }}
                  placeholder="Thompson P."
                  className={`w-full h-[48px] px-4 bg-brown-100 rounded-lg focus:outline-none text-body-2 ${fieldErrors.authorName ? 'border-2 border-red-500' : 'border-none'}`}
                />
                {fieldErrors.authorName && (
                  <p className="text-body-3 text-red-500 mt-1">{fieldErrors.authorName}</p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setFieldErrors((prev) => ({ ...prev, title: '' })); }}
                  placeholder="Article title"
                  className={`w-full h-[48px] px-4 border rounded-lg focus:outline-none text-body-2 ${fieldErrors.title ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-brown-200 focus:ring-2 focus:ring-brand-green/20'}`}
                />
                {fieldErrors.title && (
                  <p className="text-body-3 text-red-500 mt-1">{fieldErrors.title}</p>
                )}
              </div>

              {/* Introduction (max 120 letters) */}
              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">Introduction (max 120 letters)</label>
                <textarea
                  value={introduction}
                  onChange={(e) => { setIntroduction(e.target.value.slice(0, 120)); setFieldErrors((prev) => ({ ...prev, introduction: '' })); }}
                  placeholder="Introduction"
                  rows={4}
                  className={`w-full p-4 border rounded-lg focus:outline-none text-body-2 resize-none ${fieldErrors.introduction ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-brown-200 focus:ring-2 focus:ring-brand-green/20'}`}
                />
                {fieldErrors.introduction && (
                  <p className="text-body-3 text-red-500 mt-1">{fieldErrors.introduction}</p>
                )}
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => { setContent(e.target.value); setFieldErrors((prev) => ({ ...prev, content: '' })); }}
                  placeholder="Content"
                  rows={12}
                  className={`w-full p-4 border rounded-lg focus:outline-none text-body-2 resize-none ${fieldErrors.content ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-brown-200 focus:ring-2 focus:ring-brand-green/20'}`}
                />
                {fieldErrors.content && (
                  <p className="text-body-3 text-red-500 mt-1">{fieldErrors.content}</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateArticlePage;