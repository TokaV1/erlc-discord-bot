import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Make an announcement')
    .addStringOption(o => o.setName('message').setDescription('Announcement message').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const message = interaction.options.getString('message');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    
    const embed = new EmbedBuilder()
      .setColor('#F1C40F')
      .setTitle('📢 Announcement')
      .setDescription(message || 'No message provided')
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();
    
    await interaction.channel?.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Announcement sent!', ephemeral: true });
  }
};
