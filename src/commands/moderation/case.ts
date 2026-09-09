import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { getCaseById } from '../../services/cases';

module.exports = {
  data: new SlashCommandBuilder().setName('case').setDescription('View case information').addStringOption(o => o.setName('id').setDescription('Case ID').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const caseId = interaction.options.getString('id');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'case')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const caseRecord = await getCaseById(caseId!);
    if (!caseRecord) return interaction.reply({ content: '❌ Case not found', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle(`📋 Case ${caseId}`).addFields({ name: 'Type', value: caseRecord.type || 'N/A', inline: true }, { name: 'Target', value: `<@${caseRecord.target_id}>`, inline: true }, { name: 'Staff', value: `<@${caseRecord.staff_id}>`, inline: true }, { name: 'Reason', value: caseRecord.reason || 'N/A', inline: false }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
