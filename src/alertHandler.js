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
    console.log(`${header}, ${breachType}`);
}

// Sends an email alert based on the breach type.
function sendToEmail(breachType) {
    const recipient = 'a.b@c.com';
    const message = constructEmailMessage(breachType);
    console.log(`To: ${recipient}\n${message}`);
}

// Constructs the email message based on the breach type.
function constructEmailMessage(breachType) {
    const messages = {
        'TOO_LOW': 'Hi, the temperature is too low',
        'TOO_HIGH': 'Hi, the temperature is too high',
        'NORMAL': 'Hi, the temperature is normal' // default message
    };

    return messages[breachType] || 'Hi, the temperature status is unknown'; // Fallback message
}

module.exports = {
    checkAndAlert
};
