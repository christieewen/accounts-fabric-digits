FabricDigits = {};


// Request Digits credentials for the user
// @param options {optional}  XXX support options.requestPermissions
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
FabricDigits.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'digits'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  //<head>
  //<script id="digits-sdk" src="https://cdn.digits.com/1/sdk.js" async></script>
  //</head>

 
 /* 
  $('#digits-sdk').load(function () {
    // Initialize Digits using the API key.
    Digits.init({ consumerKey: config.clientId })
      .done(function() {
        console.log('Digits initialized.');
      })
      .fail(function() {
        console.log('Digits failed to initialize.');
      });
    });
*/

  var credentialToken = Random.secret();
  // We need to keep credentialToken across the next two 'steps' so we're adding
  // a credentialToken parameter to the url and the callback url that we'll be returned
  // to by oauth provider

  var loginStyle = OAuth._loginStyle('digits', config, options);

  // url to app, enters "step 1" as described in
  // packages/accounts-oauth1-helper/oauth1_server.js
  var loginPath = '_oauth/digits/?requestTokenAndRedirect=true'
        + '&state=' + OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl);

  if (Meteor.isCordova) {
    loginPath = loginPath + "&cordova=true";
    if (/Android/i.test(navigator.userAgent)) {
      loginPath = loginPath + "&android=true";
    }
  }

  var loginUrl = Meteor.absoluteUrl(loginPath);

/*
// Perhaps this won't be needed?
  OAuth.launchLogin({
    loginService: "digits",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
*/
  var sdkScript = 'https://cdn.digits.com/1/sdk.js';
    DocHead.loadScript(sdkScript, function() {
      // Digits need to be initialized when the sdk is loaded and we get the consumer key 
      $('#digits-sdk').load(function () {
        // Initialize Digits using the API key.
        Digits.init({ consumerKey: config.clientId })
            .done(function() {
                  console.log('Digits initialized.');
            })
            .fail(function() {
            console.log('Digits failed to initialize.');
            });
        // Launch Login?
        //Digits.logIn().done(Meteor.call('onLogin'));
        Digits.logIn().done(onLogin).fail(onLoginFailure);
      });
    });   

};
