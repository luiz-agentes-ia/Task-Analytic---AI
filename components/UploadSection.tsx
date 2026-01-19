import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Plus } from 'lucide-react';
import { PlanType } from '../types';

interface UploadSectionProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onAnalyze: () => void;
  credits: number;
  maxImages: number;
  planType: PlanType;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  files, 
  setFiles, 
  onAnalyze, 
  credits, 
  maxImages,
  planType 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      // Reset input value to allow selecting the same file again if needed
      e.target.value = '';
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setErrorMsg(null);
    // Basic validation for images
    const validImages = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (files.length + validImages.length > maxImages) {
      setErrorMsg(`Seu plano ${planType.toUpperCase()} permite no máximo ${maxImages} imagens por análise. Faça um upgrade para enviar mais.`);
      // Adiciona apenas até o limite
      const slotsRemaining = maxImages - files.length;
      if (slotsRemaining > 0) {
        setFiles(prev => [...prev, ...validImages.slice(0, slotsRemaining)]);
      }
    } else {
      setFiles(prev => [...prev, ...validImages]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setErrorMsg(null);
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
          <p className="text-gray-500 mb-2">
            ou clique para selecionar arquivos
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 font-medium">
             Plano {planType.toUpperCase()}: Limite de {maxImages} imagens por lote
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Suporta PNG, JPG, JPEG (Prints do WhatsApp/Direct)
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-in slide-in-from-top-2">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-8 space-y-6">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <ImageIcon size={18} /> Arquivos Selecionados ({files.length}/{maxImages})
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

            {/* Botão de Adicionar Mais Imagens */}
            {files.length < maxImages && (
               <label className="cursor-pointer relative flex flex-col items-center justify-center aspect-[9/16] rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-white hover:border-[#1a3add] transition-all group">
                 <input
                   type="file"
                   multiple
                   accept="image/*"
                   className="hidden"
                   onChange={handleFileInput}
                 />
                 <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-[#1a3add] group-hover:text-[#1a3add] transition-colors shadow-sm mb-2">
                    <Plus size={20} />
                 </div>
                 <span className="text-sm font-medium text-gray-500 group-hover:text-[#1a3add]">Adicionar</span>
               </label>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={onAnalyze}
              className="bg-[#1a3add] hover:bg-[#152eb0] text-white font-bold py-4 px-12 rounded-full shadow-lg shadow-[#1a3add]/30 transition-transform transform hover:scale-105 active:scale-95 text-lg flex items-center gap-2"
            >
              <span>Analisar Conversas Agora</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-normal">
                ({credits} auditoria{credits !== 1 && 's'})
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;