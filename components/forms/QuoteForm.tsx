'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  registration: string;
  makeModel: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  registration: '',
  makeModel: '',
  message: '',
};

export default function QuoteForm({ defaultMakeModel }: { defaultMakeModel?: string } = {}) {
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    makeModel: defaultMakeModel ?? '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'File must be under 10MB' } as any));
      return;
    }

    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.makeModel.trim()) newErrors.makeModel = 'Car make & model is required';
    if (!formData.message.trim()) newErrors.message = 'Please describe your requirements';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    // UI-only for now — simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
    setFormData(initialFormData);
    setPhoto(null);
    setPhotoPreview(null);
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-black" />
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-bold uppercase text-white mb-3">Quote Requested</h3>
        <p className="text-gray-400 text-sm mb-8">We&apos;ll be in touch shortly with your custom quote.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-[var(--accent)] text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Name */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/10 py-2 md:py-3 text-white focus:outline-none focus:border-[var(--accent)] text-base md:text-lg transition-colors"
            placeholder="Your full name"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/10 py-2 md:py-3 text-white focus:outline-none focus:border-[var(--accent)] text-base md:text-lg transition-colors"
            placeholder="07xxx xxxxxx"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/10 py-2 md:py-3 text-white focus:outline-none focus:border-[var(--accent)] text-base md:text-lg transition-colors"
            placeholder="you@email.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Registration */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Registration</label>
          <input
            type="text"
            name="registration"
            value={formData.registration}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/10 py-2 md:py-3 text-white focus:outline-none focus:border-[var(--accent)] text-base md:text-lg transition-colors uppercase"
            placeholder="AB12 CDE"
          />
        </div>
      </div>

      {/* Car Make & Model */}
      <div className="mb-6 md:mb-8">
        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Car Make & Model *</label>
        <input
          type="text"
          name="makeModel"
          value={formData.makeModel}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-white/10 py-2 md:py-3 text-white focus:outline-none focus:border-[var(--accent)] text-base md:text-lg transition-colors"
          placeholder="e.g. Range Rover Sport SVR"
        />
        {errors.makeModel && <p className="text-red-400 text-xs mt-1">{errors.makeModel}</p>}
      </div>

      {/* Message */}
      <div className="mb-6 md:mb-8">
        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Message / Details *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full bg-transparent border-b border-white/10 py-2 md:py-3 text-white focus:outline-none focus:border-[var(--accent)] text-base md:text-lg transition-colors resize-none"
          placeholder="Describe what you're looking for..."
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
      </div>

      {/* Photo Upload */}
      <div className="mb-8 md:mb-12">
        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-3">Attach Car Photo</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {photoPreview ? (
          <div className="relative inline-block">
            <img src={photoPreview} alt="Preview" className="w-24 h-24 object-cover border border-white/10" />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
            >
              <X size={12} className="text-white" />
            </button>
            <p className="text-gray-500 text-xs mt-2">{photo?.name}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 px-5 py-3 border border-dashed border-white/20 text-gray-400 text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <Upload size={16} />
            <span>Choose Photo</span>
          </button>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-white text-black py-4 md:py-5 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[var(--accent)] hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <span>Submit Inquiry</span>
        )}
      </button>
    </form>
  );
}
