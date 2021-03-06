if (Meteor.isServer) {
  app = Express();
  app.post('/digits', function(req, res) {
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
    //var hostname = url.parse(req.body.apiUrl).hostname;
    var Url = Iron.Url;

    var hostname = Url.parse(req.body.apiUrl).hostname;
    console.log("hostname: ", hostname);
    if (hostname != 'api.digits.com' && hostname != 'api.twitter.com') {
      verified = false;
      messages.push('Invalid API hostname.');
    }

    console.log("res:", res);

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

     HTTP.call("GET", apiUrl,
          options,
          function (error, response) {
            if (!error && response.statusCode == 200) {
              // Send the verified phone number and Digits user ID.
              //var digits = JSON.parse(response.content)
              var digits = response.data
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
  });
}


Router.route('/iron-router/digits', {name: 'digits.rest', where: 'server'})
  .get(function () {
    this.response.end('get request\n');
  })
  .post(function (req, res) {
  	//var req = this.request;
  	//var res = this.response;

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
  	//var hostname = url.parse(req.body.apiUrl).hostname;
    var Url = Iron.Url;

    var hostname = Url.parse(req.body.apiUrl).hostname;
    console.log("hostname: ", hostname);
  	if (hostname != 'api.digits.com' && hostname != 'api.twitter.com') {
    	verified = false;
    	messages.push('Invalid API hostname.');
  	}

    console.log("res:", res);

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
    
    HTTP.call("GET", apiUrl,
          options,
          function (error, response) {
            if (!error && response.statusCode == 200) {
              // Send the verified phone number and Digits user ID.
              //var digits = JSON.parse(response.content)
              var digits = response.data
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
