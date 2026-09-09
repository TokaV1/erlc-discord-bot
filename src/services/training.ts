import { db, runAsync, getAsync, allAsync } from '../utils/database';
import { generateTrainingId, calculateTrainingScores } from '../utils/helpers';

export async function createTrainingRecord(
  guildId: string,
  traineeId: string,
  trainerId: string,
  resultStatus: string,
  scores: { patrol: number; moderation: number; grammar: number; professionalism: number; scene: number },
  additionalNotes?: string
): Promise<string> {
  const trainingId = generateTrainingId();
  const calc = calculateTrainingScores(scores);

  await runAsync(
    `INSERT INTO training_records 
    (training_id, guild_id, trainee_id, trainer_id, result_status, patrol_performance, moderation_ability, grammar_usage, professionalism, scene_handling, total_score, average_score, percentage, additional_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [trainingId, guildId, traineeId, trainerId, resultStatus, scores.patrol, scores.moderation, scores.grammar, scores.professionalism, scores.scene, calc.total, calc.average, calc.percentage, additionalNotes || null]
  );

  return trainingId;
}

export async function getTrainingRecord(trainingId: string): Promise<any> {
  return await getAsync('SELECT * FROM training_records WHERE training_id = ?', [trainingId]);
}

export async function getUserTrainingRecords(guildId: string, userId: string): Promise<any[]> {
  return await allAsync(
    'SELECT * FROM training_records WHERE guild_id = ? AND trainee_id = ? ORDER BY created_at DESC',
    [guildId, userId]
  );
}
