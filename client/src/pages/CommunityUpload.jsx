import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

const CommunityUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setSuccess(false);
    setError('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const token = localStorage.getItem('token');
      // Mocking success for now
      setTimeout(() => {
        setSuccess(true);
        setUploading(false);
        setFile(null);
      }, 2000);
    } catch (err) {
      setError('Upload failed. Please try again later.');
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-5 pt-6 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <header className="space-y-1">
        <h1 className="text-2xl font-black text-white tracking-tight">Community <span className="text-sky-400">Uploads</span></h1>
        <p className="text-slate-400 text-sm font-medium">Help others by sharing past year papers</p>
      </header>

      <div className="flex flex-col gap-5">
        <div className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 transition-all ${
          file ? 'border-sky-500/40 bg-sky-500/5' : 'border-white/10 bg-white/[0.02]'
        }`}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
          />
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${
            file ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-500'
          }`}>
            <Upload size={32} />
          </div>
          <h3 className="text-sm font-black text-white text-center">
            {file ? file.name : 'Click or drag PDF to upload'}
          </h3>
          <p className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Max 10MB · PDF only</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 font-bold">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400 font-bold">
            <CheckCircle size={18} className="shrink-0" />
            Paper uploaded! Our team will review it.
          </div>
        )}

        <button
          disabled={!file || uploading}
          onClick={handleUpload}
          className="premium-button w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl shadow-sky-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <span className="flex items-center gap-3">
              <Loader2 className="animate-spin" size={20} /> Parsing Paper...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              Upload Paper <FileText size={20} />
            </span>
          )}
        </button>

        <div className="glass-card space-y-3">
          <h4 className="font-black text-white flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-sky-400" /> Upload Guidelines
          </h4>
          <ul className="flex flex-col gap-2 text-xs text-slate-400 leading-relaxed font-medium">
            <li>• Ensure the PDF contains clear MCQ questions.</li>
            <li>• Mention Year and Paper Level in the filename.</li>
            <li>• Avoid blurry or hand-written papers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityUpload;
