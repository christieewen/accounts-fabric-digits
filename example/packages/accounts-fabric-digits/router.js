Router.route('/digits', {where: 'server'})
  .get(function () {
    this.response.end('get request\n');
  })
  .post(function () {
  	var req = this.request;
  	var res = this.response;
    res.end('post request\n');
  });
