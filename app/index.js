// This is the main entry point of the generator.  The heavy lifting is done in the
// sub generators.  I separated them so I could compose with language generators.
//const url = require('url');
const yosay     = require('yosay');
const mkdirp    = require('mkdirp');
const util      = require('./utility');
const prompts   = require('./prompt');
const Generator = require('yeoman-generator');

function readArguments(generator) {

   // Order is important
   // These are position based arguments for this generator. If they are not provided
   // via the command line they will be queried during the prompting priority
   generator.argument('applicationName', { type: String, required: false, desc: 'the name of the application' });
   generator.argument('applicationTrigram', { type: String, required: false, desc: 'the trigram of the application' });
   generator.argument('operatingSystems', { type: Array, required: false, desc: 'List of operating system target for your application' });
   generator.argument('environmentsTargeted', { type: Array, required: false, desc: 'List of operating system target for your application' });
}


module.exports = class extends Generator {
    // note: arguments and options should be defined in the constructor.
    constructor(args, opts) {
      super(args, opts);
  
      // Read Arguments
      readArguments(this);
      
    }

    initializing() {
        this.log(yosay('Welcome to ALM ansible generator'));
    }

    //Prompt users
    prompting() {
        let cmdLnInput = this;

        return this.prompt([
            prompts.getApplicationName(this),
            prompts.getApplicationTrigram(this),
            prompts.getEnvironments(this),
            prompts.getOperatingSystems(this)
        ]).then(function (a) {
            // Transfer answers to global object for use in the rest of the generator
            this.applicationName        = util.reconcileValue(cmdLnInput.options.applicationName,      a.applicationName).toLowerCase();
            this.applicationTrigram     = util.reconcileValue(cmdLnInput.options.applicationTrigram,   a.applicationTrigram).toUpperCase();
            this.operatingSystems       = util.reconcileValue(cmdLnInput.options.operatingSystems,     a.operatingSystems);
            this.environmentsTargeted   = util.reconcileValue(cmdLnInput.options.environmentsTargeted, a.environmentsTargeted);

        }.bind(this));                   
    }


    configuring() {
        this.log(this.applicationName);
    }

    writing() {
        this.log("Ansible generate content for : ", this.applicationName);
        this.log("Target Operating Systems : ", this.operatingSystems[0]);

        var tokens = {
            application_name:    this.applicationName,
            application_trigram: this.applicationTrigram,
            operating_systems:   this.operatingSystems
        };


        var destinationPath =  this.destinationPath(this.applicationName);   

        //Create the ansible structure folder
        mkdirp.sync(this.destinationPath(destinationPath));
        mkdirp.sync(this.destinationPath(`${destinationPath}/roles`));
        mkdirp.sync(this.destinationPath(`${destinationPath}/library`));
        mkdirp.sync(this.destinationPath(`${destinationPath}/module_utils`));
        mkdirp.sync(this.destinationPath(`${destinationPath}/filter_plugins`));

        //Create the ansible inventories structure.
        mkdirp.sync(this.destinationPath(`${destinationPath}/inventories`));
        this.environmentsTargeted.forEach((env) => {
            mkdirp.sync(this.destinationPath(`${destinationPath}/inventories/${env}`));
            mkdirp.sync(this.destinationPath(`${destinationPath}/inventories/${env}/group_vars`));
         });

        //Create the playbook vars.
        mkdirp.sync(this.destinationPath(`${destinationPath}/group_vars`));

        //Create custom ansible structure folder.
        //Should be removed and migrated into group_vars
        mkdirp.sync(this.destinationPath(`${destinationPath}/_consistency`));
        mkdirp.sync(this.destinationPath(`${destinationPath}/tools`));


        //Create files
        this.fs.copyTpl(this.templatePath("README.md"), 
                        `${destinationPath}/README.md`, tokens);

        //Create consistency files
        this.fs.copyTpl(this.templatePath("_consistency/applications.yml"), 
                        `${destinationPath}/_consistency/applications.yml`, tokens);
        this.fs.copyTpl(this.templatePath("_consistency/job_templates_default.yml"), 
                        `${destinationPath}/_consistency/job_templates_default.yml`, tokens);

        //Group_vars files
        this.fs.copyTpl(this.templatePath("group_vars/application.yml"), 
                        `${destinationPath}/group_vars/${this.applicationName}.yml`, tokens);

        //Inventories files                        
        this.environmentsTargeted.forEach((env) => {
            var environment_tokens = Object.assign(tokens, {
                application_inventory: env
            });

            this.fs.copyTpl(this.templatePath("inventories/hosts"), 
                            `${destinationPath}/inventories/${env}/hosts`,
                             environment_tokens);

            this.fs.copyTpl(this.templatePath("inventories/group_vars/application.yml"), 
                            `${destinationPath}/inventories/${env}/group_vars/${this.applicationName}.yml`,
                            environment_tokens);
 
        });
    }
  };