import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { createInfraction } from '../../services/cases';
import { sendCustomDM, getDMTemplate, defaultDMTemplates } from '../../services/dm';
import { parseDuration, formatDate, validateTrainingScore } from '../../utils/helpers';

module.exports = {
  data: new SlashCommandBuilder().setName('infract').setDescription('Issue an infraction').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('punishment').setDescription('Punishment type').addChoices({ name: 'Warning', value: 'Warning' }, { name: 'Kick', value: 'Kick' }, { name: 'SoftBan', value: 'SoftBan' }, { name: 'Ban', value: 'Ban' }, { name: 'Timeout', value: 'Timeout' }).setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)).addStringOption(o => o.setName('additional_details').setDescription('Additional details').setRequired(false)).addStringOption(o => o.setName('duration').setDescription('Duration (for timeout)').setRequired(false)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const punishment = interaction.options.getString('punishment');
    const reason = interaction.options.getString('reason');
    const additionalDetails = interaction.options.getString('additional_details');
    const duration = interaction.options.getString('duration');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'infract')) return interaction.reply({ content: '❌ Senior Mod+ required', ephemeral: true });
    if (reason.length < 5 || reason.length > 500) return interaction.reply({ content: '❌ Reason must be 5-500 characters', ephemeral: true });
    if (punishment === 'Timeout' && !duration) return interaction.reply({ content: '❌ Duration required for timeout', ephemeral: true });
    const caseId = await createInfraction(interaction.guildId!, user!.id, interaction.user.id, punishment!, reason, additionalDetails || undefined, duration || undefined);
    if (punishment === 'Ban') await interaction.guild?.members.ban(user!.id, { reason });
    if (punishment === 'Kick') await interaction.guild?.members.kick(user!.id, reason);
    if (punishment === 'Timeout' && duration) {
      const seconds = parseDuration(duration);
      if (seconds) await interaction.guild?.members.cache.get(user!.id)?.timeout(seconds * 1000, reason);
    }
    const template = await getDMTemplate(interaction.guildId!, 'infraction') || defaultDMTemplates.infraction;
    await sendCustomDM(user, template, { user: user?.username || 'User', punishment: punishment || 'N/A', reason, additional_details: additionalDetails || 'None', duration: duration || 'N/A', case_id: caseId, staff_member: interaction.user.username, server_name: interaction.guild?.name || 'Server', date: formatDate(new Date()) });
    const embed = new EmbedBuilder().setColor('#D72638').setTitle('📋 Infraction Issued').addFields({ name: 'User', value: `<@${user?.id}>`, inline: true }, { name: 'Punishment', value: punishment || 'N/A', inline: true }, { name: 'Case ID', value: caseId, inline: true }, { name: 'Reason', value: reason, inline: false }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
