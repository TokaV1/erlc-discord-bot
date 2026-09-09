module.exports = {
  name: 'ready',
  once: true,
  execute(client: any) {
    console.log(`🤖 Bot Ready: ${client.user.tag}`);
  }
};
