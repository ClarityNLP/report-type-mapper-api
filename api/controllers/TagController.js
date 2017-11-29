module.exports = {

  create: function(req,res) {
    var name = req.param('name');
    Tag.create( { name: name } ).exec(function(err, tag) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(200);
    });
  },

  count: function(req,res) {
    Tag.count().exec(function(err,count) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send( { count: count } );
    });
  },

  all: function(req,res) {
    Tag.find().exec(function(err,tags) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send( { tags: tags } );
    })
  }
}
