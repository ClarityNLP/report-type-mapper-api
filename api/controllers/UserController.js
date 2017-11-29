const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();

module.exports = {

  create: function(req,res) {
    var params = {
      email: req.param('email'),
      password: req.param('password'),
      firstName: req.param('firstName'),
      lastName: req.param('lastName'),
      institute: req.param('instituteId'),
      apiToken: uidgen.generateSync()
    };

    User.create(params).fetch().exec(function(err, user) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      User.findOne( { id: user.id } ).populate('institute').exec(function(err, user) {
        if (err) {
          sails.log.error(err);
          return res.send(500);
        }
        // req.session.authenticated = true;
        // req.session.authorized = 'pending';
        req.session.userId = user.id;
        req.session.anonymous = false;
        req.session.roles = user.roles;
        req.session.institute = user.institute;
        return res.send(user);
      });
    });
  }

}
