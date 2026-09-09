import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get bot invite link'),
  async execute(interaction: CommandInteraction) {
    const clientId = interaction.client.user?.id;
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;
    
    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle('🔗 Invite Bot')
      .setDescription(`[Click here to invite the bot](${inviteUrl})`)
      .setFooter({ text: 'Make sure you have admin permissions!' })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
