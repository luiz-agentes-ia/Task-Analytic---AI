import React, { useState, useEffect } from 'react';
import { AnalysisResult, DoctorProfile } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  CheckCircle, AlertTriangle, XCircle, TrendingUp, ShieldCheck, 
  MessageCircle, Target, Award, ChevronRight, Stethoscope, Download, Printer
} from 'lucide-react';

interface DashboardProps {
  result: AnalysisResult;
  profile: DoctorProfile;
  onReset: () => void;
}

const COLORS = {
  critical: '#ef4444',
  warning: '#f59e0b',
  good: '#3b82f6',
  excellent: '#10b981',
};

const Dashboard: React.FC<DashboardProps> = ({ result, profile, onReset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'action_plan'>('overview');
  const [isPrinting, setIsPrinting] = useState(false);

  // Hook para gerenciar o ciclo de vida da impressão
  useEffect(() => {
    if (isPrinting) {
      // Pequeno delay para garantir que o React renderizou todas as seções (especialmente gráficos)
      const timer = setTimeout(() => {
        window.print();
        setIsPrinting(false);
      }, 800); 
      return () => clearTimeout(timer);
    }
  }, [isPrinting]);

  const handlePrint = () => {
    setIsPrinting(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const chartData = result.stages.map(stage => ({
    name: stage.stageName.split(' ')[0], // Shorten name
    fullName: stage.stageName,
    score: stage.score,
    status: stage.status
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 print:border-none">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1a3add]/10 text-[#1a3add] text-xs font-semibold tracking-wide uppercase">
              Relatório Comercial
            </span>
            <span className="text-gray-400 text-sm">• {new Date().toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Análise de Performance</h1>
          <p className="text-gray-500">Dr(a). {profile.name} — {profile.specialization}</p>
        </div>
        <div className="flex gap-3 no-print">
           <button 
            onClick={handlePrint}
            disabled={isPrinting}
            className={`px-5 py-2.5 bg-[#1a3add] text-white rounded-lg hover:bg-[#152eb0] font-medium transition-colors shadow-sm flex items-center gap-2 ${isPrinting ? 'opacity-75 cursor-wait' : ''}`}
          >
            {isPrinting ? (
              <>Gerando PDF...</>
            ) : (
              <><Download size={18} /> Baixar PDF</>
            )}
          </button>
          <button 
            onClick={onReset}
            disabled={isPrinting}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
          >
            Nova Análise
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Score */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative break-inside-avoid">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-[#1a3add] rounded-t-2xl"></div>
          <h3 className="text-gray-500 font-medium mb-4 uppercase tracking-wider text-xs">Score Global</h3>
          <div className="relative flex justify-center items-center p-2">
            <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
              <circle
                className="text-gray-100"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="90" 
                cy="90"
              />
              <circle
                className={getScoreColor(result.overallScore)}
                strokeWidth="12"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * result.overallScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="90"
                cy="90"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}
              </span>
              <span className="text-gray-400 text-sm">de 100</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 font-medium px-4">
            {result.overallScore >= 80 ? "Processo comercial de alta performance!" : 
             result.overallScore >= 60 ? "Bom processo, mas com gargalos claros." : 
             "Processo precisa de revisão urgente."}
          </p>
        </div>

        {/* Tone Analysis */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 col-span-1 md:col-span-2 flex flex-col break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
             <MessageCircle className="text-[#1a3add]" size={20} />
             <h3 className="font-bold text-gray-900">Resumo da Análise & Tom de Voz</h3>
          </div>
          <div className="prose prose-sm text-gray-600 max-w-none flex-grow bg-slate-50 p-4 rounded-xl border border-slate-100">
             <p className="mb-2 italic">"{result.toneAnalysis}"</p>
             <hr className="border-gray-200 my-3"/>
             <p>{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Oculto na impressão */}
      <div className="border-b border-gray-200 no-print">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['overview', 'breakdown', 'action_plan'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab 
                  ? 'border-[#1a3add] text-[#1a3add]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab === 'overview' && 'Visão Geral Gráfica'}
              {tab === 'breakdown' && 'Detalhamento por Etapa'}
              {tab === 'action_plan' && 'Plano de Ação'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="min-h-[400px]">
        
        {/* Chart Section - Visível se activeTab='overview' OU se estiver imprimindo */}
        {(activeTab === 'overview' || isPrinting) && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 w-full mb-8 break-inside-avoid print:block">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-gray-400" />
              Performance por Etapa do Funil
            </h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 10]} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Breakdown Section - Visível se activeTab='breakdown' OU se estiver imprimindo */}
        {(activeTab === 'breakdown' || isPrinting) && (
          <div className="space-y-4 mb-8">
            {isPrinting && <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8 pb-2 border-b">Detalhamento Técnico</h3>}
            <div className="grid gap-4">
              {result.stages.map((stage, idx) => (
                <div 
                  key={idx} 
                  className={`
                    bg-white rounded-xl p-5 border-l-4 shadow-sm break-inside-avoid
                    ${stage.status === 'critical' ? 'border-l-red-500' : 
                      stage.status === 'warning' ? 'border-l-amber-500' :
                      stage.status === 'good' ? 'border-l-blue-500' : 'border-l-emerald-500'}
                  `}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        stage.status === 'critical' ? 'bg-red-100 text-red-600' : 
                        stage.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                        stage.status === 'good' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {stage.status === 'critical' && <XCircle size={20} />}
                        {stage.status === 'warning' && <AlertTriangle size={20} />}
                        {stage.status === 'good' && <Target size={20} />}
                        {stage.status === 'excellent' && <CheckCircle size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{stage.stageName}</h4>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Status: {stage.status === 'good' ? 'Bom' : stage.status === 'excellent' ? 'Excelente' : stage.status === 'warning' ? 'Atenção' : 'Crítico'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-gray-900">{stage.score}<span className="text-sm text-gray-400 font-normal">/10</span></span>
                    </div>
                  </div>
                  <p className="text-gray-600 ml-14 leading-relaxed">{stage.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Plan Section - Visível se activeTab='action_plan' OU se estiver imprimindo */}
        {(activeTab === 'action_plan' || isPrinting) && (
          <div className="mb-8">
            {isPrinting && <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8 pb-2 border-b">Plano de Ação</h3>}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden break-inside-avoid">
                <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-2">
                  <Award className="text-emerald-600" size={20} />
                  <h3 className="font-bold text-emerald-900">Pontos Fortes</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {result.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden break-inside-avoid">
                <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-2">
                  <Stethoscope className="text-amber-600" size={20} />
                  <h3 className="font-bold text-amber-900">Oportunidades de Melhoria</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {result.improvements.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <ChevronRight className="text-amber-500 mt-1 flex-shrink-0" size={16} />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;