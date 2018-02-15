
module.exports = function tokenBelongsToAdmin(req, res, next) {

  var apiToken = req.param('apiToken');

  User.findOne( { apiToken: apiToken } ).exec(function(err,user ) {
    if (err) {
      sails.log.error(err);
      return res.forbidden();
    }
    if (!user) {
      return res.send(403, {'message': 'Incorrect token.'});
    }
    if (user.roles.indexOf('ROLE_ADMIN') !== -1) {
      return next();
    };
    // Cy-an-Nara
    return res.send(403, {'message': 'You are not an admin.'});
  });

};
