// Infers the breach status of a temperature value against specified limits.
function inferBreach(value, lowerLimit, upperLimit) {
    if (value < lowerLimit) return 'TOO_LOW';
    if (value > upperLimit) return 'TOO_HIGH';
    return 'NORMAL';
}

// Retrieves the temperature limits based on the cooling type.
function getTemperatureLimits(coolingType) {
    const limits = {
        'PASSIVE_COOLING': { lower: 0, upper: 35 },
        'HI_ACTIVE_COOLING': { lower: 0, upper: 45 },
        'MED_ACTIVE_COOLING': { lower: 0, upper: 40 },
    };
    if (!(coolingType in limits)) throw new Error('Unknown cooling type');
    return limits[coolingType];
}

// Classifies the breach of temperature based on cooling type and current temperature.
function classifyTemperatureBreach(coolingType, temperatureInC) {
    const { lower, upper } = getTemperatureLimits(coolingType);
    return inferBreach(temperatureInC, lower, upper);
}

module.exports = {
    classifyTemperatureBreach,
    getTemperatureLimits
};
