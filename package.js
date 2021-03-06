Package.describe({
  summary: "Fabric Sign in service with phone numbers",
  version: "1.0.0",
  git: 'https://github.com/christieewen/accounts-fabric-digits'
});

Package.onUse(function(api) {
  api.use('underscore', ['server']);
  api.use('accounts-base', ['client', 'server']);
  api.use('kadira:dochead', ['client']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.use('twitter', ['client', 'server']);

  api.use('http', ['client', 'server']);
  api.addAssets('digits_configuration.html', 'client');
  api.addFiles([
    'digits_configuration.js',
    'digits.js',
    'cannonball.js',
    'digits_login_button.css'
  ], ['client']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('christieewen:accounts-fabric-digits');
  api.addFiles('accounts-fabric-digits-tests.js');
});
