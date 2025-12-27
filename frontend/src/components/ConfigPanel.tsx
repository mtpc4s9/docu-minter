import React from 'react';
import { Settings, Play, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useStore } from '../store';

const ConfigPanel: React.FC = () => {
    const { fileId, options, setOptions, setProcessing, setMarkdownContent, isProcessing } = useStore();

    const handleProcess = async () => {
        if (!fileId) return;
        setProcessing(true);
        try {
            const response = await axios.post('http://localhost:8002/process', {
                file_id: fileId,
                options: options
            });
            setMarkdownContent(response.data.markdown_content);
        } catch (err) {
            console.error('Processing failed', err);
            alert('Processing failed. Please check the backend console.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-lg">Extraction Settings</h3>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Page Range</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            value={options.start_page}
                            onChange={(e) => setOptions({ start_page: parseInt(e.target.value) || 1 })}
                            className="w-20 bg-gray-900 border border-gray-600 rounded px-2 py-1"
                        />
                        <span>to</span>
                        <input
                            type="number"
                            value={options.end_page || ''}
                            onChange={(e) => setOptions({ end_page: parseInt(e.target.value) || undefined })}
                            className="w-20 bg-gray-900 border border-gray-600 rounded px-2 py-1"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Processing Mode</label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setOptions({ mode: 'clean' })}
                            className={`flex-1 py-2 px-3 rounded border transition-all ${options.mode === 'clean' ? 'bg-blue-600 border-blue-400' : 'bg-gray-900 border-gray-600'
                                }`}
                        >
                            Clean (Smart)
                        </button>
                        <button
                            onClick={() => setOptions({ mode: 'raw' })}
                            className={`flex-1 py-2 px-3 rounded border transition-all ${options.mode === 'raw' ? 'bg-blue-600 border-blue-400' : 'bg-gray-900 border-gray-600'
                                }`}
                        >
                            Raw Text
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {options.mode === 'clean' ? 'Removes headers/footers and fixes paragraph breaks.' : 'Extracts text exactly as it appears in the PDF.'}
                    </p>
                </div>

                <button
                    onClick={handleProcess}
                    disabled={isProcessing || !fileId}
                    className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${isProcessing ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/20'
                        }`}
                >
                    {isProcessing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4" />
                            Start Extraction
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ConfigPanel;
