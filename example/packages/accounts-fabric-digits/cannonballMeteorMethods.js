Meteor.methods({
  onLogin: function (loginResponse) {
    check(loginResponse, {
      oauth_echo_headers: oAuthHeaders['X-Verify-Credentials-Authorization'],
      apiUrl: oAuthHeaders['X-Auth-Service-Provider']
    });

    console.log('Digits login succeeded.');
    var oAuthHeaders = parseOAuthHeaders(loginResponse.oauth_echo_headers);

    Meteor.call('setDigitsButton', 'Signing In…');

    $.ajax({
      type: 'POST',
      url: '/digits',
      data: oAuthHeaders,
      success: onDigitsSuccess
    });


    //if (/* you want to throw an error */) {
    //  throw new Meteor.Error("pants-not-found", "Can't find my pants");
    //}

    return oAuthHeaders;  // or onDigitsSuccess???? Where is this defined?
  },

  setDigitsButton: function (text) {
    check(text, String);
    $('.digits-button').text(text).removeAttr('disabled');
  },
  /**
   * Handle the login once the user has completed the sign in with Digits.
   * We must POST these headers to the server to safely invoke the Digits API
   * and get the logged-in user's data.
   */
  onDigitsSuccess: function (response) {
    check(response, {
      phoneNumber: phone
    });

    console.log('Digits phone number retrieved.')
    Meteor.call('setDigitsNumber', response.phoneNumber);
  }

});