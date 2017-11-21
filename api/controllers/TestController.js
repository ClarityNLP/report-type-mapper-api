module.exports = {

  test1: function(req,res) {
    console.log('in action test1...');
    req.session.random = '1';
    console.log('session: ',req.session);
    return res.sendStatus(200);
  },

  test2: function(req,res) {
    console.log('in action test2...');
    console.log('session: ',req.session);
    return res.sendStatus(200);
  }
}
