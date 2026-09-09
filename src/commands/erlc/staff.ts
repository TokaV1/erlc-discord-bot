import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { getERLCStaff } from '../../services/erlc';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staff')
    .setDescription('List current ER:LC staff'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'staff');

    if (!hasPerms) return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });

    await interaction.deferReply();
    const result = await getERLCStaff();

    if (!result.success) {
      return interaction.editReply({ content: `❌ ${result.message}` });
    }

    const staff = result.data?.staff || [];
    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle(`👮 Current Staff (${staff.length})`)
      .setDescription(staff.length === 0 ? 'No staff online' : staff.map((s: any) => `${s.username} - ${s.permission}`).join('\n'))
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
};
