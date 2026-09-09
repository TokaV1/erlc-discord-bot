import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { getERLCPlayers } from '../../services/erlc';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('List current ER:LC players'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'players');

    if (!hasPerms) return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });

    await interaction.deferReply();
    const result = await getERLCPlayers();

    if (!result.success) {
      return interaction.editReply({ content: `❌ ${result.message}` });
    }

    const players = result.data?.players || [];
    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle(`👥 Current Players (${players.length})`)
      .setDescription(players.length === 0 ? 'No players online' : players.map((p: any) => `${p.username} - ${p.team}`).join('\n'))
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
};
