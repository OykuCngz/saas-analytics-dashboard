import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BulkUpload = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('ecotrack_token');
      await axios.post('http://localhost:8000/upload-csv', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Batch processing complete! Data imported successfully.');
      onUploadSuccess();
      onClose();
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Import failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Upload size={20} className="text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Bulk Data Import</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div 
            onClick={() => fileInputRef.current.click()}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'}`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".csv" 
              className="hidden" 
            />
            {file ? (
              <>
                <FileText size={48} className="text-emerald-400" />
                <div className="text-center">
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                   <Upload size={24} className="text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-slate-300 font-medium">Click to select CSV</p>
                  <p className="text-xs text-slate-500 mt-1">Files must include: metric_name, value, category</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 space-y-3">
             <div className="flex items-start gap-2 text-xs text-slate-400">
                <CheckCircle size={14} className="text-emerald-500 mt-0.5" />
                <span>Automatic validation and multi-tenant isolation.</span>
             </div>
             <div className="flex items-start gap-2 text-xs text-slate-400">
                <CheckCircle size={14} className="text-emerald-500 mt-0.5" />
                <span>Bulk insert with pandas optimized processing.</span>
             </div>
          </div>
        </div>

        <div className="p-4 bg-slate-800/30 border-t border-slate-700 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!file || isUploading}
            onClick={handleUpload}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : 'Upload & Process'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BulkUpload;
