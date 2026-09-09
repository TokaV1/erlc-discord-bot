import { EmbedBuilder, User } from 'discord.js';
import { replaceDMVariables } from '../utils/helpers';
import { db, getAsync } from '../utils/database';

const DEFAULT_WARNING_DM = `⚠️ **WARNING NOTICE**

Hello {user},

You have received a warning in **{server_name}**.

**Reason:**
{reason}

**Additional Details:**
{additional_details}

**Issued By:**
{staff_member}

**Case ID:**
{case_id}

**Date:**
{date}

If you believe this warning was issued incorrectly, please contact server management.`;

const DEFAULT_INFRACTION_DM = `📋 **PUNISHMENT NOTICE**

Hello {user},

You have received a punishment in **{server_name}**.

**Punishment:**
{punishment}

**Reason:**
{reason}

**Additional Details:**
{additional_details}

**Issued By:**
{staff_member}

**Case ID:**
{case_id}

**Duration:**
{duration}

**Date:**
{date}

If you believe this punishment was issued incorrectly, please contact server management.`;

const DEFAULT_PROMOTION_DM = `🎉 **PROMOTION NOTICE**

Congratulations {user}!

You have been promoted to:

**{role}**

**Reason:**
{reason}

**Additional Notes:**
{additional_notes}

**Promoted By:**
{staff_member}

**Promotion ID:**
{case_id}

**Date:**
{date}

Thank you for your continued dedication.`;

const DEFAULT_DEMOTION_DM = `📋 **STAFF POSITION CHANGE**

Hello {user},

Your staff position in **{server_name}** has been changed.

**Position:**
{role}

**Reason:**
{reason}

**Additional Notes:**
{additional_notes}

**Changed By:**
{staff_member}

**Case ID:**
{case_id}

**Date:**
{date}

If you have questions regarding this decision, please contact server management.`;

export async function sendDM(user: User, content: string): Promise<boolean> {
  try {
    await user.send(content);
    return true;
  } catch (error) {
    console.log('Unable to DM user.');
    return false;
  }
}

export async function getDMTemplate(guildId: string, type: string): Promise<string> {
  try {
    const template: any = await getAsync(
      'SELECT content FROM dm_templates WHERE guild_id = ? AND type = ?',
      [guildId, type]
    );
    return template?.content || getDefaultTemplate(type);
  } catch (error) {
    return getDefaultTemplate(type);
  }
}

function getDefaultTemplate(type: string): string {
  switch (type) {
    case 'warning': return DEFAULT_WARNING_DM;
    case 'infraction': return DEFAULT_INFRACTION_DM;
    case 'promotion': return DEFAULT_PROMOTION_DM;
    case 'demotion': return DEFAULT_DEMOTION_DM;
    default: return '';
  }
}

export async function sendWarningDM(
  user: User,
  guildName: string,
  staffMember: string,
  reason: string,
  additionalDetails: string,
  caseId: string,
  date: string,
  templateContent?: string
): Promise<boolean> {
  const template = templateContent || DEFAULT_WARNING_DM;
  
  const message = replaceDMVariables(template, {
    user: user.username,
    username: user.username,
    server_name: guildName,
    guild: guildName,
    staff_member: staffMember,
    reason,
    additional_details: additionalDetails || 'None',
    case_id: caseId,
    date
  });
  
  return sendDM(user, message);
}

export async function sendInfractionDM(
  user: User,
  guildName: string,
  staffMember: string,
  punishment: string,
  reason: string,
  additionalDetails: string,
  duration: string,
  caseId: string,
  date: string,
  templateContent?: string
): Promise<boolean> {
  const template = templateContent || DEFAULT_INFRACTION_DM;
  
  const message = replaceDMVariables(template, {
    user: user.username,
    username: user.username,
    server_name: guildName,
    guild: guildName,
    staff_member: staffMember,
    punishment,
    reason,
    additional_details: additionalDetails || 'None',
    duration: duration || 'N/A',
    case_id: caseId,
    date
  });
  
  return sendDM(user, message);
}

export async function sendPromotionDM(
  user: User,
  staffMember: string,
  role: string,
  reason: string,
  additionalNotes: string,
  caseId: string,
  date: string,
  templateContent?: string
): Promise<boolean> {
  const template = templateContent || DEFAULT_PROMOTION_DM;
  
  const message = replaceDMVariables(template, {
    user: user.username,
    username: user.username,
    staff_member: staffMember,
    role,
    reason,
    additional_notes: additionalNotes || 'None',
    case_id: caseId,
    date
  });
  
  return sendDM(user, message);
}

export async function sendDemotionDM(
  user: User,
  guildName: string,
  staffMember: string,
  role: string,
  reason: string,
  additionalNotes: string,
  caseId: string,
  date: string,
  templateContent?: string
): Promise<boolean> {
  const template = templateContent || DEFAULT_DEMOTION_DM;
  
  const message = replaceDMVariables(template, {
    user: user.username,
    username: user.username,
    server_name: guildName,
    guild: guildName,
    staff_member: staffMember,
    role,
    reason,
    additional_notes: additionalNotes || 'None',
    case_id: caseId,
    date
  });
  
  return sendDM(user, message);
}
