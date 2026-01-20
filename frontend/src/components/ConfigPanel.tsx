import React from 'react';
import { Play, Sliders, FileText, Zap } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useStore } from '../store';

const ConfigPanel: React.FC = () => {
    const { fileId, options, setOptions, setProcessing, setMarkdownContent, isProcessing } = useStore();

    const handleProcess = async () => {
        if (!fileId) return;
        setProcessing(true);
        const processToastId = toast.loading('Extracting content...');

        try {
            const response = await axios.post('http://localhost:8002/process', {
                file_id: fileId,
                options: options
            });
            setMarkdownContent(response.data.markdown_content);
            toast.success('Extraction complete!', {
                id: processToastId,
                description: 'Content is ready for preview.'
            });
        } catch (err: any) {
            toast.error('Processing failed', {
                id: processToastId,
                description: err.response?.data?.detail || 'Check local engine status.'
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
                <Sliders className="w-4 h-4 text-brand-400" />
                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Configuration</h3>
            </div>

            <div className="glass-card p-6 space-y-8">
                {/* Page Range Section */}
                <div>
                    <div className="flex items-center gap-2 mb-4 text-white font-semibold text-sm">
                        <FileText className="w-4 h-4 text-brand-400" />
                        Page Range
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">Start</label>
                            <input
                                type="number"
                                min="1"
                                value={options.start_page}
                                onChange={(e) => setOptions({ start_page: Math.max(1, parseInt(e.target.value) || 1) })}
                                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">End</label>
                            <input
                                type="number"
                                placeholder="Auto"
                                value={options.end_page || ''}
                                onChange={(e) => setOptions({ end_page: parseInt(e.target.value) || undefined })}
                                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Mode Section */}
                <div>
                    <div className="flex items-center gap-2 mb-4 text-white font-semibold text-sm">
                        <Zap className="w-4 h-4 text-brand-400" />
                        Extraction Mode
                    </div>
                    <div className="flex p-1 bg-white/[0.03] border border-white/[0.05] rounded-2xl">
                        <button
                            onClick={() => setOptions({ mode: 'clean' })}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${options.mode === 'clean'
                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-900/40'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            Clean
                        </button>
                        <button
                            onClick={() => setOptions({ mode: 'raw' })}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${options.mode === 'raw'
                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-900/40'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            Raw
                        </button>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProcess}
                    disabled={isProcessing || !fileId}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm transition-all shadow-xl ${isProcessing
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-white text-slate-950 hover:bg-slate-200'
                        }`}
                >
                    {isProcessing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 fill-current" />
                            Run Extraction
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default ConfigPanel;

