import { create } from 'zustand';

interface ProcessingOptions {
    start_page: number;
    end_page?: number;
    mode: 'raw' | 'clean';
}

interface DocuMinterState {
    file: File | null;
    fileId: string | null;
    fileName: string | null;
    pageCount: number;
    isUploading: boolean;
    isProcessing: boolean;
    markdownContent: string;
    options: ProcessingOptions;

    setFile: (file: File | null) => void;
    setUploadResult: (fileId: string, fileName: string, pageCount: number) => void;
    setProcessing: (isProcessing: boolean) => void;
    setMarkdownContent: (content: string) => void;
    setOptions: (options: Partial<ProcessingOptions>) => void;
    reset: () => void;
}

export const useStore = create<DocuMinterState>((set) => ({
    file: null,
    fileId: null,
    fileName: null,
    pageCount: 0,
    isUploading: false,
    isProcessing: false,
    markdownContent: '',
    options: {
        start_page: 1,
        mode: 'clean'
    },

    setFile: (file) => set({ file, isUploading: !!file }),
    setUploadResult: (fileId, fileName, pageCount) => set({
        fileId,
        fileName,
        pageCount,
        isUploading: false,
        options: { start_page: 1, end_page: pageCount, mode: 'clean' }
    }),
    setProcessing: (isProcessing) => set({ isProcessing }),
    setMarkdownContent: (markdownContent) => set({ markdownContent }),
    setOptions: (newOptions) => set((state) => ({
        options: { ...state.options, ...newOptions }
    })),
    reset: () => set({
        file: null,
        fileId: null,
        fileName: null,
        pageCount: 0,
        isUploading: false,
        isProcessing: false,
        markdownContent: '',
        options: { start_page: 1, mode: 'clean' }
    })
}));
