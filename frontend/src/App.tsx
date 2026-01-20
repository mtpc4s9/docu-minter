import React from 'react';
import { FileStack, Github, Cpu, Sparkles } from 'lucide-react';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import UploadZone from './components/UploadZone';
import ConfigPanel from './components/ConfigPanel';
import PreviewSplitView from './components/PreviewSplitView';
import { useStore } from './store';

const App: React.FC = () => {
  const { fileId, fileName } = useStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-brand-500/30 overflow-x-hidden">
      <Toaster position="top-center" expand={false} richColors theme="dark" />

      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <nav className="border-b border-white/[0.05] bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-gradient-to-br from-brand-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-brand-500/20">
              <FileStack className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              DocuMinter
            </h1>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Cpu className="w-3 h-3 text-brand-400" />
              <span>Local Engine v1.0</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <button className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {!fileId ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto px-6 pt-24 pb-12 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold mb-8"
            >
              <Sparkles className="w-3 h-3" />
              <span>Privacy First - 100% Offline Processing</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-[1.1]">
              Convert PDFs to <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-400 to-brand-400 animate-gradient">
                Clean Markdown
              </span>
            </h2>

            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the power of local heuristic extraction. No cloud, no subscriptions, just pure structured text for your LLMs.
            </p>

            <UploadZone />
          </motion.div>
        ) : (
          <motion.main
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-[1800px] mx-auto px-6 md:px-10 py-10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="hover:text-slate-300 cursor-pointer">Workspace</span>
                  <span>/</span>
                  <span className="text-slate-300">Processing</span>
                </nav>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {fileName}
                  <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 text-[10px] font-bold uppercase tracking-widest">
                    PDF
                  </span>
                </h2>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-xs text-slate-500 hover:text-rose-400 transition-colors uppercase tracking-widest font-bold border-b border-transparent hover:border-rose-400 pb-0.5"
              >
                Reset Project
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1 space-y-6">
                <ConfigPanel />
                <div className="p-4 glass rounded-2xl border border-brand-500/10 bg-brand-500/[0.02]">
                  <h4 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">Technical Note</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Extraction is optimized for technical documents. Images and complex vector graphics are skipped to maintain LLM context density.
                  </p>
                </div>
              </aside>

              <div className="lg:col-span-3">
                <PreviewSplitView />
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="max-w-[1800px] mx-auto px-10 py-16 border-t border-white/[0.05] text-center">
        <p className="text-slate-500 text-sm">
          Built with <span className="text-brand-500">Google Antigravity</span> & Senior AI Architecture.
        </p>
      </footer>
    </div>
  );
};

export default App;

