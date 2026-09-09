import { db, runAsync, getAsync, allAsync } from '../utils/database';
import { formatDate, replaceDMVariables } from '../utils/helpers';

export async function getDMTemplate(guildId: string, templateType: string): Promise<any> {
  return await getAsync(
    'SELECT * FROM dm_templates WHERE guild_id = ? AND type = ?',
    [guildId, templateType]
  );
}

export async function setDMTemplate(guildId: string, templateType: string, content: string): Promise<void> {
  const id = `${guildId}-${templateType}`;
  await runAsync(
    'INSERT OR REPLACE INTO dm_templates (template_id, guild_id, type, content) VALUES (?, ?, ?, ?)',
    [id, guildId, templateType, content]
  );
}

export async function sendCustomDM(user: any, template: string, variables: Record<string, string>): Promise<boolean> {
  try {
    const message = replaceDMVariables(template, variables);
    await user.send(message);
    return true;
  } catch (error) {
    console.log('[DM] Unable to DM user:', user.id);
    return false;
  }
}

export const defaultDMTemplates = {
  warning: `⚠️ **WARNING NOTICE**

Hello {user},

You have received a warning in {server_name}.

**Reason:**
{reason}

**Additional Details:**
{additional_details}

**Issued By:** {staff_member}
**Case ID:** {case_id}
**Date:** {date}`,

  infraction: `📋 **PUNISHMENT NOTICE**

Hello {user},

You have received a punishment in {server_name}.

**Punishment:** {punishment}
**Reason:** {reason}
**Additional Details:** {additional_details}
**Issued By:** {staff_member}
**Case ID:** {case_id}
**Duration:** {duration}
**Date:** {date}`,

  promotion: `🎉 **PROMOTION NOTICE**

Congratulations {user}!

You have been promoted to:
{role}

**Reason:** {reason}
**Additional Notes:** {additional_notes}
**Promoted By:** {staff_member}
**Case ID:** {case_id}
**Date:** {date}`,

  demotion: `📋 **STAFF POSITION CHANGE**

Hello {user},

Your staff position in {server_name} has been changed.

**Position:** {role}
**Reason:** {reason}
**Additional Notes:** {additional_notes}
**Changed By:** {staff_member}
**Case ID:** {case_id}
**Date:** {date}`,

  training_passed: `🎓 **TRAINING RESULT**

Congratulations {user}!

You have successfully completed your training.

**Result:** ✅ PASSED
**Trainer:** {staff_member}
**Patrol Performance:** {patrol_performance}/10
**Moderation Ability:** {moderation_ability}/10
**Grammar Usage:** {grammar_usage}/10
**Professionalism:** {professionalism}/10
**Scene Handling:** {scene_handling}/10
**Total:** {total_score}/50
**Average:** {average_score}/10
**Percentage:** {percentage}%
**Additional Notes:** {additional_notes}
**Training ID:** {training_id}`,

  training_failed: `🎓 **TRAINING RESULT**

Hello {user},

Your training evaluation has been completed.

**Result:** ❌ FAILED
**Trainer:** {staff_member}
**Patrol Performance:** {patrol_performance}/10
**Moderation Ability:** {moderation_ability}/10
**Grammar Usage:** {grammar_usage}/10
**Professionalism:** {professionalism}/10
**Scene Handling:** {scene_handling}/10
**Total:** {total_score}/50
**Average:** {average_score}/10
**Percentage:** {percentage}%
**Additional Notes:** {additional_notes}
**Training ID:** {training_id}

Please contact your trainer or management if you have questions.`,

  application_accepted: `✅ **APPLICATION ACCEPTED**

Congratulations {user}!

Your application for {application_type} has been **ACCEPTED**.

**Reason:** {reason}
**Accepted By:** {staff_member}
**Date:** {date}`,

  application_denied: `❌ **APPLICATION DENIED**

Hello {user},

Unfortunately, your application for {application_type} has been **DENIED**.

**Reason:** {reason}
**Denied By:** {staff_member}
**Date:** {date}

You may reapply in the future.`
};
