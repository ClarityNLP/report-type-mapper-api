module.exports = {

  all: function(req,res) {
    var instituteId = req.param('instituteId');

    List.find( { where: { institute: instituteId } } ).exec(function(err, lists) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(lists);
    });

  },

  create: function(req,res) {
    var params = {
      name: req.param('name'),
      institute: req.param('instituteId')
    };
    List.create(params).fetch().exec(function(err, list) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      var reportTypeArr = [];
      req.file('reportTypes').upload({
        adapter: require('skipper-csv'),
        csvOptions: {delimiter: ',', columns: true},
        rowHandler: function(row, fd){
          reportTypeArr.push({
            name: row['Report Type Name'],
            list: list.id
          });
        },
        maxBytes: 10000000
      },function whenDone(err, uploadedFiles) {
        if (err) {
          return res.serverError(err);
        }
        if (uploadedFiles.length === 0){
          return res.badRequest('No file was uploaded');
        }
        ReportType.createEach(reportTypeArr).exec(function(err, reportTypes) {
          if (err) {
            return res.serverError(err);
          }
          List.findOne( { id: list.id } ).populate('reportTypes').exec(function(err, list) {
            if (err) {
              return res.serverError(err);
            }
            List.update( { id: list.id }, { numOfReportTypes: list.reportTypes.length } ).fetch().exec(function(err, list){
              if (err) {
                return res.serverError(err);
              }
              return res.send(list);
            });
          });
        });
      });
    });
  },

  getReportTypes: function(req,res) {
    var instituteId = req.param('instituteId');
    var listId = req.param('listId');
    var page = req.param('page') ? req.param('page') : 0;
    var query = req.param('query') ? req.param('query') : '';
    ReportType.find( { where: { list: listId, name: { 'contains': query } } } ).paginate(page, 30).exec(function(err, paginatedReportTypes){
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      ReportType.find( { where: { list: listId, name: { 'contains': query } } } ).exec(function(err, reportTypes){
        if (err) {
          sails.log.error(err);
          return res.send(500);
        }
        return res.send( { reportTypes: paginatedReportTypes, numResults: reportTypes.length } );
      });
    });
  },

  addTag: function(req,res) {
    var instituteId = req.param('instituteId');
    var listId = req.param('listId');
    var reportTypeId = req.param('reportTypeId');
    var tagId = req.param('tagId');
    ReportType.findOne( { id: reportTypeId } ).exec(function(err, reportType) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      Tag.findOne( { id: tagId } ).exec(function(err, tag) {
        if (err) {
          sails.log.error(err);
          return res.send(500);
        }
        var tagArray = reportType.tags;
        tagArray.push(tag);
        ReportType.update( { id: reportTypeId }, { tags: tagArray } ).exec(function(err, updatedReportType) {
          if (err) {
            sails.log.error(err);
            return res.send(500);
          }
          return res.send(200);
        });
      })
    })
  },

  removeTag: function(req,res) {
    var instituteId = req.param('instituteId');
    var listId = req.param('listId');
    var reportTypeId = req.param('reportTypeId');
    var tagId = req.param('tagId');
    ReportType.findOne( { id: reportTypeId } ).exec(function(err, reportType) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      var tagArr = reportType.tags;
      var newTagArr = [];
      _.forEach(tagArr, function(tag) {
        if (tag.id !== tagId) {
          newTagArr.push(tag);
        }
      });
      ReportType.update( { id: reportTypeId }, { tags: newTagArr } ).exec(function(err, updatedReportType) {
        if (err) {
          sails.log.error(err);
          return res.send(500);
        }
        return res.send(200);
      });
    });
  },

  //API
  apiGetListsForInstitute: function(req,res) {
    var instituteId = req.param('instituteId');

    List.find( { where: { institute: instituteId } } ).exec(function(err, lists) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(lists);
    });
  },

  apiGetReportTypesForList: function(req,res) {
    var instituteId = req.param('instituteId');
    var listId = req.param('listId');
    var page = req.param('page') ? req.param('page') : 0;
    var query = req.param('query') ? req.param('query') : '';
    ReportType.find( { where: { list: listId, name: { 'contains': query } } } ).paginate(page, 30).exec(function(err, paginatedReportTypes){
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      ReportType.find( { where: { list: listId, name: { 'contains': query } } } ).exec(function(err, reportTypes){
        if (err) {
          sails.log.error(err);
          return res.send(500);
        }
        return res.send( { reportTypes: paginatedReportTypes, numResults: reportTypes.length } );
      });
    });
  }
}
