Accounts.oauth.registerService('digits');

if (Meteor.isClient) {

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

  // Digits do not require complexities of OAuth if the website uses SSL
  // Just add https://cdn.digits.com/1/sdk.js to login button
  // See: https://blog.twitter.com/2015/launching-digits-login-for-web
  // Cannonball seems to deal with OAuth so for the time being mirror all the other accounts-<services>
  var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
  
  FabricDigits.requestCredential(options, credentialRequestCompleteCallback);

  var config = ServiceConfiguration.configurations.findOne({service: 'digits'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
      return;
  }


var sdkScript = 'https://cdn.digits.com/1/sdk.js';
    DocHead.loadScript(sdkScript, function() {
//    $('#digits-sdk').load(function () {

       Digits.init({ consumerKey: config.clientId })
      .done(function() {
        console.log('Digits initialized.');
      })
      .fail(function() {
        console.log('Digits failed to initialize.');
      });

      //Digits.logIn().done(Meteor.call('onLogin', function() { console.log("success!");})).fail(function() {
      //  console.log('Digits failed onLogin.');
      //});

      Digits.logIn()
        .done(onLogin) /*handle the response*/
        .fail(onLoginFailure);

 //   });
    });  
    
    //console.log (credentialRequestCompleteCallback);
  };

  })();
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
