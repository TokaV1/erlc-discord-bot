import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-close')
    .setDescription('Close a ticket'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'ticket-close')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    
    const channel = interaction.channel as any;
    if (!channel?.name.startsWith('ticket-')) return interaction.reply({ content: '❌ This is not a ticket channel', ephemeral: true });
    
    const embed = new EmbedBuilder()
      .setColor('#D72638')
      .setTitle('🎟️ Ticket Closed')
      .setDescription('This ticket has been closed.')
      .setTimestamp();
    
    await channel.send({ embeds: [embed] });
    await channel.delete();
  }
};
