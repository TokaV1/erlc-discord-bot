import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { getERLCQueue } from '../../services/erlc';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View ER:LC server queue'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'queue');

    if (!hasPerms) return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });

    await interaction.deferReply();
    const result = await getERLCQueue();

    if (!result.success) {
      return interaction.editReply({ content: `❌ ${result.message}` });
    }

    const queue = result.data?.queue || [];
    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle(`⏳ Server Queue (${queue.length})`)
      .setDescription(queue.length === 0 ? 'Queue is empty' : queue.map((q: any, i: number) => `${i + 1}. ${q.username}`).join('\n'))
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
};
