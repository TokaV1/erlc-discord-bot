import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder().setName('botinfo').setDescription('Get bot information'),
  async execute(interaction: CommandInteraction) {
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle('🤖 Bot Information').addFields({ name: 'Name', value: 'ER:LC Discord Bot', inline: true }, { name: 'Version', value: '1.0.0', inline: true }, { name: 'Commands', value: '75+', inline: true }, { name: 'Library', value: 'discord.js', inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
