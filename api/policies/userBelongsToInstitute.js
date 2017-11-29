
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
    if (user.institute == req.param('instituteId')) {
      return next();
    }
    // Cy-an-Nara
    return res.send(403, {'message': 'User does not belong to that Institute.'});
  });
};
