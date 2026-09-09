import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { createDemotion } from '../../services/cases';
import { sendCustomDM, getDMTemplate, defaultDMTemplates } from '../../services/dm';
import { formatDate } from '../../utils/helpers';

module.module.exports = {
  data: new SlashCommandBuilder().setName('demote').setDescription('Demote a staff member').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('role').setDescription('Previous role').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)).addStringOption(o => o.setName('additional_notes').setDescription('Additional notes').setRequired(false)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getString('role');
    const reason = interaction.options.getString('reason');
    const additionalNotes = interaction.options.getString('additional_notes');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'demote')) return interaction.reply({ content: '❌ Management+ required', ephemeral: true });
    const caseId = await createDemotion(interaction.guildId!, user!.id, interaction.user.id, role!, reason!, additionalNotes || undefined);
    const template = await getDMTemplate(interaction.guildId!, 'demotion') || defaultDMTemplates.demotion;
    await sendCustomDM(user, template, { user: user?.username || 'User', role: role || 'N/A', reason, additional_notes: additionalNotes || 'None', case_id: caseId, staff_member: interaction.user.username, server_name: interaction.guild?.name || 'Server', date: formatDate(new Date()) });
    const embed = new EmbedBuilder().setColor('#D72638').setTitle('📋 Demotion Issued').addFields({ name: 'User', value: `<@${user?.id}>`, inline: true }, { name: 'Role', value: role || 'N/A', inline: true }, { name: 'Case ID', value: caseId, inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
