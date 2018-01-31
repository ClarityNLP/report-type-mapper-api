
module.exports = function isLoggedIn(req, res, next) {

  if (req.session.isAdmin) {
    return next();
  }

  //--•
  // Otherwise, this request did not come from a logged-in user.
  return res.forbidden();

};
