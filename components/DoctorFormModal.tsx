import React, { useState } from 'react';
import { DoctorProfile } from '../types';
import { X, User, Stethoscope, DollarSign, Phone, Mail, Users } from 'lucide-react';

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorProfile) => void;
  isLoading: boolean;
}

const DoctorFormModal: React.FC<DoctorFormModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<DoctorProfile>({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    consultationPrice: '',
    hasSecretary: true,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleSecretary = (val: boolean) => {
    setFormData(prev => ({ ...prev, hasSecretary: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-[#1a3add] to-[#152eb0] p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Configurar Análise</h2>
            <p className="text-blue-100 text-sm mt-1">Para uma IA mais precisa, precisamos conhecer você.</p>
          </div>
          {!isLoading && (
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <User size={14} /> Nome Completo
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a3add] focus:border-transparent outline-none transition-all"
                placeholder="Dr. João Silva"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Stethoscope size={14} /> Especialização
              </label>
              <input
                required
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a3add] focus:border-transparent outline-none transition-all"
                placeholder="Ex: Dermatologia"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Mail size={14} /> E-mail
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a3add] focus:border-transparent outline-none transition-all"
                placeholder="contato@clinica.com"
              />
            </div>
             <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Phone size={14} /> Telefone
              </label>
              <input
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a3add] focus:border-transparent outline-none transition-all"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <DollarSign size={14} /> Valor da Consulta (R$)
            </label>
            <input
              required
              name="consultationPrice"
              value={formData.consultationPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a3add] focus:border-transparent outline-none transition-all"
              placeholder="Ex: 450,00"
            />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Users size={14} /> Quem realiza o atendimento inicial?
              </label>
             <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleToggleSecretary(true)}
                  className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                    formData.hasSecretary
                      ? 'bg-[#1a3add]/10 border-[#1a3add] text-[#1a3add] shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Secretária / Equipe
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleSecretary(false)}
                  className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                    !formData.hasSecretary
                      ? 'bg-[#1a3add]/10 border-[#1a3add] text-[#1a3add] shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Eu mesmo (Médico)
                </button>
             </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-[#1a3add]/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                isLoading ? 'bg-[#1a3add]/70 cursor-wait' : 'bg-[#1a3add] hover:bg-[#152eb0]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando Conversas com IA...
                </span>
              ) : (
                'Iniciar Análise Avançada'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorFormModal;