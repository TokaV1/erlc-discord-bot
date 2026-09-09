module.exports = {
  name: 'error',
  execute(error: any) {
    console.error('❌ Client error:', error);
  }
};
