import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { createTicket } from '../../services/tickets';
import { generateTicketId } from '../../utils/helpers';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Create a support ticket'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'ticket')) return interaction.reply({ content: '✅ Ticket feature available to everyone', ephemeral: false });
    
    const ticketCategoryId = process.env.TICKET_CATEGORY_ID;
    if (!ticketCategoryId) return interaction.reply({ content: '❌ Ticket category not configured', ephemeral: true });
    
    const guild = interaction.guild;
    if (!guild) return;
    
    const ticketId = generateTicketId();
    const channel = await guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: ticketCategoryId,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ['ViewChannel'],
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
        },
      ],
    });
    
    await createTicket(guild.id, interaction.user.id, channel.id, 'Support Request');
    
    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle(`🎟️ Ticket #${ticketId}`)
      .setDescription(`Welcome ${interaction.user.toString()}! Please describe your issue.`)
      .addFields(
        { name: 'Ticket ID', value: ticketId, inline: true },
        { name: 'Status', value: 'Open', inline: true }
      )
      .setTimestamp();
    
    const closeButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Close Ticket')
      .setStyle(ButtonStyle.Danger);
    
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton);
    
    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ Ticket created: ${channel.toString()}`, ephemeral: true });
  }
};
