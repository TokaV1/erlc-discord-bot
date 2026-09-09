module.exports = {
  name: 'interactionCreate',
  async execute(interaction: any, client: any) {
    if (!interaction.isButton()) return;
    
    if (interaction.customId === 'close_ticket') {
      const channel = interaction.channel as any;
      if (!channel.name.startsWith('ticket-')) return;
      
      await interaction.reply({ content: '🎟️ Closing ticket...', ephemeral: true });
      await new Promise(r => setTimeout(r, 2000));
      await channel.delete();
    }
  }
};
