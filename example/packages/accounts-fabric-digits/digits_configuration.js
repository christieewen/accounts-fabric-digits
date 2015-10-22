if (Meteor.isClient) {
	Template.configureLoginServiceDialogForDigits.helpers({
  	siteUrl: function () {
  		// Twitter doesn't recognize localhost as a domain name
    	return Meteor.absoluteUrl({replaceLocalhost: true});  }
	});

	Template.configureLoginServiceDialogForDigits.fields = function () {
  	return [
    	{property: 'clientId', label: 'Consumer Key (API Key)'},
    	{property: 'secret', label: 'Consumer Secret (API Secret)'}
  	];
	};
}