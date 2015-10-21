Package.describe({
  summary: "Fabric Sign in service with phone numbers",
  version: "1.0.0",
  git: 'https://github.com/christieewen/accounts-fabric-digits',
  name: 'christieewen:accounts-fabric-digits'
});

Package.onUse(function(api) {
  api.use('underscore', ['server']);
  api.use('accounts-base', ['client', 'server']);
  api.use('kadira:dochead', ['client']);
  api.use('service-configuration', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  //api.use('twitter', ['client', 'server']);
  
  api.use('http', ['client', 'server']);

  api.addAssets('digits_configuration.html', 'client');

  api.addFiles('digits.js');

  api.export('Digits');

  api.addFiles([
    'digits_configuration.js',
    'cannonball.js', // TODO: get rid of this file
    'digits_login_button.css'
  ], ['client']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('christieewen:accounts-fabric-digits');
  api.addFiles('accounts-fabric-digits-tests.js');
});
