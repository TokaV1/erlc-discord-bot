module.exports = {
  name: 'warn',
  execute(info: string) {
    console.warn('⚠️ Warning:', info);
  }
};
