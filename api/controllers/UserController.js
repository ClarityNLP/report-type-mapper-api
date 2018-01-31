const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();

module.exports = {

  create: function(req,res) {
    var params = {
      email: req.param('email'),
      password: req.param('password'),
      firstName: req.param('firstName'),
      lastName: req.param('lastName'),
      institute: req.param('selectedInstitute').id,
      apiToken: uidgen.generateSync()
    };

    console.log('params: ',params);

    User.create(params).fetch().exec(function(err, user) {
      if (err) {
        sails.log.error(err);
        if (err.code === 'E_INVALID_NEW_RECORD') {
          return res.send(400)
        }
        return res.send(500);
      }
      User.findOne( { id: user.id } ).populate('institute').exec(function(err, user) {
        if (err) {
          sails.log.error(err);
          return res.send(500);
        }
        req.session.userId = user.id;
        req.session.anonymous = false;
        req.session.roles = user.roles;
        req.session.institute = user.institute;
        return res.send(user);
      });
    });
  },

  getToken: function(req,res) {
    console.log('hit getToken!');
    var userId = req.session.userId;
    User.findOne( { id: userId } ).exec(function(err, user) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      console.log('user: ',user);
      res.send(user.apiToken);
    });
  }

}
