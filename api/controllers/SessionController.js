var bcrypt = require('bcrypt');

module.exports = {

  login: function(req,res) {
    var email = req.param('email');
    var password = req.param('password');
    if (!email || !password) {
      sails.log.info('Login attempt missing email/password.');
      return res.send(400);
    }
    User.findOne( { email: email } ).populate('institute').exec(function(err,user) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      if (!user) {
        sails.log.info('User not found.');
        return res.send(400);
      }
      bcrypt.compare(password, user.password, function(err, passwordMatch) {
        if (err) {
          sails.log.error(err);
          return res.send(500);
        }
        if (passwordMatch) {
          req.session.userId = user.id;
          req.session.anonymous = false;
          req.session.roles = user.roles;
          req.session.institute = user.institute;
          return res.send(200);
        } else {
          console.log('dont match');
          return res.send(400);
        }
      });
    });
  },

  logout: function(req,res) {
    req.session.userId = null;
    req.session.anonymous = true;
    req.session.roles = null;
    req.session.institute = null;
    return res.send(200);
  },

  me: function(req,res) {
    return res.send(req.session);
  }
}
