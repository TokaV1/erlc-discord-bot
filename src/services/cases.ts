import { db, runAsync } from '../utils/database';
import { formatDate } from '../utils/helpers';

export async function createCase(caseData: any): Promise<boolean> {
  const { caseId, guildId, targetId, staffId, type, reason, additionalDetails } = caseData;
  
  try {
    await runAsync(
      `INSERT INTO cases (case_id, guild_id, target_id, staff_id, type, reason, additional_details) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [caseId, guildId, targetId, staffId, type, reason, additionalDetails || null]
    );
    return true;
  } catch (error) {
    console.error('Error creating case:', error);
    return false;
  }
}

export async function createInfraction(infractionData: any): Promise<boolean> {
  const { caseId, guildId, targetId, staffId, punishment, reason, additionalDetails, duration } = infractionData;
  
  try {
    await runAsync(
      `INSERT INTO infractions (case_id, guild_id, target_id, staff_id, punishment, reason, additional_details, duration) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [caseId, guildId, targetId, staffId, punishment, reason, additionalDetails || null, duration || null]
    );
    
    await createCase({
      caseId,
      guildId,
      targetId,
      staffId,
      type: 'infraction',
      reason,
      additionalDetails
    });
    
    return true;
  } catch (error) {
    console.error('Error creating infraction:', error);
    return false;
  }
}

export async function createTrainingRecord(trainingData: any): Promise<boolean> {
  const {
    trainingId, guildId, traineeId, trainerId, resultStatus,
    patrolPerformance, moderationAbility, grammarUsage, professionalism, sceneHandling,
    totalScore, averageScore, percentage, additionalNotes
  } = trainingData;
  
  try {
    await runAsync(
      `INSERT INTO training_records 
       (training_id, guild_id, trainee_id, trainer_id, result_status, patrol_performance, 
        moderation_ability, grammar_usage, professionalism, scene_handling, total_score, 
        average_score, percentage, additional_notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [trainingId, guildId, traineeId, trainerId, resultStatus, patrolPerformance,
       moderationAbility, grammarUsage, professionalism, sceneHandling, totalScore,
       averageScore, percentage, additionalNotes || null]
    );
    
    await createCase({
      caseId: trainingId,
      guildId,
      targetId: traineeId,
      staffId: trainerId,
      type: 'training',
      reason: resultStatus,
      additionalDetails: additionalNotes
    });
    
    return true;
  } catch (error) {
    console.error('Error creating training record:', error);
    return false;
  }
}
