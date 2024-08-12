let config = {
  version: '0.2',
  serverCount: 10,
  mockCompute: true,
  dumpDB: false,
  debugImageRenderer: true,
};

export default config;

if (config.dumpDB) {
  console.log('dumpDB is turned on!');
}

console.log(`mockCompute: ${config.mockCompute}`);

if (!config.mockCompute) {
  console.log(`going to create ${config.serverCount} servers`);
}

if (config.debugImageRenderer) {
  console.log('Rendering image to file');
}
