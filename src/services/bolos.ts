import { db, runAsync, getAsync, allAsync } from '../utils/database';
import { generateBOLOId, formatDate } from '../utils/helpers';

export async function createBOLO(guildId: string, subject: string, location: string, reason: string, createdBy: string): Promise<string> {
  const boloId = generateBOLOId();
  await runAsync(
    'INSERT INTO bolos (bolo_id, guild_id, subject, location, reason, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [boloId, guildId, subject, location, reason, createdBy, 'ACTIVE']
  );
  return boloId;
}

export async function getBOLO(boloId: string): Promise<any> {
  return await getAsync('SELECT * FROM bolos WHERE bolo_id = ?', [boloId]);
}

export async function getActiveBOLOs(guildId: string): Promise<any[]> {
  return await allAsync(
    'SELECT * FROM bolos WHERE guild_id = ? AND status = ? ORDER BY created_at DESC',
    [guildId, 'ACTIVE']
  );
}

export async function updateBOLO(boloId: string, subject?: string, location?: string, reason?: string, status?: string): Promise<void> {
  const updates = [];
  const params: any[] = [];

  if (subject) { updates.push('subject = ?'); params.push(subject); }
  if (location) { updates.push('location = ?'); params.push(location); }
  if (reason) { updates.push('reason = ?'); params.push(reason); }
  if (status) { updates.push('status = ?'); params.push(status); }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(boloId);

  if (updates.length > 1) {
    await runAsync(`UPDATE bolos SET ${updates.join(', ')} WHERE bolo_id = ?`, params);
  }
}

export async function removeBOLO(boloId: string, removedBy: string): Promise<void> {
  await runAsync(
    'UPDATE bolos SET status = ?, removed_by = ?, removed_at = CURRENT_TIMESTAMP WHERE bolo_id = ?',
    ['INACTIVE', removedBy, boloId]
  );
}
