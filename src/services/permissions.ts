import { PermissionFlagsBits, ChannelType, EmbedBuilder } from 'discord.js';
import { db, getAsync, allAsync, runAsync } from '../utils/database';

export const PERMISSION_LEVELS = {
  OWNER: 6,
  MANAGEMENT: 5,
  ADMIN: 4,
  SENIOR_MOD: 3,
  MODERATOR: 2,
  TRAINER: 2,
  STAFF: 1,
  EVERYONE: 0
};

export async function checkPermission(guildId: string, userId: string, requiredLevel: number, roles: string[]): Promise<boolean> {
  if (userId === process.env.OWNER_ID) return true;
  
  const userRoles = roles;
  const config: any = await getAsync('SELECT * FROM guild_config WHERE guild_id = ?', [guildId]);
  
  if (!config) return false;
  
  if (config.management_role_id && userRoles.includes(config.management_role_id)) return requiredLevel <= PERMISSION_LEVELS.MANAGEMENT;
  if (config.admin_role_id && userRoles.includes(config.admin_role_id)) return requiredLevel <= PERMISSION_LEVELS.ADMIN;
  if (config.senior_mod_role_id && userRoles.includes(config.senior_mod_role_id)) return requiredLevel <= PERMISSION_LEVELS.SENIOR_MOD;
  if (config.moderator_role_id && userRoles.includes(config.moderator_role_id)) return requiredLevel <= PERMISSION_LEVELS.MODERATOR;
  if (config.staff_role_id && userRoles.includes(config.staff_role_id)) return requiredLevel <= PERMISSION_LEVELS.STAFF;
  
  return false;
}

export async function getPermissionLevel(guildId: string, userId: string, roles: string[]): Promise<number> {
  if (userId === process.env.OWNER_ID) return PERMISSION_LEVELS.OWNER;
  
  const config: any = await getAsync('SELECT * FROM guild_config WHERE guild_id = ?', [guildId]);
  if (!config) return PERMISSION_LEVELS.EVERYONE;
  
  if (config.management_role_id && roles.includes(config.management_role_id)) return PERMISSION_LEVELS.MANAGEMENT;
  if (config.admin_role_id && roles.includes(config.admin_role_id)) return PERMISSION_LEVELS.ADMIN;
  if (config.senior_mod_role_id && roles.includes(config.senior_mod_role_id)) return PERMISSION_LEVELS.SENIOR_MOD;
  if (config.moderator_role_id && roles.includes(config.moderator_role_id)) return PERMISSION_LEVELS.MODERATOR;
  if (config.trainer_role_id && roles.includes(config.trainer_role_id)) return PERMISSION_LEVELS.TRAINER;
  if (config.staff_role_id && roles.includes(config.staff_role_id)) return PERMISSION_LEVELS.STAFF;
  
  return PERMISSION_LEVELS.EVERYONE;
}
