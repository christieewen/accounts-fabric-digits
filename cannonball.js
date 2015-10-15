/**
 * Cannonball Web JavaScript.
 * Romain Huet
 * @romainhuet
 * Note: Some modifications for use with Meteor by @ewenchristie
 */

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
    $.ajax({
      type: 'POST',
      url: '/digits',
      data: oAuthHeaders,
      success: onDigitsSuccess
    });
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
})();
