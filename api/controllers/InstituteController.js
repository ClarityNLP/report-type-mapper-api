module.exports = {

  all: function(req,res) {
    Institute.find().populate('lists').exec(function(err,institutes) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(institutes);
    });
  },

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
  },

  show: function(req,res) {
    var instituteId = req.param('instituteId');
    Institute.findOne( { id: instituteId } ).exec(function(err, institute) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      res.send(institute);
    });
  },

  update: function(req,res) {
    var instituteId = req.param('instituteId');
    var name = req.param('name');
    Institute.update( { id: instituteId }, { name: name } ).exec(function(err, institute ) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(200);
    });
  },

  destroy: function(req,res) {
    var instituteId = req.param('instituteId');
    Institute.destroy( { id: instituteId } ).exec(function(err) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(200);
    });
  }
}
