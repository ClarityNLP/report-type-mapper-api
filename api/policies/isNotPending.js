module.exports = function isLoggedIn(req, res, next) {

  // If `req.session.userId` is set, then we know that this request originated
  // from a logged-in user.  So we can safely proceed to the next policy--
  // or, if this is the last policy, the relevant action.
  // if (req.session.isPending === false) {
  //   return next();
  // }


  if (req.session.roles.indexOf('ROLE_PENDING_USER') == -1) {
    return next();
  };

  return res.forbidden();

};
