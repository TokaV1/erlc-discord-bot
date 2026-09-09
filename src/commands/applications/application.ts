import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('application').setDescription('View specific application').addStringOption(o => o.setName('id').setDescription('Application ID').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const id = interaction.options.getString('id');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'application')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle(`📋 Application ${id}`).setDescription('Fetching application...').setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
