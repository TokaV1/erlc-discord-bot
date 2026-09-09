import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('baninfo')
    .setDescription('Get ban info for a player')
    .addStringOption(opt => opt.setName('user').setDescription('Username').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const username = interaction.options.getString('user');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'baninfo');

    if (!hasPerms) return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor('#D72638')
      .setTitle(`🔨 Ban Info - ${username}`)
      .setDescription('Fetching ban data...')
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};
