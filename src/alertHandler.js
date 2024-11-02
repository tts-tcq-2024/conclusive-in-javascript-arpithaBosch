const { classifyTemperatureBreach } = require('./temperatureClassification');

// Checks for temperature breaches and sends alerts based on the specified target.
function checkAndAlert(alertTarget, batteryChar, temperatureInC) {
    const breachType = classifyTemperatureBreach(batteryChar.coolingType, temperatureInC);
    if (alertTarget === 'TO_CONTROLLER') {
        sendToController(breachType);
    } else if (alertTarget === 'TO_EMAIL') {
        sendToEmail(breachType);
    } else {
        console.warn(`Unknown alert target: ${alertTarget}. Defaulting to log.`);
        logAlert(breachType); // Log the alert as a fallback action
    }
}

// Sends the breach status to the controller.
function sendToController(breachType) {
    const header = 0xfeed;
    console.log(`${header}, ${breachType}`);
}

// Sends an email alert based on the breach type.
function sendToEmail(breachType) {
    const recipient = 'a.b@c.com';
    let message;
    // Constructing the message based on the breach type
    if (breachType === 'TOO_LOW') {
        message = 'Hi, the temperature is too low';
    } else if (breachType === 'TOO_HIGH') {
        message = 'Hi, the temperature is too high';
    } else {
        message = 'Hi, the temperature is normal'; // For completeness
    }
    console.log(`To: ${recipient}\n${message}`);
}

module.exports = {
    checkAndAlert
};
