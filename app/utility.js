function reconcileValue(first, second, fallback) {

    return first ? first : (second ? second : fallback);
 
 }

/*
Get the list of Supported Operating Systems
*/
function getOperatingSystems() {
    return [
        {
            name : 'Windows',
            value : 'windows'
          },
          {
            name : 'Linux',
            value : 'linux'
          },
          {
            name : 'Aix',
            value : 'aix'
          },
          {
            name : 'Solaris',
            value : 'solaris'
          }
    ];
}

/*
Get the list of Supported Environments for inventories
*/
function getEnvironments() {
    "use strict";

    return [
        {
            name  : 'Sandbox',
            value : 'sbx',
            checked: true
        },
        {
            name  : 'Development',
            value : 'dev',
            checked: true
        },
        {
            name  : 'SIT',
            value : 'sit',
            checked: true
        },
        {
            name  : 'UAT',
            value : 'uat',
            checked: true
        },
        {
            name  : 'Pre-Production',
            value : 'ppr'
        },
        {
            name  : 'Production',
            value : 'prd'
        }
    ];
}


module.exports = {
    reconcileValue:      reconcileValue,
    getOperatingSystems: getOperatingSystems,
    getEnvironments:     getEnvironments
}