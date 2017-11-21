module.exports = {

  create: function(req,res) {
    var params = {
      email: req.param('email'),
      password: req.param('password'),
      firstName: req.param('firstName'),
      lastName: req.param('lastName'),
      institute: req.param('institute')
    };
    User.create(params).exec(function(err, user) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      req.session.authenticated = true;
      req.session.authorized = 'pending';
      return res.send(user);
    });
  }

}
