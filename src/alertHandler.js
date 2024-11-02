const { classifyTemperatureBreach } = require('./temperatureClassification');

// Checks for temperature breaches and sends alerts based on the specified target.
function checkAndAlert(alertTarget, batteryChar, temperatureInC) {
    const breachType = classifyTemperatureBreach(batteryChar.coolingType, temperatureInC);
    sendAlert(alertTarget, breachType);
}

// Sends an alert based on the target.
function sendAlert(alertTarget, breachType) {
    if (alertTarget === 'TO_CONTROLLER') {
        sendToController(breachType);
    } else if (alertTarget === 'TO_EMAIL') {
        sendToEmail(breachType);
    } else {
        throw new Error('Unknown alert target'); // Throw an error for unknown alert targets
    }
}

// Sends the breach status to the controller.
function sendToController(breachType) {
    const header = 0xfeed;
    console.log(`0x${header.toString(16)}, ${breachType}`);
}

// Sends an email alert based on the breach type.
function sendToEmail(breachType) {
    const recipient = 'a.b@c.com';
    const message = constructEmailMessage(breachType);
    console.log(`To: ${recipient}\n${message}`);
}

// Constructs the email message based on the breach type.
function constructEmailMessage(breachType) {
    switch (breachType) {
        case 'TOO_LOW':
            return 'Hi, the temperature is too low';
        case 'TOO_HIGH':
            return 'Hi, the temperature is too high';
        default:
            return 'Hi, the temperature is normal'; // For completeness
    }
}

module.exports = {
    checkAndAlert
};
