const { classifyTemperatureBreach, getTemperatureLimits } = require('./temperatureClassification');
const { checkAndAlert } = require('./alertHandler');

module.exports = {
    classifyTemperatureBreach,
    checkAndAlert,
    getTemperatureLimits,
};
