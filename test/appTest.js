const helpers = require(`yeoman-test`);
const assert = require(`yeoman-assert`);
const path = require(`path`);

describe(`app:index`, function () {

    it(`arguments default`, function (done) {
 
       // Arrange
 
       let deps = [];
       let applicationName = `application_test`;
       let applicationTrigram = `ATS`;
       let operatingSystems = `windows`;
       let environmentsTargeted = `dev`;
 
       // Act
       return helpers.run(path.join(__dirname, `../app`))
          .withArguments([applicationName, applicationTrigram, operatingSystems,
            environmentsTargeted])
          .on(`error`, function (e) {
             assert.fail(e);
          })
          .on(`end`, done());    
    });
}); 