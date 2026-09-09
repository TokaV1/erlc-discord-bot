import { nanoid } from 'nanoid';
import crypto from 'crypto';

export function generateCaseId(prefix: string): string {
  const counter = crypto.randomInt(1000, 9999);
  return `${prefix}-${counter}`;
}

export function generateWarningId(): string {
  return generateCaseId('WRN');
}

export function generateInfractionId(): string {
  return generateCaseId('INF');
}

export function generatePromotionId(): string {
  return generateCaseId('PRM');
}

export function generateDemotionId(): string {
  return generateCaseId('DMN');
}

export function generateTrainingId(): string {
  return generateCaseId('TRN');
}

export function generateReportId(): string {
  return generateCaseId('RPT');
}

export function generateCommendationId(): string {
  return generateCaseId('CMD');
}

export function generateBOLOId(): string {
  return generateCaseId('BOLO');
}

export function generateTicketId(): string {
  return `TKT-${nanoid(8).toUpperCase()}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function parseDuration(duration: string): number | null {
  const match = duration.match(/(\d+)([mhd])/);
  if (!match) return null;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 60 * 60 * 24;
    default: return null;
  }
}

export function validateTrainingScore(score: number): boolean {
  return Number.isInteger(score) && score >= 0 && score <= 10;
}

export function calculateTrainingScores(scores: { patrol: number; moderation: number; grammar: number; professionalism: number; scene: number }) {
  const total = scores.patrol + scores.moderation + scores.grammar + scores.professionalism + scores.scene;
  const average = total / 5;
  const percentage = (total / 50) * 100;
  
  return {
    total,
    average: Math.round(average * 10) / 10,
    percentage: Math.round(percentage * 10) / 10
  };
}

export function replaceDMVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value || 'N/A');
  });
  return result;
}
