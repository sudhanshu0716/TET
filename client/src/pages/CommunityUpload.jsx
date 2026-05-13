import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

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
      // In a real app, this endpoint would handle the PDF parsing
      // await axios.post('/api/questions/upload', formData, {
      //   headers: { 
      //     'Content-Type': 'multipart/form-data',
      //     'x-auth-token': token 
      //   }
      // });
      
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
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold text-white">Community Uploads</h1>
        <p className="text-slate-400 text-sm">Help others by sharing past year papers</p>
      </header>

      <div className="flex flex-col gap-6">
        <div className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 transition-all ${
          file ? 'border-primary-500 bg-primary-500/5' : 'border-slate-800 bg-slate-900/50'
        }`}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
          />
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
            file ? 'bg-primary-500 text-white' : 'bg-slate-800 text-slate-500'
          }`}>
            <Upload size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">
            {file ? file.name : 'Click or drag PDF to upload'}
          </h3>
          <p className="mt-1 text-xs text-slate-500">Max size: 10MB (PDF only)</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-400">
            <CheckCircle size={18} />
            Paper uploaded successfully! Our team will review and add it to the bank.
          </div>
        )}

        <button
          disabled={!file || uploading}
          onClick={handleUpload}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 font-bold text-white transition-all hover:bg-primary-600 active:scale-[0.98] disabled:opacity-30"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Parsing Paper...
            </>
          ) : (
            <>
              Upload Paper <FileText size={20} />
            </>
          )}
        </button>

        <div className="rounded-2xl bg-slate-900/80 p-6">
          <h4 className="mb-3 font-bold text-white flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-primary-500" /> Upload Guidelines
          </h4>
          <ul className="flex flex-col gap-2 text-xs text-slate-400 leading-relaxed">
            <li>• Ensure the PDF contains clear MCQ questions.</li>
            <li>• Mention the Year and Paper Level in the PDF name if possible.</li>
            <li>• Avoid blurry or hand-written papers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityUpload;
