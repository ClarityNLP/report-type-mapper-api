const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
const csv = require("fast-csv");
const path = require("path");
const fs = require('fs');

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

    const name = req.param('name');
    const instituteId = req.param('instituteId');

    if (!name || !instituteId) {
      sails.log.warn('No name or instituteId provided.');
      return res.send(400, { message: 'No name or institute provided' } );
    }

    List.create( { name: name, institute: instituteId }).fetch().exec(function(err, list) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }

      let reportTypeArr = [];

      req.file('reportTypes').upload({ maxBytes: 1000000}, function(err, uploadedFiles) {
        if (err) {
          sails.log.error(err);
          return res.send(500, { message: 'Problem uploading file.' } );
        }

        if (uploadedFiles.length === 0) {
          return res.send(400, { message: 'No file sent.' } );
        }

        if (uploadedFiles[0].type !== 'text/csv') {
          return res.send(400, { message: 'File must be csv format. ' } );
        }

        var tagLookUp = {};

        csv
          .fromPath(uploadedFiles[0].fd, {
            headers: ["Report Type Name"],
            ignoreEmpty: true
          })
          .validate(function(data) {
            return data["Report Type Name"] !== 'Report Type Name'
          })
          .on('data', function(data) {
            reportTypeArr.push({
              name: data["Report Type Name"],
              normName: data["Report Type Name"].toLowerCase(),
              list: list.id
            });
          })
          .on('end', function() {

            fs.unlinkSync(uploadedFiles[0].fd);

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
                  GlobalTag.find().exec(function(err, tags) {
                    if (err) {
                      return res.serverError(err);
                    }
                    var cleanedTags = [];
                    tags.map(function(tag) {
                      cleanedTags.push({
                        groupId: tag.groupId,
                        documentKind: tag.documentKind,
                        documentTypeOfService: tag.documentTypeOfService,
                        normDSMD: tag.documentSubjectMatterDomain.toLowerCase(),
                        documentSetting: tag.documentSetting,
                        documentSubjectMatterDomain: tag.documentSubjectMatterDomain,
                        documentRole: tag.documentRole,
                        isDeleted: tag.isDeleted
                      });
                    });
                    sails.helpers.createGlobalTagsForEachList( list, cleanedTags ).switch({
                      error: function(err) { return res.serverError(err); },
                      success: function(suc) {
                        return res.ok();
                      }
                    });
                  })
                });
              });
            });
          });
      });
    });
  },

  // create: function(req,res) {
  //   var params = {
  //     name: req.param('name'),
  //     institute: req.param('instituteId')
  //   };
  //   List.create(params).fetch().exec(function(err, list) {
  //     if (err) {
  //       sails.log.error(err);
  //       return res.send(500);
  //     }
  //     var reportTypeArr = [];
  //     req.file('reportTypes').upload({
  //       adapter: require('skipper-csv'),
  //       csvOptions: {delimiter: ',', columns: true},
  //       rowHandler: function(row, fd){
  //         reportTypeArr.push({
  //           name: row['Report Type Name'],
  //           normName: row['Report Type Name'].toLowerCase(),
  //           list: list.id
  //         });
  //       },
  //       maxBytes: 10000000
  //     },function whenDone(err, uploadedFiles) {
  //       if (err) {
  //         return res.serverError(err);
  //       }
  //       if (uploadedFiles.length === 0){
  //         return res.badRequest('No file was uploaded');
  //       }
  //       ReportType.createEach(reportTypeArr).exec(function(err, reportTypes) {
  //         if (err) {
  //           return res.serverError(err);
  //         }
  //         List.findOne( { id: list.id } ).populate('reportTypes').exec(function(err, list) {
  //           if (err) {
  //             return res.serverError(err);
  //           }
  //           List.update( { id: list.id }, { numOfReportTypes: list.reportTypes.length } ).fetch().exec(function(err, list){
  //             if (err) {
  //               return res.serverError(err);
  //             }
  //             GlobalTag.find().exec(function(err, tags) {
  //               if (err) {
  //                 return res.serverError(err);
  //               }
  //               var cleanedTags = [];
  //               tags.map(function(tag) {
  //                 cleanedTags.push({
  //                   groupId: tag.groupId,
  //                   documentKind: tag.documentKind,
  //                   documentTypeOfService: tag.documentTypeOfService,
  //                   normDSMD: tag.documentSubjectMatterDomain.toLowerCase(),
  //                   documentSetting: tag.documentSetting,
  //                   documentSubjectMatterDomain: tag.documentSubjectMatterDomain,
  //                   documentRole: tag.documentRole,
  //                   isDeleted: tag.isDeleted
  //                 });
  //               });
  //               sails.helpers.createGlobalTagsForEachList( { lists: list, tags: cleanedTags } ).switch({
  //                 error: function(err) { return res.serverError(err); },
  //                 success: function(suc) {
  //                   return res.ok();
  //                 }
  //               });
  //             })
  //           });
  //         });
  //       });
  //     });
  //   });
  // },

  getReportTypes: function(req,res) {
    var instituteId = req.param('instituteId');
    var listId = req.param('listId');
    var page = req.param('page') ? req.param('page') : 0;
    var query = req.param('query').toLowerCase() ? req.param('query').toLowerCase() : '';
    var untaggedOnly = req.param('untaggedOnly') ? req.param('untaggedOnly') : false;
    ReportType.find( { where: { list: listId, normName: { 'contains': query } } } ).paginate(page, 30).populate('tags').exec(function(err, paginatedReportTypes){
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      sails.helpers.filterUntaggedReportTypes( paginatedReportTypes, untaggedOnly ).switch({
        error: function(err) { return res.serverError(err); },
        success: function(paginatedReportTypes) {
          ReportType.find( { where: { list: listId, normName: { 'contains': query } } } ).populate('tags').exec(function(err, reportTypes){
            if (err) {
              sails.log.error(err);
              return res.send(500);
            }
            sails.helpers.filterUntaggedReportTypes( reportTypes, untaggedOnly ).switch({
              error: function(err) { return res.serverError(err); },
              success: function(reportTypes) {
                return res.send( { reportTypes: paginatedReportTypes, numResults: reportTypes.length } );
              }
            });
          });
        }
      });
    });
  },

  addTag: function(req,res) {
    var instituteId = req.param('instituteId');
    var listId = req.param('listId');
    var reportTypeId = req.param('reportTypeId');
    var tagId = req.param('tagId');
    ReportType.addToCollection(reportTypeId, 'tags', tagId).exec(function(err) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.ok();
    });
  },

  allSelectedAddTag: function(req,res) {
    var instituteId = req.param('instituteId');
    var listId = req.param('listId');
    var query = req.param('reportTypeQuery') ? req.param('reportTypeQuery').toLowerCase() : '';
    var tagId = req.param('tagId');
    ReportType.find( { where: { list: listId, normName: { 'contains': query } } } ).exec(function(err, reportTypes){
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      async.map(reportTypes, function(reportType, mapCb) {
        sails.log.info('running assoc for report type: ',reportType.id);
        ReportType.addToCollection(reportType.id, 'tags', tagId).exec(function(err) {
          if (err) return mapCb(err);
          return mapCb(null)
        });
      }, function(err, suc) {
        if (err) {
          sails.log.error(err);
          return res.send(500);
        }
        return res.ok();
      });
      // return res.send(200);
    });
  },

  allSelectedRemoveTag: function(req,res) {
    var instituteId = req.param('instituteId');
    var listId = req.param('listId');
    var query = req.param('reportTypeQuery') ? req.param('reportTypeQuery').toLowerCase() : '';
    var tagId = req.param('tagId');
    ReportType.find( { where: { list: listId, normName: { 'contains': query } } } ).exec(function(err, reportTypes){
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      async.map(reportTypes, function(reportType, mapCb) {
        sails.log.info('removing tag '+ tagId + 'from report type: ' + reportType.id);
        ReportType.removeFromCollection(reportType.id, 'tags', tagId).exec(function(err) {
          if (err) return mapCb(err);
          return mapCb(null)
        });
      }, function(err, suc) {
        if (err) {
          sails.log.error(err);
          return res.send(500);
        }
        return res.ok();
      });
    });
  },

  removeTag: function(req,res) {
    var instituteId = req.param('instituteId');
    var listId = req.param('listId');
    var reportTypeId = req.param('reportTypeId');
    var tagId = req.param('tagId');
    ReportType.removeFromCollection(reportTypeId, 'tags', tagId).exec(function(err) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.ok();
    });
  },

  //Public API
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
    var listId = req.param('listId');
    ReportType.find( { where: { list: listId } } ).populate('tags').exec(function(err, reportTypes){
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send( { reportTypes: reportTypes } );
    });
  },

  apiGetReportTypesByTag: function(req,res) {
    var instituteId = req.param('instituteId');
    var listId = req.param('listId');
    var tagId = req.param('tagId');
    Tag.findOne( { id: tagId } ).populate('reportTypes').exec(function(err, tag) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(tag);
    });
  },

  apiDestroyLists: function(req,res) {
    List.destroy({}).exec(function(err) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(200);
    });
  },

  apiDestroyReportTypes: function(req,res) {
    ReportType.destroy({}).exec(function(err) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(200);
    });
  }
}
