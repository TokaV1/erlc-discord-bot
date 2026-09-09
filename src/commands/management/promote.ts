import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { createPromotion } from '../../services/cases';
import { sendCustomDM, getDMTemplate, defaultDMTemplates } from '../../services/dm';
import { formatDate } from '../../utils/helpers';

module.exports = {
  data: new SlashCommandBuilder().setName('promote').setDescription('Promote a staff member').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('role').setDescription('New role').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)).addStringOption(o => o.setName('additional_notes').setDescription('Additional notes').setRequired(false)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getString('role');
    const reason = interaction.options.getString('reason');
    const additionalNotes = interaction.options.getString('additional_notes');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'promote')) return interaction.reply({ content: '❌ Management+ required', ephemeral: true });
    const caseId = await createPromotion(interaction.guildId!, user!.id, interaction.user.id, role!, reason!, additionalNotes || undefined);
    const template = await getDMTemplate(interaction.guildId!, 'promotion') || defaultDMTemplates.promotion;
    await sendCustomDM(user, template, { user: user?.username || 'User', role: role || 'N/A', reason, additional_notes: additionalNotes || 'None', case_id: caseId, staff_member: interaction.user.username, date: formatDate(new Date()) });
    const embed = new EmbedBuilder().setColor('#2ECC71').setTitle('🎉 Promotion Issued').addFields({ name: 'User', value: `<@${user?.id}>`, inline: true }, { name: 'Role', value: role || 'N/A', inline: true }, { name: 'Case ID', value: caseId, inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
