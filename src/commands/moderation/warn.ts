import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { createInfraction } from '../../services/cases';
import { sendCustomDM, getDMTemplate, defaultDMTemplates } from '../../services/dm';
import { formatDate } from '../../utils/helpers';

module.exports = {
  data: new SlashCommandBuilder().setName('warn').setDescription('Warn a user').addUserOption(o => o.setName('user').setDescription('User to warn').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)).addStringOption(o => o.setName('additional_details').setDescription('Additional details').setRequired(false)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const additionalDetails = interaction.options.getString('additional_details');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'warn')) return interaction.reply({ content: '❌ Senior Mod+ required', ephemeral: true });
    if (reason.length < 5) return interaction.reply({ content: '❌ Reason must be at least 5 characters', ephemeral: true });
    const caseId = await createInfraction(interaction.guildId!, user!.id, interaction.user.id, 'Warning', reason, additionalDetails || undefined);
    const template = await getDMTemplate(interaction.guildId!, 'warning') || defaultDMTemplates.warning;
    await sendCustomDM(user, template, { user: user?.username || 'User', staff_member: interaction.user.username, reason, additional_details: additionalDetails || 'None', case_id: caseId, server_name: interaction.guild?.name || 'Server', date: formatDate(new Date()) });
    const embed = new EmbedBuilder().setColor('#F1C40F').setTitle('⚠️ Warning Issued').addFields({ name: 'User', value: `<@${user?.id}>`, inline: true }, { name: 'Reason', value: reason, inline: true }, { name: 'Case ID', value: caseId, inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
