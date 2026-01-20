import React, { useState } from 'react';
import { Copy, Download, Eye, Edit3, Check, FileCode } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';

const PreviewSplitView: React.FC = () => {
    const { markdownContent, setMarkdownContent, fileName, fileId } = useStore();
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview');
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(markdownContent);
        setIsCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([markdownContent], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = `${fileName?.replace('.pdf', '') || 'extracted'}.md`;
        document.body.appendChild(element);
        element.click();
        toast.success('Download started');
    };

    if (!markdownContent) {
        return (
            <div className="h-[700px] flex flex-col items-center justify-center glass-card bg-white/[0.01]">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full animate-pulse" />
                    <FileCode className="w-16 h-16 text-slate-700 relative z-10" />
                </div>
                <p className="text-slate-500 text-sm font-medium tracking-wide">
                    Configure settings and run extraction to see results.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[800px] glass-card overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
                <div className="flex items-center gap-6">
                    <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                        </button>
                        <button
                            onClick={() => setViewMode('edit')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'edit' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Editor
                        </button>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl text-xs font-bold text-slate-300 transition-all"
                    >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        {isCopied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-900/20"
                    >
                        <Download className="w-4 h-4" />
                        Download .md
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {viewMode === 'preview' ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="h-full overflow-y-auto p-10 custom-scrollbar"
                        >
                            <div className="max-w-3xl mx-auto markdown-body">
                                <ReactMarkdown>{markdownContent}</ReactMarkdown>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="h-full flex flex-col"
                        >
                            <textarea
                                value={markdownContent}
                                onChange={(e) => setMarkdownContent(e.target.value)}
                                className="flex-1 p-10 bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed text-slate-300 selection:bg-brand-500/30"
                                spellCheck={false}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Status Bar */}
            <div className="px-6 py-3 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-600">
                <div className="flex items-center gap-4">
                    <span>Characters: {markdownContent.length.toLocaleString()}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-800" />
                    <span>Words: {markdownContent.split(/\s+/).filter(Boolean).length.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span>Local Storage Node: {fileId?.slice(0, 8)}</span>
                </div>
            </div>
        </div>
    );
};

export default PreviewSplitView;

