import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FileText, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface FileEditorDrawerProps {
  filePath: string | null;
  onClose: () => void;
}

export default function FileEditorDrawer({ filePath, onClose }: FileEditorDrawerProps) {
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!filePath) return;
    setIsLoading(true);
    fetch(`http://127.0.0.1:8000/api/fs/read?path=${encodeURIComponent(filePath)}`)
      .then(res => res.json())
      .then(data => {
        setContent(data.content || '');
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setContent('Error loading file.');
        setIsLoading(false);
      });
  }, [filePath]);

  const handleSave = async () => {
    if (!filePath) return;
    setIsSaving(true);
    try {
      await fetch(`http://127.0.0.1:8000/api/fs/write?path=${encodeURIComponent(filePath)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  return (
    <AnimatePresence>
      {filePath && (
        <motion.div
          initial={{ x: -600, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -600, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-0 left-0 right-0 h-full bg-[#1a1a24] border-r border-gray-700/50 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-40 flex flex-col"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#12121a]">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-400 w-5 h-5" />
              <h2 className="text-sm font-mono text-gray-300">
                {filePath}
              </h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 rounded-md text-xs font-bold transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-[#1e1e1e]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <Editor
                height="100%"
                defaultLanguage="markdown"
                theme="vs-dark"
                value={content}
                onChange={(val) => setContent(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  padding: { top: 16 },
                  fontFamily: '"JetBrains Mono", monospace'
                }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
