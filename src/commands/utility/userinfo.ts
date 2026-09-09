import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get user information')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(false)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild?.members.fetch(user.id);
    
    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle(`👤 User Info - ${user.username}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'Username', value: user.username, inline: true },
        { name: 'User ID', value: user.id, inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Joined Server', value: member?.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>` : 'Unknown', inline: true },
        { name: 'Roles', value: member?.roles.cache.map(r => r.toString()).join(', ') || 'None', inline: false }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  }
};
