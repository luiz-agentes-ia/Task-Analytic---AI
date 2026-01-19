import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Check } from 'lucide-react';
import UploadSection from './components/UploadSection';
import DoctorFormModal from './components/DoctorFormModal';
import Dashboard from './components/Dashboard';
import CreditModal from './components/CreditModal';
import { DoctorProfile, AnalysisResult, PlanType } from './types';
import { analyzeConversation } from './services/geminiService';
import { saveLeadToSheet } from './services/leadService';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);

  // Estado do Plano Atual (Pode ser expandido futuramente com integração de login)
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');

  // Configurações dos planos (Limites)
  const planLimits = {
    free: { maxImages: 3 },
    go: { maxImages: 6 },
    plus: { maxImages: 10 }
  };

  // Estado dos créditos
  const [credits, setCredits] = useState<number>(() => {
    const savedCredits = localStorage.getItem('task_analytics_credits');
    return savedCredits ? parseInt(savedCredits, 10) : 10;
  });

  useEffect(() => {
    localStorage.setItem('task_analytics_credits', credits.toString());
  }, [credits]);

  const handleInitiateAnalysis = () => {
    if (files.length === 0) return alert("Por favor, adicione pelo menos uma imagem.");
    
    // Verifica limite de imagens do plano antes de prosseguir
    const maxImages = planLimits[currentPlan].maxImages;
    if (files.length > maxImages) {
      alert(`Seu plano atual (${currentPlan.toUpperCase()}) permite apenas ${maxImages} imagens por análise.`);
      return;
    }

    // Verifica se tem créditos
    if (credits <= 0) {
      setIsCreditModalOpen(true);
      return;
    }

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (profile: DoctorProfile) => {
    setDoctorProfile(profile);
    setIsAnalyzing(true);

    saveLeadToSheet(profile).catch(err => console.error("Falha silenciosa ao salvar lead", err));

    try {
      setCredits(prev => Math.max(0, prev - 1));

      const result = await analyzeConversation(files, profile);
      setAnalysisResult(result);
      setIsModalOpen(false);
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
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-gradient-to-br from-[#1a3add] to-[#152eb0] rounded-lg flex items-center justify-center shadow-md shadow-blue-900/20">
                  <Check className="text-white h-6 w-6" strokeWidth={3} />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">Task Analytics <span className="text-[#1a3add]">AI</span></span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="hidden md:flex items-center px-3 py-1 bg-blue-50 text-[#1a3add] rounded-md text-sm font-semibold border border-blue-100">
                    {credits} créditos restantes
                 </div>
                 
                 {/* Botão de Plano Clicável */}
                 <button 
                    onClick={() => setIsCreditModalOpen(true)}
                    className="hidden md:flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium uppercase border border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                    title="Clique para ver os planos"
                 >
                    Plano {currentPlan}
                 </button>

                 <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">v2.3 Fixed</span>
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
              credits={credits}
              maxImages={planLimits[currentPlan].maxImages}
              planType={currentPlan}
            />
          ) : (
            <Dashboard 
              result={analysisResult} 
              profile={doctorProfile!} 
              onReset={handleReset} 
            />
          )}
        </main>

        <DoctorFormModal 
          isOpen={isModalOpen} 
          onClose={() => !isAnalyzing && setIsModalOpen(false)} 
          onSubmit={handleFormSubmit}
          isLoading={isAnalyzing}
        />

        <CreditModal 
          isOpen={isCreditModalOpen}
          onClose={() => setIsCreditModalOpen(false)}
        />
        
      </div>
    </HashRouter>
  );
};

export default App;