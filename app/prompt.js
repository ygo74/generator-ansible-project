/*
Get user inputs for arguments not pass through the comannd line
*/

var util = require('./utility');

function getApplicationName(generator) {
    return {
        type: 'input',
        name: 'applicationName',
        store: false,
        message: 'What is the name of the application ?',
        //validate: util.validateTFS,
        when: () => {
            return generator.options.applicationName === undefined;
        }
    };
}


function getApplicationTrigram(generator) {
    return {
        type: 'input',
        name: 'applicationTrigram',
        store: false,
        message: 'What is the trigram of your application?',
        //validate: util.validateTFS,
        when: () => {
            return generator.options.applicationTrigram === undefined;
        }
    };
}

function getOperatingSystems(generator) {
    return {
        type: 'checkbox',
        name: 'operatingSystems',
        store: true,
        message: 'What operating systems your application is deployed?',
        choices: util.getOperatingSystems(),
        when: answers => {
            // If the value was passed on the command line it will
            // not be set in answers which other prompts expect.
            // So, place it in answers now.
            // If you are reading from prompts don't overwrite
            // what the user entered.
            if (generator.options.operatingSystems !== undefined) {
               answers.operatingSystems = generator.options.operatingSystems;
            }
            return answers.operatingSystems === undefined;
   
         }
    };
}

function getEnvironments(generator) {
    return {
        type: 'checkbox',
        name: 'environmentsTargeted',
        store: true,
        message: 'On which environments the application will be deployed?',
        choices: util.getEnvironments(),
        when: answers => {
            // If the value was passed on the command line it will
            // not be set in answers which other prompts expect.
            // So, place it in answers now.
            // If you are reading from prompts don't overwrite
            // what the user entered.
            if (generator.options.environmentsTargeted !== undefined) {
               answers.environmentsTargeted = generator.options.environmentsTargeted;
            }
            return answers.environmentsTargeted === undefined;   
         }
    };
}


module.exports = {
    getApplicationName:    getApplicationName,
    getApplicationTrigram: getApplicationTrigram,
    getOperatingSystems:   getOperatingSystems,
    getEnvironments:       getEnvironments
};