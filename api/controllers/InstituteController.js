var _ = require('lodash');

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

  name: function(req,res) {
    var instituteId = req.param('instituteId');
    Institute.findOne( { id: instituteId } ).exec(function(err, institute) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      res.send(institute.name);
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
    List.find( { where: { institute: instituteId } } ).exec(function(err, lists) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      console.log('lists: ',lists);
      async.map(lists, function(list, mapCb) {
        Tag.destroy( { list: list.id } ).exec(function(err) {
          if (err) {
            return mapCb(err);
          }
          ReportType.destroy( { list: list.id } ).exec(function(err) {
            if (err) {
              return mapCb(err);
            }
            return mapCb(null);
          });
        });
      }, function(err) {
        if (err) {
          sails.log.error(err);
          return res.send(500);
        }
        List.destroy( { institute: instituteId } ).exec(function(err) {
          if (err) {
            sails.log.error(err);
            return res.send(500);
          }
          Institute.destroy( { id: instituteId } ).exec(function(err) {
            if (err) {
              sails.log.error(err);
              return res.send(500);
            }
            return res.send(200);
          });
        });
      });
    });
  },

  apiGetReportTypesForInstitute: function(req,res) {
    var instituteId = req.param('instituteId');
    List.find( { institute: instituteId } ).populate('reportTypes').exec(function(err, lists) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      var reportTypes = _.flatMap(lists, function(n) {
        return n.reportTypes;
      })
      return res.send(200, reportTypes);
    });
  }
}
