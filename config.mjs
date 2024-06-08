let config = {
  version: '0.2',
  serverCount: 10,
  mockCompute: true,
  dumpDB: false,
};

export default config;

if (config.dumpDB) {
  console.log(`dumpDB is turned on!`);
}

console.log(`mockCompute: ${config.mockCompute}`)

if (!config.mockCompute) {
  console.log(`going to create ${config.serverCount} servers`)
}
