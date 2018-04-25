
module.exports = function userBelongsToInstitute(req, res, next) {

  var apiToken = req.param('apiToken');

  User.findOne( { apiToken: apiToken } ).exec(function(err,user ) {
    if (err) {
      sails.log.error(err);
      return res.forbidden();
    }
    if (!user) {
      return res.send(403, {'message': 'Incorrect token.'});
    }
    if (!user.roles) {
      return res.send(400, {'message': 'No user role'});
    }
    if (user.institute == req.param('instituteId') || (user.roles.indexOf('ROLE_ADMIN') !== -1)) {
      return next();
    }
    // Cy-an-Nara
    return res.send(403, {'message': 'User does not belong to that Institute.'});
  });
};
