Package.describe({
  summary: "Fabric Sign in service with phone numbers",
  version: "0.0.1"
});

Package.onUse(function(api) {
  api.use('underscore', ['server']);
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.use('twitter', ['client', 'server']);

  api.use('http', ['client', 'server']);

  api.addFiles('digits_login_button.css', 'client');

  api.addFiles("twitter.js");
});
