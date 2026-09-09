import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Send welcome embed to channel'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'welcome')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    
    const embed = new EmbedBuilder()
      .setColor('#2ECC71')
      .setTitle('👋 Welcome to ' + interaction.guild?.name + '!')
      .setDescription('We\'re excited to have you here! Please read the rules and guidelines before participating.\n\n**Getting Started:**\n• Check out #announcements for updates\n• Read #rules and #guidelines\n• Introduce yourself in #introductions\n• Have fun and be respectful!')
      .setThumbnail(interaction.guild?.iconURL() || null)
      .setFooter({ text: 'Welcome to our community!' })
      .setTimestamp();
    
    await interaction.channel?.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Welcome embed sent!', ephemeral: true });
  }
};
