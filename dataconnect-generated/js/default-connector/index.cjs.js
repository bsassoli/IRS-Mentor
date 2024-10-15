const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'logic-formula-builder',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

