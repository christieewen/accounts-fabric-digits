Template.configureLoginServiceDialogForDigits.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForDigits.fields = function () {
  return [
    {property: 'clientId', label: 'Consumer Key (API Key)'},
    {property: 'secret', label: 'Consumer Secret (API Secret)'}
  ];
};
