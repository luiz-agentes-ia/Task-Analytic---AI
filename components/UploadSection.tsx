import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

interface UploadSectionProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onAnalyze: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ files, setFiles, onAnalyze }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    // Basic validation for images
    const validImages = newFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prev => [...prev, ...validImages]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          Task Analytics <span className="text-[#1a3add]">AI</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Auditoria Comercial Médica: Envie prints das suas conversas de WhatsApp. Nossa Inteligência Artificial analisará seu funil de vendas, 
          identificará gargalos e sugerirá melhorias para aumentar sua conversão de consultas.
        </p>
      </div>

      <div 
        className={`
          relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-[#1a3add] bg-[#1a3add]/5 scale-[1.01]' 
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center pointer-events-none">
          <div className="w-20 h-20 bg-[#1a3add]/10 rounded-full flex items-center justify-center mb-4 text-[#1a3add]">
            <UploadCloud size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Arraste os prints da conversa aqui
          </h3>
          <p className="text-gray-500">
            ou clique para selecionar arquivos
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Suporta PNG, JPG, JPEG (Prints do WhatsApp/Direct)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8 space-y-6">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <ImageIcon size={18} /> Arquivos Selecionados ({files.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group aspect-[9/16] rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="preview" 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={onAnalyze}
              className="bg-[#1a3add] hover:bg-[#152eb0] text-white font-bold py-4 px-12 rounded-full shadow-lg shadow-[#1a3add]/30 transition-transform transform hover:scale-105 active:scale-95 text-lg"
            >
              Analisar Conversas Agora
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;