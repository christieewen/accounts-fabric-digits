Package.describe({
  summary: "Fabric Digits Sign in service with phone numbers",
  version: "1.0.0",
  git: 'https://github.com/christieewen/accounts-fabric-digits',
  name: 'christieewen:accounts-fabric-digits'
});

Package.onUse(function(api) {
  api.use('random', 'client');
  api.use('underscore', ['server']);
  api.use('accounts-base', ['client', 'server']);
  api.use('kadira:dochead', ['client']);
  api.use('iron:router', ['client', 'server']); // experimenting
  api.use('service-configuration', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.imply('accounts-oauth', ['client', 'server']);

  //api.use('twitter', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('http', ['client', 'server']);
  api.use('templating', 'client');

  api.use('iron:url', ['client', 'server']);

  api.addFiles('router.js', 'server');
  //api.addAssets('digits_configuration.html', 'client');

  api.addFiles('digits.js');

  api.export('FabricDigits');

  api.addFiles([
    'digits_configuration.html',
    'digits_configuration.js',
    'digits_login_button.css'
  ], ['client']);

  api.addFiles('digits_server.js', 'server');
  api.addFiles('digits_client.js', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('christieewen:accounts-fabric-digits');
  api.addFiles('accounts-fabric-digits-tests.js');
});
