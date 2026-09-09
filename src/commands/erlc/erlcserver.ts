import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { getERLCServer } from '../../services/erlc';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('erlcserver')
    .setDescription('Get ER:LC server information'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'erlcserver');

    if (!hasPerms) return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });

    await interaction.deferReply();
    const result = await getERLCServer();

    if (!result.success) {
      return interaction.editReply({ content: `❌ ${result.message}` });
    }

    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle('🖥️ ER:LC Server Information')
      .addFields(
        { name: 'Server Name', value: result.data?.serverName || 'N/A', inline: true },
        { name: 'Players', value: `${result.data?.playerCount || 0}/${result.data?.maxPlayers || 0}`, inline: true },
        { name: 'Queue', value: result.data?.queueCount?.toString() || '0', inline: true },
        { name: 'Status', value: result.data?.status || 'Unknown', inline: true }
      )
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
};
