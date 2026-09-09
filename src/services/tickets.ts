import { db, runAsync, getAsync, allAsync } from '../utils/database';
import { generateTicketId } from '../utils/helpers';

export async function createTicket(guildId: string, userId: string, channelId: string, subject: string): Promise<string> {
  const ticketId = generateTicketId();
  await runAsync(
    'INSERT INTO tickets (ticket_id, guild_id, user_id, channel_id, subject, status) VALUES (?, ?, ?, ?, ?, ?)',
    [ticketId, guildId, userId, channelId, subject, 'open']
  );
  return ticketId;
}

export async function closeTicket(ticketId: string, closedBy: string): Promise<void> {
  await runAsync(
    'UPDATE tickets SET status = ?, closed_at = CURRENT_TIMESTAMP, closed_by = ? WHERE ticket_id = ?',
    ['closed', closedBy, ticketId]
  );
}

export async function getTicket(ticketId: string): Promise<any> {
  return await getAsync('SELECT * FROM tickets WHERE ticket_id = ?', [ticketId]);
}

export async function getGuildTickets(guildId: string, status: string = 'open'): Promise<any[]> {
  return await allAsync(
    'SELECT * FROM tickets WHERE guild_id = ? AND status = ? ORDER BY created_at DESC',
    [guildId, status]
  );
}
