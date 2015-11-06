FabricDigits = {};

var urls = {
  requestToken: "https://api.twitter.com/oauth/request_token",
  authorize: "https://api.twitter.com/oauth/authorize",
  accessToken: "https://api.twitter.com/oauth/access_token",
  authenticate: "https://api.twitter.com/oauth2/token"
};


// https://dev.twitter.com/docs/api/1.1/get/account/verify_credentials
//Digits.whitelistedFields = ['profile_image_url', 'profile_image_url_https', 'lang'];

OAuth.registerService('digits', 1, null, function(query) {
//OAuth.registerService('digits', 1, urls, function(oauthBinding) {
  var response = getTokenResponse(query);
  var accessToken = response.access_token;
  var identity = response.user; 


console.log("response.access_token: ");
console.log(response.access_token);
/*
  var serviceData = {
    id: identity.id_str,
    screenName: identity.screen_name,
    accessToken: OAuth.sealSecret(oauthBinding.accessToken),
    accessTokenSecret: OAuth.sealSecret(oauthBinding.accessTokenSecret)
  };
  */
  var serviceData = _.extend(identity, {accessToken: response.access_token});

  // include helpful fields from twitter
  //var fields = _.pick(identity, Digits.whitelistedFields);
  //_.extend(serviceData, fie
  return {
    serviceData: serviceData,
    profile: {
        name: identity.id_str, // userID
        service: { digits: identity},
        phoneNumber: identity.phone_number
      }
    };
});

var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'digits'});

  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var credentials = 'oauth_consumer_key="' + config.clientId + '"';

  console.log("config.clientId: ");
  console.log(credentials);

  var options = {
//    url: urls, // not sure about this one
    headers: {
      'Authorization': credentials
    }
  };

  var response;
  try {
      response = HTTP.post(
      "https://api.digits.com/1.1/",
      //"https://api.twitter.com/oauth/access_token",
      {
        params: {
          Authorization: 'OAuth',
          oauth_consumer_key: config.clientId,
          oauth_signature_method: 'HMAC-SHA1',
          oauth_token: OAuth.openSecret(config.secret),
          oauth_version: '1.0'
          /*
          code: query.code,
          client_id: config.clientId,
          redirect_uri: OAuth._redirectUri("digits", config),
          client_secret: OAuth.openSecret(config.secret),
          grant_type: 'authorization_code'
          */
        }
      });

    if (response.error) // if the http response was an error
        throw response.error;
    if (typeof response.content === "string")
        response.content = JSON.parse(response.content);
    if (response.content.error)
        throw response.content;
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Twitter Fabric Digits. " + err.message),
                   {response: err.response});
  }

  return response.content;
};

FabricDigits.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
