"use client";

import React, { useState, useRef, useEffect } from "react";
import AppModal from "@/components/shared/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, UploadCloud, X, Loader2 } from "lucide-react";

type AddCategoryModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
};

const AddCategoryModal = ({ open, onClose, onSubmit }: AddCategoryModalProps) => {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state whenever modal opens
  useEffect(() => {
    if (open) {
      setTitle("");
      setImageFile(null);
      setImagePreview(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("image", "");
      }
      await onSubmit(formData);
    } catch (error) {
      // Keep state intact so user can correct input
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Add New Category"
      subtitle="Instantiate a new primary catalog category with metadata and imagery"
      maxWidthClassName="max-w-xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="rounded-xl px-4 py-2.5 text-xs font-bold"
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
            <span>Create Category</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-4 pt-2">
        {/* Category Title Input */}
        <div className="space-y-1.5">
          <label htmlFor="category-title" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Category Title <span className="text-rose-500">*</span>
          </label>
          <Input
            id="category-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Home, Garden & Furnitures"
            className="h-11 rounded-xl border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-950 text-sm font-semibold"
          />
        </div>

        {/* Category Image Upload Dropzone */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Category Banner Image
          </label>
          
          <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center hover:bg-slate-100/60 transition-colors group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title="Upload Category Image"
            />
            
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-900/5 group-hover:opacity-90 transition-opacity">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="text-xs font-bold text-white px-3 py-1.5 bg-slate-900/80 rounded-lg backdrop-blur-xs">
                    Click or drop to replace
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    clearImage();
                  }}
                  className="absolute top-2 right-2 rounded-full bg-rose-600 p-1.5 text-white shadow-md hover:bg-rose-700 transition-colors z-20 cursor-pointer"
                  title="Remove Image"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 px-4 pointer-events-none">
                <div className="grid size-12 place-items-center rounded-full bg-white text-blue-600 shadow-2xs mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="size-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  PNG, JPG, WEBP or GIF (max. 5MB)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppModal>
  );
};

export default AddCategoryModal;
