import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Get information about the bot'),
  async execute(interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle('ℹ️ About ER:LC Discord Bot')
      .setDescription('A production-ready Discord bot built for ER:LC roleplay servers')
      .addFields(
        { name: 'Features', value: '✅ 75+ Slash Commands\n✅ Moderation & Logging\n✅ Staff Management\n✅ Training System\n✅ Ticket Support\n✅ Welcome/Goodbye\n✅ Application System', inline: false },
        { name: 'Developer', value: 'TokaV1', inline: true },
        { name: 'Version', value: '1.0.0', inline: true }
      )
      .setFooter({ text: 'Built with discord.js' })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  }
};
