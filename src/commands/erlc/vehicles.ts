import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vehicles')
    .setDescription('View available vehicles'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'vehicles');

    if (!hasPerms) return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle('🚗 Available Vehicles')
      .setDescription('Fetching vehicle data from ER:LC API...')
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};
