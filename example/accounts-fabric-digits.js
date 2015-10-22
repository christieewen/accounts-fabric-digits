if (Meteor.isClient) {
  Template.signin.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
      Meteor.loginWithDigits({
        loginStyle: 'popup'
        //loginStyle: 'redirect'  you can use redirect for mobile web app
      }, function () {
        console.log('in call back', arguments);
      });
    },
    'click .digits-button': function(event, template) {
      event.preventDefault();
      var config = ServiceConfiguration.configurations.findOne({service: 'digits'});

      console.log("config config config");
      if (config)
        console.log(config.clientId);

      console.log('Digits login started.');
      //Digits.logIn().done(onLogin).fail(onLoginFailure);

      //Digits.logIn().done(Meteor.loginWithDigits).fail(Meteor.onLoginFailure); // Meteorizing the functions in promises
      //Digits.logIn().done(Meteor.call('loginWithDigits'));
      Digits.logIn().done(Meteor.call('onLogin'));
  }

  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    //Accounts.loginServiceConfiguration.remove({
     // service: 'digits'
    //});

    //Accounts.loginServiceConfiguration.insert({
     // service: 'digits',
     // clientId: 'CLIENT_ID',
     // secret: 'SECRET'
    //});
  });
}
