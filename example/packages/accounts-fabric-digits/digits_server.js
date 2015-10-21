Digits = {};

var urls = {
  requestToken: "https://api.twitter.com/oauth/request_token",
  authorize: "https://api.twitter.com/oauth/authorize",
  accessToken: "https://api.twitter.com/oauth/access_token",
  authenticate: "https://api.twitter.com/oauth2/token"
};


// https://dev.twitter.com/docs/api/1.1/get/account/verify_credentials
Digits.whitelistedFields = ['profile_image_url', 'profile_image_url_https', 'lang'];

OAuth.registerService('digits', 1, urls, function(oauthBinding) {
  var identity = oauthBinding.get('https://api.twitter.com/1.1/account/verify_credentials.json').data;

  var serviceData = {
    id: identity.id_str,
    screenName: identity.screen_name,
    accessToken: OAuth.sealSecret(oauthBinding.accessToken),
    accessTokenSecret: OAuth.sealSecret(oauthBinding.accessTokenSecret)
  };

  // include helpful fields from twitter
  var fields = _.pick(identity, Digits.whitelistedFields);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {
      profile: {
        name: identity.name
      }
    }
  };
});


Digits.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
