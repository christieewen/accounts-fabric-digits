Accounts.oauth.registerService('digits');

if (Meteor.isClient) {

// Nov 2, 2015: Load this after we get the consumer key.
/*
  (function(){
    var sdkScript = 'https://cdn.digits.com/1/sdk.js';
    DocHead.loadScript(sdkScript, function() {
      // Digits need to be initialized when the sdk is loaded and we get the consumer key 

    });
  });
*/

  Meteor.startup(function () {
    //var sdkScript = 'https://cdn.digits.com/1/sdk.js';
    //DocHead.loadScript(sdkScript, function() {
      // Digits can not be initialized here because we don't know the consumer key yet.
    //});
  });

  Meteor.loginWithDigits = function(options, callback) {
    // support a callback without options
    if (! callback && typeof options === "function") {
      callback = options;
      options = null;
    }

  // Digits do not require complexities of OAuth
  // Just add https://cdn.digits.com/1/sdk.js to login button
  // See: https://blog.twitter.com/2015/launching-digits-login-for-web
  // Cannonball seems to deal with OAuth so for the time being mirror all the other accounts-<services>
  var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
  
  FabricDigits.requestCredential(options, credentialRequestCompleteCallback);

/*
    var config = ServiceConfiguration.configurations.findOne({service: 'digits'});
    if (!config) {
      credentialRequestCompleteCallback && credentialRequestCompleteCallback(
        new ServiceConfiguration.ConfigError());
      return;
    }
*/
//    $('#digits-sdk').load(function () {
/*
       Digits.init({ consumerKey: config.clientId })
      .done(function() {
        console.log('Digits initialized.');
      })
      .fail(function() {
        console.log('Digits failed to initialize.');
      });
*/
      //Digits.logIn().done(Meteor.call('onLogin', function() { console.log("success!");})).fail(function() {
      //  console.log('Digits failed onLogin.');
      //});

      //Digits.logIn()
      //.done(onLogin) /*handle the response*/
      //.fail(onLoginFailure);

 //   });
    
    //console.log (credentialRequestCompleteCallback);
  };
} else {
  // Digits might not need this
  //var autopublishedFields = _.map(
    // don't send access token. https://dev.twitter.com/discussions/5025
   // Digits.whitelistedFields.concat(['id', 'screenName']),
   // function (subfield) { return 'services.digits.' + subfield; });
  Accounts.addAutopublishFields({
    //forLoggedInUser: autopublishedFields,
    forLoggedInUser: ['services.digits']
    //,forOtherUsers: autopublishedFields
  });
}
