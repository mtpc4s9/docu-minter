import React from 'react';
import { Copy, Download, FileJson } from 'lucide-react';
import { useStore } from '../store';

const PreviewSplitView: React.FC = () => {
    const { markdownContent, setMarkdownContent, fileName, fileId } = useStore();

    const handleCopy = () => {
        navigator.clipboard.writeText(markdownContent);
        alert('Copied to clipboard!');
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([markdownContent], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = `${fileName?.replace('.pdf', '') || 'extracted'}.md`;
        document.body.appendChild(element);
        element.click();
    };

    if (!markdownContent) {
        return (
            <div className="h-[600px] flex items-center justify-center border border-gray-700 rounded-xl bg-gray-900/50 italic text-gray-500">
                Markdown preview will appear here after processing.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[700px] bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
                <h4 className="font-medium text-blue-400">Markdown Result (Editable)</h4>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300"
                        title="Copy to clipboard"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300"
                        title="Download .md"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex h-full overflow-hidden">
                {/* Left: Simplified PDF Placeholder / Browser Viewer if possible */}
                <div className="w-1/3 bg-gray-950 border-r border-gray-700 p-4 overflow-y-auto">
                    <div className="text-xs uppercase text-gray-600 font-bold mb-4">Original PDF Guide</div>
                    <div className="p-4 bg-gray-900 border border-gray-800 rounded text-center text-gray-500 text-sm">
                        <FileJson className="w-12 h-12 mx-auto mb-2 text-gray-700" />
                        PDF Viewer remains local to browser security. Use your native viewer for reference.
                    </div>
                    {fileId && (
                        <div className="mt-4 text-xs text-gray-600">
                            ID: {fileId}
                        </div>
                    )}
                </div>

                {/* Right: Editable Text Area */}
                <div className="flex-1 flex flex-col">
                    <textarea
                        value={markdownContent}
                        onChange={(e) => setMarkdownContent(e.target.value)}
                        className="flex-1 p-6 bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed text-gray-200"
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default PreviewSplitView;
