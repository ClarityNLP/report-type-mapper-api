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

    console.log("params: ",params);

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
        sails.helpers.sendAdminsRegistrationEmail( { user: user } ).switch({
          error: function(err) { return res.serverError(err); },
          success: function(info) {
            req.session.userId = user.id;
            req.session.anonymous = false;
            req.session.roles = user.roles;
            req.session.institute = user.institute;
            return res.send(user);
          }
        });
      });
    });
  },

  getToken: function(req,res) {
    var userId = req.session.userId;
    User.findOne( { id: userId } ).exec(function(err, user) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      console.log('user: ',user);
      res.send(user.apiToken);
    });
  },

  getAll: function(req,res) {
    User.find().populate('institute').exec(function(err, users) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      res.send(users);
    });
  },

  activate: function(req,res) {
    var userId = req.param('userId');
    var activate = req.param('activate');
    User.findOne( { id: userId } ).exec(function(err, user) {
      if (!user) {
        return res.send(400);
      }
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      var roles = user.roles;
      if (activate) {
        roles = ['ROLE_USER'];
      } else {
        roles = ['ROLE_PENDING_USER'];
      }
      User.update( { id: userId }, { roles: roles } ).fetch().exec(function(err, user) {
        if (err) {
          sails.log.error(err);
          return res.send(500);
        }
        sails.helpers.sendUserActivatedEmail( { user: user[0], activate: activate } ).switch({
          error: function(err) { return res.serverError(err); },
          success: function(info) {
            console.log('email info: ',info);
            return res.send(200, user[0]);
          }
        });
      });
    });
  },

  destroy: function(req,res) {
    var userId = req.param('userId');
    User.destroy( { id: userId } ).exec(function(err) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(200);
    });
  }

}
