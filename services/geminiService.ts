import { GoogleGenAI, Type } from "@google/genai";
import { DoctorProfile, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeConversation = async (
  files: File[],
  profile: DoctorProfile
): Promise<AnalysisResult> => {
  try {
    const imageParts = await Promise.all(files.map(fileToGenerativePart));

    const prompt = `
      ATUE COMO: Um Auditor Sênior e Especialista em Vendas Médicas de Elite (High-Ticket Medical Sales). Você possui conhecimento enciclopédico sobre especialidades médicas, procedimentos, sintomas, patologias e o mercado de saúde atual (incluindo soluções concorrentes).

      SUA MISSÃO: Analisar CRITICAMENTE os prints de conversa de WhatsApp fornecidos. Não seja complacente. Sua função é encontrar gargalos invisíveis que estão custando faturamento ao médico.

      DADOS DO CLIENTE (MÉDICO/CLÍNICA):
      - Nome: ${profile.name}
      - Especialidade: ${profile.specialization}
      - Valor da Consulta: ${profile.consultationPrice}
      - Quem atende: ${profile.hasSecretary ? "Secretária/Equipe" : "O próprio médico"}

      DIRETRIZES DE ANÁLISE PROFUNDA E CRITÉRIOS:

      1. **Psicologia e Arquétipo do Paciente**:
         Identifique nos prints qual o perfil do paciente e se o atendente soube lidar:
         - *Investigativo*: Faz muitas perguntas técnicas, quer detalhes, cético. (Exige dados e lógica).
         - *Medroso/Inseguro*: Precisa de acolhimento excessivo e garantia de segurança. (Exige empatia).
         - *Orgulhoso/Dominante*: Quer estar no controle, desafia autoridade ou "testa" o médico. (Exige firmeza e autoridade).
         - *Prático/Apressado (Fast-track)*: Já conhece o problema, quer preço e hora. (Exige agilidade sem perder valor).
         > *Critique severamente se o atendimento usou script genérico ignorando o perfil do paciente.*

      2. **Autoridade Técnica (${profile.specialization}) e Mercado**:
         - O atendimento demonstrou domínio sobre os sintomas e procedimentos citados?
         - Houve conexão entre o sintoma do paciente e a solução única do médico?
         - Houve diferenciação clara frente às "soluções de mercado" comuns?

      3. **O Funil de Vendas (Checklist Rigoroso)**:
         - **Saudação & Acolhimento**: Rapidez e conexão emocional imediata.
         - **Entendimento da Queixa (Triagem)**: O atendente investigou a dor ANTES de falar de preço? (Erro fatal se não).
         - **Apresentação de Autoridade**: O médico foi vendido como a ÚNICA solução viável para aquele caso específico?
         - **Entrega de Valor e Preço**: O valor (benefício/transformação) foi ancorado antes do preço monetário?
         - **Quebra de Objeções**: Como lidou com "tá caro", silêncio ou comparação com convênio?
         - **Fechamento & Follow-up**: Houve comando de ação claro ("Vamos agendar para terça?") ou final passivo ("Qualquer coisa me avisa")?

      FORMATO DE SAÍDA (JSON):
      O 'overallScore' deve ser rigoroso (0 a 100). Notas acima de 80 apenas para atendimentos excepcionais.
      No campo 'summary', inicie identificando o **Perfil do Paciente** detectado e se a abordagem foi adequada.
      Seja ácido e direto nos 'feedbacks'. Aponte o erro e a correção técnica.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        role: "user",
        parts: [...imageParts, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "Nota geral rigorosa de 0 a 100" },
            summary: { type: Type.STRING, description: "Resumo executivo: Identifique o perfil do paciente (Investigativo, Medroso, etc) e a qualidade da abordagem." },
            toneAnalysis: { type: Type.STRING, description: "Análise do tom de voz (ex: 'Robótico e Frio', 'Empático e Assertivo', 'Passivo')." },
            stages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stageName: { type: Type.STRING },
                  score: { type: Type.INTEGER, description: "Nota de 0 a 10" },
                  feedback: { type: Type.STRING, description: "Crítica detalhada e sugestão de melhoria técnica para esta etapa." },
                  status: { type: Type.STRING, enum: ["critical", "warning", "good", "excellent"] }
                }
              }
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Pontos fortes reais (se houver)"
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Ações corretivas práticas e imediatas"
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("Falha ao gerar análise.");

  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    throw error;
  }
};