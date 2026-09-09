import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { getERLCBans } from '../../services/erlc';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bans')
    .setDescription('View ER:LC server bans'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'bans');

    if (!hasPerms) return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });

    await interaction.deferReply();
    const result = await getERLCBans();

    if (!result.success) {
      return interaction.editReply({ content: `❌ ${result.message}` });
    }

    const bans = result.data?.bans || [];
    const embed = new EmbedBuilder()
      .setColor('#D72638')
      .setTitle(`🔨 Active Bans (${bans.length})`)
      .setDescription(bans.length === 0 ? 'No active bans' : bans.map((b: any) => `${b.username} - ${b.reason}`).join('\n'))
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
};
