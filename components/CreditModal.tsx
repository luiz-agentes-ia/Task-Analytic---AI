import React from 'react';
import { X, Zap, Check, Star } from 'lucide-react';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreditModal: React.FC<CreditModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200 relative my-8">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20"
        >
          <X size={20} className="text-gray-600" />
        </button>

        <div className="p-8 text-center bg-gradient-to-b from-gray-50 to-white pb-0">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-red-200">
                <Zap size={16} className="fill-red-600" />
                Limite de Auditorias Grátis Atingido
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Escolha o plano ideal para sua clínica</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
                Desbloqueie todo o potencial da Inteligência Artificial para aumentar suas vendas. Escolha o pacote que melhor se adapta ao volume da sua equipe.
            </p>
        </div>

        <div className="p-4 md:p-8 bg-white">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                
                {/* Plano GO */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
                     <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano GO</h3>
                     <p className="text-gray-500 text-sm mb-6">Para médicos e pequenas equipes</p>
                     
                     <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-sm text-gray-500 font-medium">R$</span>
                        <span className="text-4xl font-bold text-gray-900">59,90</span>
                        <span className="text-gray-500">/mês</span>
                     </div>

                     <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-gray-700">
                            <div className="p-1 rounded-full bg-blue-100 text-blue-600"><Check size={14} strokeWidth={3} /></div>
                            <span className="font-bold">100 Créditos</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                             <div className="p-1 rounded-full bg-blue-100 text-blue-600"><Check size={14} strokeWidth={3} /></div>
                            <span><strong className="text-gray-900">6 imagens</strong> por análise simultânea</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                             <div className="p-1 rounded-full bg-blue-100 text-blue-600"><Check size={14} strokeWidth={3} /></div>
                            <span>Análise Detalhada de Funil</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                             <div className="p-1 rounded-full bg-blue-100 text-blue-600"><Check size={14} strokeWidth={3} /></div>
                            <span>Prós, Contras e Plano de Ação</span>
                        </li>
                     </ul>

                     <a 
                        href="https://pay.kiwify.com.br/Ptzh2fN" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-center hover:bg-blue-50 transition-colors"
                     >
                        Assinar Plano GO
                     </a>
                </div>

                {/* Plano PLUS */}
                <div className="bg-[#1a3add] text-white rounded-2xl border border-[#1a3add] p-8 shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-transform relative overflow-hidden">
                     <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" /> Mais Vendido
                     </div>
                     
                     <h3 className="text-2xl font-bold mb-2">Plano PLUS</h3>
                     <p className="text-blue-100 text-sm mb-6">Alta performance e volume</p>
                     
                     <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-sm text-blue-200 font-medium">R$</span>
                        <span className="text-4xl font-bold text-white">99,90</span>
                        <span className="text-blue-200">/mês</span>
                     </div>

                     <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 rounded-full bg-white text-[#1a3add]"><Check size={14} strokeWidth={3} /></div>
                            <span className="font-bold">1000 Créditos</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                             <div className="p-1 rounded-full bg-white text-[#1a3add]"><Check size={14} strokeWidth={3} /></div>
                            <span><strong className="text-white">15 imagens</strong> por análise simultânea</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                             <div className="p-1 rounded-full bg-white text-[#1a3add]"><Check size={14} strokeWidth={3} /></div>
                            <span>Análise Detalhada de Funil</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                             <div className="p-1 rounded-full bg-white text-[#1a3add]"><Check size={14} strokeWidth={3} /></div>
                            <span>Prós, Contras e Plano de Ação Avançado</span>
                        </li>
                     </ul>

                     <a 
                        href="https://pay.kiwify.com.br/2d0JZvk" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full py-4 rounded-xl bg-white text-[#1a3add] font-bold text-center hover:bg-gray-50 transition-colors shadow-lg"
                     >
                        Assinar Plano PLUS
                     </a>
                </div>

            </div>
            
            <p className="text-center text-sm text-gray-400 mt-10">
              Pagamento seguro. Cancele quando quiser.
            </p>
        </div>
      </div>
    </div>
  );
};

export default CreditModal;