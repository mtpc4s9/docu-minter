import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import axios from 'axios';
import { useStore } from '../store';

const UploadZone: React.FC = () => {
    const { setFile, setUploadResult, reset } = useStore();
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (file: File) => {
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are supported.');
            return;
        }
        setError(null);
        setFile(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8002/upload', formData);
            setUploadResult(response.data.file_id, response.data.filename, response.data.page_count);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Upload failed. Is the backend running?');
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
        <div className="w-full max-w-2xl mx-auto mt-12">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragOver ? 'border-blue-500 bg-blue-50/10' : 'border-gray-600 hover:border-blue-400'
                    }`}
            >
                <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Drop your PDF here</h3>
                    <p className="text-gray-400 mb-6">Or click to browse from your machine</p>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        className="hidden"
                        id="pdf-upload"
                    />
                    <label
                        htmlFor="pdf-upload"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                        Select PDF
                    </label>
                </div>
            </div>
            {error && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200 flex items-center gap-2">
                    <X className="w-4 h-4 cursor-pointer" onClick={() => setError(null)} />
                    {error}
                </div>
            )}
        </div>
    );
};

export default UploadZone;
