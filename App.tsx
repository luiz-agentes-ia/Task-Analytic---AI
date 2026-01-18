import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import UploadSection from './components/UploadSection';
import DoctorFormModal from './components/DoctorFormModal';
import Dashboard from './components/Dashboard';
import { DoctorProfile, AnalysisResult } from './types';
import { analyzeConversation } from './services/geminiService';
import { saveLeadToSheet } from './services/leadService';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);

  const handleInitiateAnalysis = () => {
    if (files.length === 0) return alert("Por favor, adicione pelo menos uma imagem.");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (profile: DoctorProfile) => {
    setDoctorProfile(profile);
    // Don't close modal yet, keep it for loading state
    setIsAnalyzing(true);

    // Salva os dados no Google Sheets em segundo plano (não bloqueia a IA)
    saveLeadToSheet(profile).catch(err => console.error("Falha silenciosa ao salvar lead", err));

    try {
      const result = await analyzeConversation(files, profile);
      setAnalysisResult(result);
      setIsModalOpen(false); // Close modal only after success
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao analisar as imagens. Verifique se sua chave API está configurada e tente novamente.");
      setIsModalOpen(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setAnalysisResult(null);
    setDoctorProfile(null);
    setIsModalOpen(false);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1a3add] rounded-lg flex items-center justify-center">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">Task Analytics <span className="text-[#1a3add]">AI</span></span>
              </div>
              <div className="flex items-center">
                 <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">v1.0 Beta</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main>
          {!analysisResult ? (
            <UploadSection 
              files={files} 
              setFiles={setFiles} 
              onAnalyze={handleInitiateAnalysis} 
            />
          ) : (
            <Dashboard 
              result={analysisResult} 
              profile={doctorProfile!} 
              onReset={handleReset} 
            />
          )}
        </main>

        {/* Modal for Data Collection */}
        <DoctorFormModal 
          isOpen={isModalOpen} 
          onClose={() => !isAnalyzing && setIsModalOpen(false)} 
          onSubmit={handleFormSubmit}
          isLoading={isAnalyzing}
        />
        
      </div>
    </HashRouter>
  );
};

export default App;