import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { createBOLO } from '../../services/bolos';

module.exports = {
  data: new SlashCommandBuilder().setName('bolo').setDescription('Create a BOLO').addStringOption(opt => opt.setName('subject').setDescription('Subject').setRequired(true)).addStringOption(opt => opt.setName('location').setDescription('Location').setRequired(true)).addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const subject = interaction.options.getString('subject');
    const location = interaction.options.getString('location');
    const reason = interaction.options.getString('reason');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'bolo')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const boloId = await createBOLO(interaction.guildId!, subject!, location!, reason!, interaction.user.id);
    const embed = new EmbedBuilder().setColor('#D72638').setTitle('🚨 BOLO Created').addFields({ name: 'BOLO ID', value: boloId, inline: true }, { name: 'Subject', value: subject || 'N/A', inline: true }, { name: 'Location', value: location || 'N/A', inline: true }, { name: 'Reason', value: reason || 'N/A', inline: false }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
