FabricDigits = {};

(function () {
 
  /**
   * Handle the login once the user has completed the sign in with Digits.
   * We must POST these headers to the server to safely invoke the Digits API
   * and get the logged-in user's data.
   */
  function onLogin(loginResponse) {
    console.log('Digits login succeeded.');
    var oAuthHeaders = parseOAuthHeaders(loginResponse.oauth_echo_headers);

    setDigitsButton('Signing In…');
    // Nov 2, 2015 In process of changing routes iron:router
    // What is the equivalent in meteor?
    console.log("inside onLogin before ajax call");

    Router.go('digits.rest', {query: 'q='+ oAuthHeaders});
    /*
    $.ajax({
      type: 'POST',
      url: '/digits',
      data: oAuthHeaders,
      success: onDigitsSuccess
    });
*/
  }

  /**
   * Handle the login failure.
   */
  function onLoginFailure(loginResponse) {
    console.log('Digits login failed.');
    setDigitsButton('Sign In with Phone');
  }

  /**
   * Handle the login once the user has completed the sign in with Digits.
   * We must POST these headers to the server to safely invoke the Digits API
   * and get the logged-in user's data.
   */
  function onDigitsSuccess(response) {
    console.log('Digits phone number retrieved.')
    setDigitsNumber(response.phoneNumber);
  }

  /**
   * Parse OAuth Echo Headers:
   * 'X-Verify-Credentials-Authorization'
   * 'X-Auth-Service-Provider'
   */
  function parseOAuthHeaders(oAuthEchoHeaders) {
    var credentials = oAuthEchoHeaders['X-Verify-Credentials-Authorization'];
    var apiUrl = oAuthEchoHeaders['X-Auth-Service-Provider'];

    return {
      apiUrl: apiUrl,
      credentials: credentials
    };
  }

  // Set the Digits button label (and make sure it is not disabled).
  function setDigitsButton(text) {
    $('.digits-button').text(text).removeAttr('disabled');
  }

  // Set the Digits phone number (and disable the button).
  function setDigitsNumber(phoneNumber) {
    $('.digits-button').text(phoneNumber).attr('disabled', 'disabled');
  }



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
// Perhaps this won't be needed? A: Would be better to wrap the Twitter fabric code into this
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
      //$('#digits-sdk').load(function () {
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
      //});
    });   

};

 })();