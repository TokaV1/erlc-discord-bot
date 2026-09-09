import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('player')
    .setDescription('Get specific player info')
    .addStringOption(opt => opt.setName('user').setDescription('Username').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const username = interaction.options.getString('user');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'player');

    if (!hasPerms) return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle(`📋 Player Info - ${username}`)
      .setDescription('Fetching player data...')
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};
