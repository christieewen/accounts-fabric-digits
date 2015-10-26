Accounts.oauth.registerService('digits');

if (Meteor.isClient) {
  Meteor.startup(function () {
    var sdkScript = 'https://cdn.digits.com/1/sdk.js';
    DocHead.loadScript(sdkScript, function() {
      // Digtis can not be initialized here because we don't know the consumer key yet.
    });
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
    Digits.init({ consumerKey: 'EzunSXlVYw4rB04SB9VSop0tV' });

    FabricDigits.requestCredential(options, credentialRequestCompleteCallback);
    console.log (credentialRequestCompleteCallback);
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
