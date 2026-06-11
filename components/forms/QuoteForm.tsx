'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Upload, X, Mail, Loader2 } from 'lucide-react';
import { SITE_EMAIL, SITE_EMAIL_LINK } from '@/lib/siteContent';
import type { ReadonlyURLSearchParams } from 'next/navigation';

interface FormData {
  name: string;
  phone: string;
  email: string;
  registration: string;
  makeModel: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormData | 'photo', string>>;

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  registration: '',
  makeModel: '',
  message: '',
};

function QuoteFormContent({
  defaultMakeModel,
  searchParams,
}: {
  defaultMakeModel?: string;
  searchParams?: ReadonlyURLSearchParams | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultValues = useMemo(() => {
    const searchMakeModel = searchParams?.get('makeModel') || searchParams?.get('product') || '';
    const searchMessage = searchParams?.get('message') || '';

    return {
      ...initialFormData,
      makeModel: defaultMakeModel || searchMakeModel,
      message: searchMessage,
    };
  }, [defaultMakeModel, searchParams]);

  const [formData, setFormData] = useState<FormData>(defaultValues);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'opened'>('idle');
  const [lastSubmissionHadPhoto, setLastSubmissionHadPhoto] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      makeModel: prev.makeModel || defaultValues.makeModel,
      message: prev.message || defaultValues.message,
    }));
  }, [defaultValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'File must be under 10MB.' }));
      return;
    }

    setErrors((prev) => ({ ...prev, photo: undefined }));
    setPhoto(file);

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setErrors((prev) => ({ ...prev, photo: undefined }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.phone.trim() && !formData.email.trim()) {
      newErrors.phone = 'Please provide a phone number or email address.';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.makeModel.trim()) newErrors.makeModel = 'Car make and model is required.';
    if (!formData.message.trim()) newErrors.message = 'Please describe your requirements.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildMailtoHref = () => {
    const subject = `FDL Bespoke enquiry - ${formData.makeModel}`;
    const bodyLines = [
      'Hi FDL Bespoke,',
      '',
      'I would like to make an enquiry.',
      '',
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      `Registration: ${formData.registration || 'Not provided'}`,
      `Vehicle: ${formData.makeModel}`,
      '',
      'Requirements:',
      formData.message,
    ];

    if (photo) {
      bodyLines.push(
        '',
        `Photo selected locally: ${photo.name}`,
        'Please attach this photo manually in your email app before sending.'
      );
    }

    return `${SITE_EMAIL_LINK}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      bodyLines.join('\n')
    )}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setStatus('submitting');

    try {
      window.location.href = buildMailtoHref();
      setLastSubmissionHadPhoto(Boolean(photo));
      setStatus('opened');
      setFormData(defaultValues);
      setPhoto(null);
      setPhotoPreview(null);
      setErrors({});
    } catch {
      setStatus('idle');
      setErrors((prev) => ({
        ...prev,
        email: 'We could not open your email app. Please email us directly instead.',
      }));
    }
  };

  if (status === 'opened') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={28} className="text-black" />
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-bold uppercase text-white mb-3">
          Your enquiry is ready
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Your email app should open with your enquiry pre-filled.
        </p>
        {lastSubmissionHadPhoto && (
          <p className="text-gray-500 text-xs max-w-md mx-auto mb-6 leading-relaxed">
            Your photo is not attached automatically. Please add it inside your email app before sending.
          </p>
        )}
        <div className="flex flex-col items-center gap-4">
          <a
            href={SITE_EMAIL_LINK}
            className="text-[var(--accent)] text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Email {SITE_EMAIL}
          </a>
          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              setFormData(defaultValues);
              setLastSubmissionHadPhoto(false);
            }}
            className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Start another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="mb-6 text-xs leading-relaxed text-gray-500">
        Add the vehicle and what you need. Use either phone or email so we can reply with fitment, availability and next steps.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
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

        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Phone Number</label>
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

        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Email</label>
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

      <div className="mb-6 md:mb-8">
        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Vehicle Make, Model & Year *</label>
        <input
          type="text"
          name="makeModel"
          value={formData.makeModel}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-white/10 py-2 md:py-3 text-white focus:outline-none focus:border-[var(--accent)] text-base md:text-lg transition-colors"
          placeholder="e.g. 2021 Range Rover Sport SVR"
        />
        {errors.makeModel && <p className="text-red-400 text-xs mt-1">{errors.makeModel}</p>}
      </div>

      <div className="mb-6 md:mb-8">
        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">What are you looking for? *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full bg-transparent border-b border-white/10 py-2 md:py-3 text-white focus:outline-none focus:border-[var(--accent)] text-base md:text-lg transition-colors resize-none"
          placeholder="Tell us the part, service, retrofit or upgrade you need..."
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
      </div>

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
              aria-label="Remove selected photo"
            >
              <X size={12} className="text-white" />
            </button>
            <p className="text-gray-500 text-xs mt-2">{photo?.name}</p>
            <p className="text-gray-600 text-[11px] mt-1 max-w-[14rem] leading-relaxed">
              We&apos;ll ask you to attach this manually after your email app opens.
            </p>
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
        {errors.photo && <p className="text-red-400 text-xs mt-2">{errors.photo}</p>}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mb-6">
        Submitting this opens your email app with your enquiry pre-filled. No details are sent until you send the email yourself.
      </p>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-white text-black py-4 md:py-5 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[var(--accent)] hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Opening email...</span>
          </>
        ) : (
          <span>Send Enquiry</span>
        )}
      </button>
    </form>
  );
}

function QuoteFormWithSearchParams({ defaultMakeModel }: { defaultMakeModel?: string }) {
  const searchParams = useSearchParams();

  return <QuoteFormContent defaultMakeModel={defaultMakeModel} searchParams={searchParams} />;
}

function QuoteFormFallback({ defaultMakeModel }: { defaultMakeModel?: string }) {
  return <QuoteFormContent defaultMakeModel={defaultMakeModel} searchParams={null} />;
}

export default function QuoteForm({ defaultMakeModel }: { defaultMakeModel?: string } = {}) {
  return (
    <Suspense fallback={<QuoteFormFallback defaultMakeModel={defaultMakeModel} />}>
      <QuoteFormWithSearchParams defaultMakeModel={defaultMakeModel} />
    </Suspense>
  );
}
