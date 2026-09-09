import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View server statistics'),
  async execute(interaction: CommandInteraction) {
    const guild = interaction.guild;
    if (!guild) return;
    
    const members = guild.memberCount;
    const roles = guild.roles.cache.size;
    const channels = guild.channels.cache.size;
    const created = guild.createdAt;
    
    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle('📊 Server Statistics')
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: 'Server Name', value: guild.name, inline: true },
        { name: 'Members', value: members.toString(), inline: true },
        { name: 'Roles', value: roles.toString(), inline: true },
        { name: 'Channels', value: channels.toString(), inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(created.getTime() / 1000)}:R>`, inline: true }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  }
};
