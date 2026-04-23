import React, { useState, useRef, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Button from '@/common/Button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Image as ImageIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function EditArticle() {
    const param = useParams();
    const location = useLocation();
    const passedArticle = location.state?.article ?? {};
    const { token, user } = useAuth();
    const [oldData, setOldData] = useState(passedArticle);
    const [isLoading, setIsLoading] = useState(!Object.keys(passedArticle).length);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [previewUrl, setPreviewUrl] = useState(passedArticle.image ?? passedArticle.Image ?? '');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [category, setCategory] = useState(passedArticle.category_id ? String(passedArticle.category_id) : '');
    const authorName = user?.name ?? '';
    const [title, setTitle] = useState(passedArticle.title ?? '');
    const [introduction, setIntroduction] = useState(passedArticle.description ?? '');
    const [content, setContent] = useState(passedArticle.content ?? '');
    const [fieldErrors, setFieldErrors] = useState({});

    const getData = async () => {
        if (!param.id) return;
        try {
            const response = await axios.get(`${apiBase}/posts/${param.id}`);
            // API returns { data: post } — read the nested data field
            const fromApi = response.data?.data || {};
            setOldData((prev) => {
                const merged = { ...prev };
                Object.entries(fromApi).forEach(([key, value]) => {
                    if (value != null && value !== '') merged[key] = value;
                });
                return merged;
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [param.id]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${apiBase}/categories`);
                const list = Array.isArray(res.data.data) ? res.data.data : res.data.data?.categories ?? [];
                setCategories(list);
            } catch {
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    // Fill form fields when oldData is loaded from API
    useEffect(() => {
        if (!oldData || Object.keys(oldData).length === 0) return;
        if (oldData.title != null && oldData.title !== '') setTitle(oldData.title);
        if (oldData.category_id != null && oldData.category_id !== '') setCategory(String(oldData.category_id));
        if (oldData.description != null && oldData.description !== '') setIntroduction(oldData.description);
        if (oldData.content != null && oldData.content !== '') setContent(oldData.content);
        const img = oldData.image ?? oldData.Image ?? '';
        if (img) setPreviewUrl(img);
    }, [oldData]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        if (selectedFile) {
            setThumbnailFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setThumbnailFile(null);
            setPreviewUrl(oldData?.image ?? oldData?.Image ?? '');
        }
    };

    const validate = (status) => {
        const err = {};
        const trimmedTitle = title?.trim() ?? '';
        const trimmedAuthor = authorName?.trim() ?? '';
        const trimmedIntro = introduction?.trim() ?? '';
        const trimmedContent = content?.trim() ?? '';
        const hasCategory = category !== '' && category != null;
        if (!trimmedTitle) err.title = 'กรุณากรอก Title';
        if (!trimmedAuthor) err.authorName = 'กรุณากรอก Author name';
        if (!trimmedIntro) err.introduction = 'กรุณากรอก Introduction';
        if (!trimmedContent) err.content = 'กรุณากรอก Content';
        if (!hasCategory) err.category = 'กรุณาเลือก Category';
        if (status === 'published' && !previewUrl && !thumbnailFile) err.thumbnail = 'กรุณาอัปโหลด Thumbnail image เมื่อต้องการ Publish';
        return err;
    };

    const handleSave = async (status) => {
        setFieldErrors({});
        const err = validate(status);
        if (Object.keys(err).length > 0) {
            setFieldErrors(err);
            return;
        }
        setIsSaving(true);

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', introduction.trim().slice(0, 120));
        formData.append('content', content.trim());
        formData.append('category_id', Number(category));
        formData.append('status_id', status === 'published' ? 2 : 1);
        if (thumbnailFile) {
            formData.append('imageFile', thumbnailFile);
        } else {
            formData.append('image', previewUrl || oldData?.image || '');
        }

        const headers = { 'Content-Type': 'multipart/form-data' };
        if (token) headers.Authorization = `Bearer ${token}`;

        try {
            await axios.put(`${apiBase}/posts/${param.id}`, formData, { headers });
            const toast =
                status === 'published'
                    ? { title: 'Update article and published', message: 'Your article has been successfully updated and published.' }
                    : { title: 'Update article and saved as draft', message: 'You can publish article later.' };
            navigate('/articles', { state: { toast } });
        } catch (error) {
            console.error('Error updating post:', error);
            const errStatus = error.response?.status;
            const message =
                errStatus === 401
                    ? 'กรุณาเข้าสู่ระบบใหม่ (Session หมดอายุหรือยังไม่ได้เข้าสู่ระบบ)'
                    : error.response?.data?.message ?? error.message ?? 'Failed to update post. Please try again.';
            setFieldErrors((prev) => ({ ...prev, submit: message }));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
            <AdminSidebar />

            <main className="flex-1 ml-[280px]">
                <div className="flex justify-between items-center px-16 py-8 pr-16">
                    <h1 className="text-headline-3 text-brown-600 font-semibold">
                        Edit article
                    </h1>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" onClick={() => handleSave('draft')} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save as draft'}
                        </Button>
                        <Button variant="primary" onClick={() => handleSave('published')} disabled={isSaving}>
                            {isSaving ? 'Publishing...' : 'Save and publish'}
                        </Button>
                    </div>
                </div>
                {fieldErrors.submit && (
                    <p className="text-body-3 text-red-500 px-16 pt-2">{fieldErrors.submit}</p>
                )}

                {/* body */}
                <div className="w-full mx-auto pt-10 px-[60px] pb-[120px]">
                    {isLoading ? (
                        <div className="bg-white border border-brown-200 rounded-xl p-10 shadow-sm flex items-center justify-center min-h-[400px] text-brown-400">
                            กำลังโหลด...
                        </div>
                    ) : (
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
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none" size={18} />
                                </div>
                                {fieldErrors.category && (
                                    <p className="text-body-3 text-red-500 mt-1">{fieldErrors.category}</p>
                                )}
                            </div>

                            {/* Author Name (locked) */}
                            <div className="space-y-1">
                                <label className="text-body-2 font-semibold text-brown-400">Author name</label>
                                <input
                                    type="text"
                                    value={authorName}
                                    readOnly
                                    placeholder="Thompson P."
                                    className="w-full h-[48px] px-4 bg-brown-100 rounded-lg border border-brown-200 text-brown-400 cursor-not-allowed text-body-2 focus:outline-none"
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
                    )}
                </div>

            </main>
        </div>
    )
}

export default EditArticle
