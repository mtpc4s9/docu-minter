import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useStore } from '../store';

const UploadZone: React.FC = () => {
    const { setFile, setUploadResult } = useStore();
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFile = async (file: File) => {
        if (file.type !== 'application/pdf') {
            toast.error('Invalid file type. Please upload a PDF.', {
                icon: <AlertCircle className="w-4 h-4" />
            });
            return;
        }

        setIsUploading(true);
        const uploadToastId = toast.loading(`Uploading ${file.name}...`);

        try {
            setFile(file);
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://localhost:8002/upload', formData);
            setUploadResult(response.data.file_id, response.data.filename, response.data.page_count);

            toast.success('Document ready for processing', {
                id: uploadToastId,
                description: `${response.data.page_count} pages detected locally.`,
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            });
        } catch (err: any) {
            toast.error('Upload failed', {
                id: uploadToastId,
                description: err.response?.data?.detail || 'Is the local engine running on port 8002?'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <motion.div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`relative group border-2 border-dashed rounded-[2rem] p-16 text-center transition-all duration-300 ${isDragOver
                    ? 'border-brand-500 bg-brand-500/[0.05] shadow-[0_0_50px_-12px_rgba(14,165,233,0.3)]'
                    : 'border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]'
                    }`}
            >
                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="hidden"
                    id="pdf-upload"
                    disabled={isUploading}
                />

                <label
                    htmlFor="pdf-upload"
                    className="cursor-pointer flex flex-col items-center"
                >
                    <motion.div
                        initial={false}
                        animate={{
                            y: isDragOver ? -10 : 0,
                            scale: isDragOver ? 1.1 : 1
                        }}
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-colors ${isDragOver ? 'bg-brand-500 text-white' : 'bg-white/[0.03] text-brand-400 group-hover:bg-brand-500/10'
                            }`}
                    >
                        <Upload className="w-8 h-8" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-3 text-white">
                        {isDragOver ? 'Release to Start' : 'Drop your document'}
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                        Secure local processing. Your files never leave this machine.
                    </p>

                    <div className="px-8 py-3 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition-all shadow-lg shadow-brand-900/40">
                        Browse Files
                    </div>
                </label>

                <AnimatePresence>
                    {isUploading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-[2rem] flex flex-center flex-col items-center justify-center z-10"
                        >
                            <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mb-4" />
                            <p className="text-sm font-bold text-white tracking-widest uppercase">Analyzing PDF</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span>PDF Only</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-800" />
                <span>Max 50MB</span>
                <div className="w-1 h-1 rounded-full bg-slate-800" />
                <span>Local Only</span>
            </div>
        </div>
    );
};

export default UploadZone;

