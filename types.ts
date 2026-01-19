export interface DoctorProfile {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  consultationPrice: string;
  hasSecretary: boolean;
}

export interface StageAnalysis {
  stageName: string;
  score: number; // 0-100 normalized for chart, or raw points
  maxScore?: number;
  feedback: string;
  status: 'critical' | 'warning' | 'good' | 'excellent';
}

export interface AnalysisResult {
  overallScore: number;
  summary: string;
  stages: StageAnalysis[];
  strengths: string[];
  improvements: string[];
  toneAnalysis: string;
}

export interface FileWithPreview extends File {
  preview: string;
}

export type PlanType = 'free' | 'go' | 'plus';

export interface PlanConfig {
  name: string;
  maxImages: number;
  credits: number;
  price: string;
}