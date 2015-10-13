Template.configureLoginServiceDialogForDigits.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForDigits.fields = function () {
  return [
    {property: 'consumerKey', label: 'Consumer Key (API Key)'},
    {property: 'consumerSecret', label: 'Consumer Secret (API Secret)'}
  ];
};
