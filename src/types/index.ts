export interface GuildConfig {
  guildId: string;
  staffRoleId?: string;
  trainerRoleId?: string;
  moderatorRoleId?: string;
  seniorModRoleId?: string;
  adminRoleId?: string;
  managementRoleId?: string;
  logChannelId?: string;
  trainingChannelId?: string;
  applicationChannelId?: string;
  sessionChannelId?: string;
  ssuChannelId?: string;
  boloChannelId?: string;
  ticketCategoryId?: string;
  welcomeChannelId?: string;
  goodbyeChannelId?: string;
}

export interface CaseRecord {
  caseId: string;
  guildId: string;
  targetId: string;
  staffId: string;
  type: 'warning' | 'infraction' | 'promotion' | 'demotion' | 'training' | 'report' | 'commendation' | 'bolo';
  reason: string;
  additionalDetails?: string;
  createdAt: Date;
}

export interface InfractionRecord extends CaseRecord {
  punishment: 'Warning' | 'Kick' | 'SoftBan' | 'Ban' | 'Timeout';
  duration?: string;
}

export interface TrainingRecord {
  trainingId: string;
  guildId: string;
  traineeId: string;
  trainerId: string;
  resultStatus: 'Passed' | 'Failed' | 'Pending' | 'Needs Retraining';
  patrolPerformance: number;
  moderationAbility: number;
  grammarUsage: number;
  professionalism: number;
  sceneHandling: number;
  totalScore: number;
  averageScore: number;
  percentage: number;
  additionalNotes?: string;
  createdAt: Date;
}

export interface BOLORecord {
  boloId: string;
  guildId: string;
  subject: string;
  location: string;
  reason: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  removedBy?: string;
  removedAt?: Date;
  status: 'ACTIVE' | 'RESOLVED' | 'INACTIVE';
}

export interface TicketRecord {
  ticketId: string;
  guildId: string;
  userId: string;
  channelId: string;
  subject: string;
  status: 'open' | 'closed';
  createdAt: Date;
  closedAt?: Date;
  closedBy?: string;
}

export interface DMTemplate {
  templateId: string;
  guildId: string;
  type: string;
  content: string;
  variables: string[];
}

export interface PredefinedReason {
  reasonId: string;
  guildId: string;
  category: 'warning' | 'infraction' | 'promotion' | 'demotion';
  reason: string;
  enabled: boolean;
}
