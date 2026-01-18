import { DoctorProfile } from "../types";

/**
 * URL do Web App do Google Apps Script.
 */
const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyG2ay0HJATZ-NDpQs3D3CHQJriM6t00ZDWvU18VVl-269i2gEP543i1sJPPmLT4KAY/exec"; 

// Chave para armazenar os emails no navegador
const STORAGE_KEY = 'task_analytics_ai_submitted_emails';

export const saveLeadToSheet = async (profile: DoctorProfile): Promise<void> => {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    console.warn("URL do Google Sheets não configurada em services/leadService.ts");
    return;
  }

  const emailNormalized = profile.email.trim().toLowerCase();

  // 1. Verifica se este email já foi enviado anteriormente neste navegador
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const submittedEmails: string[] = storedData ? JSON.parse(storedData) : [];

    if (submittedEmails.includes(emailNormalized)) {
      console.log(`Lead [${emailNormalized}] já enviado anteriormente. Pulando registro na planilha.`);
      return; // Interrompe a função aqui, não envia para o Sheets
    }
  } catch (e) {
    console.warn("Erro ao ler localStorage", e);
  }

  try {
    // 2. Envia para o Google Sheets
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    console.log("Dados enviados para o Google Sheets com sucesso.");

    // 3. Salva o email no localStorage para não enviar novamente no futuro
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      const submittedEmails: string[] = storedData ? JSON.parse(storedData) : [];
      
      // Adiciona apenas se não existir (redundância de segurança)
      if (!submittedEmails.includes(emailNormalized)) {
        submittedEmails.push(emailNormalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(submittedEmails));
      }
    } catch (e) {
      console.error("Erro ao salvar flag de envio localmente", e);
    }

  } catch (error) {
    console.error("Erro ao salvar lead no Google Sheets:", error);
  }
};