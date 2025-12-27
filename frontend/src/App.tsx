import React from 'react';
import { FileStack, Github, Cpu } from 'lucide-react';
import UploadZone from './components/UploadZone';
import ConfigPanel from './components/ConfigPanel';
import PreviewSplitView from './components/PreviewSplitView';
import { useStore } from './store';

const App: React.FC = () => {
  const { fileId, fileName } = useStore();

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 selection:bg-blue-500/30">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <FileStack className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">DocuMinter</h1>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 rounded-full text-xs">
              <Cpu className="w-3 h-3 text-green-400" />
              <span>Local Engine (v1.0)</span>
            </div>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <button className="text-gray-300 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (Visible only when no file is uploaded) */}
      {!fileId && (
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
          <h2 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
            Convert PDFs to Clean Markdown <br />
            <span className="text-blue-500 italic">Entirely Locally.</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Extract text, headings, and paragraphs. Skip the images and layout noise.
            Optimized for Claude, ChatGPT, and Notion.
          </p>
          <UploadZone />
        </div>
      )}

      {/* Main Content (Visible during/after upload) */}
      {fileId && (
        <main className="max-w-[1800px] mx-auto px-10 py-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">Processing Document</h2>
              <div className="text-blue-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm font-mono">{fileName}</span>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-gray-400 hover:text-red-400 underline underline-offset-4"
            >
              Start Over
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ConfigPanel />
              <div className="mt-6 p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">Privacy Note</h4>
                <p className="text-xs text-blue-200/60 leading-relaxed">
                  No data leaves your device. Processing is handled by our local heuristic engine on Port 8002.
                </p>
              </div>
            </div>

            <div className="lg:col-span-3">
              <PreviewSplitView />
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="max-w-[1800px] mx-auto px-10 py-12 border-t border-gray-800 text-center text-gray-500 text-sm">
        Built with Google Antigravity & Senior AI Architecture.
      </footer>
    </div>
  );
};

export default App;
