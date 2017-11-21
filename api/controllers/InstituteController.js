module.exports = {

  create: function(req,res) {
    var params = {
      name: req.param('name')
    };
    Institute.create(params).exec(function(err,institute) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      res.send(institute);
    });
  }
}
