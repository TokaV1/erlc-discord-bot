import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('goodbye')
    .setDescription('Send goodbye embed to channel'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'goodbye')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    
    const embed = new EmbedBuilder()
      .setColor('#D72638')
      .setTitle('👋 Goodbye!')
      .setDescription('A member of our community has departed. We hope they enjoyed their time here and wish them the best!\n\n**Thank you for being part of our community!**')
      .setFooter({ text: 'We hope to see you again soon!' })
      .setTimestamp();
    
    await interaction.channel?.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Goodbye embed sent!', ephemeral: true });
  }
};
