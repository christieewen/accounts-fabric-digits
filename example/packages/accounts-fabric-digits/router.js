Router.route('/digits', {name: 'digits.rest', where: 'server'})
  .get(function () {
    this.response.end('get request\n');
  })
  .post(function () {
  	var req = this.request;
  	var res = this.response;

  	var apiUrl = req.body['apiUrl']
  	var credentials = req.body['credentials']
  	var verified = true;
  	var messages = [];


  	// Verify the OAuth consumer key.
  	var config = ServiceConfiguration.configurations.findOne({service: 'digits'});
  	if (!config) {
  		console.log("config error");
    	return;
  	}

  	if (credentials.indexOf('oauth_consumer_key="' + config.clientId + '"') == -1) {
    	verified = false;
    	messages.push('The Digits API key does not match.');
  	}

  	// Verify the hostname.
  	var hostname = url.parse(req.body.apiUrl).hostname;
  	if (hostname != 'api.digits.com' && hostname != 'api.twitter.com') {
    	verified = false;
    	messages.push('Invalid API hostname.');
  	}

  	// Do not perform the request if the API key or hostname are not verified.
  	if (!verified) {
    	return res.send({
      		phoneNumber: "",
      		userID: "",
      		error: messages.join(' ')
    	});
  	}

  	// Prepare the request to the Digits API.
  	var options = {
    	url: apiUrl,
    	headers: {
      	'Authorization': credentials
    	}
  	};


  	// HTTP GET
  	// Perform the request to the Digits API.
  	request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // Send the verified phone number and Digits user ID.
      var digits = JSON.parse(body)
      return res.send({
        phoneNumber: digits.phone_number,
        userID: digits.id_str,
        error: ''
      });
    } else {
      	// Send the error.
      	return res.send({
        	phoneNumber: '',
        	userID: '',
        	error: error.message
      	});
    	}
  	});

    res.end('post request\n');
  });
