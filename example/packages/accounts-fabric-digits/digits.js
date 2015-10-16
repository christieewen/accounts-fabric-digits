Accounts.oauth.registerService('digits');

if (Meteor.isClient) {
  Meteor.loginWithDigits = function(options, callback) {
    // support a callback without options
    if (! callback && typeof options === "function") {
      callback = options;
      options = null;
    }
    
    var sdkScript = 'https://cdn.digits.com/1/sdk.js';
    DocHead.loadScript(sdkScript, function() {
    });

  // Digits do not require complexities of OAuth
  // Just add https://cdn.digits.com/1/sdk.js to login button
  // See: https://blog.twitter.com/2015/launching-digits-login-for-web
  // Cannonball seems to deal with OAuth so for the time being mirror all the other accounts-<services>
    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Digits.requestCredential(options, credentialRequestCompleteCallback);
  };
} else {
  var autopublishedFields = _.map(
    // don't send access token. https://dev.twitter.com/discussions/5025
    Twitter.whitelistedFields.concat(['id', 'screenName']),
    function (subfield) { return 'services.twitter.' + subfield; });

  Accounts.addAutopublishFields({
    forLoggedInUser: autopublishedFields,
    forOtherUsers: autopublishedFields
  });
}
