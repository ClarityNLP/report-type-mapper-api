const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
const csv = require("fast-csv");
const path = require("path");
const fs = require('fs');


module.exports = {

  createGlobalTag: function(req,res) {
    var name = req.param('name');
    List.find().exec(function(err, lists) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      sails.helpers.createGlobalTagForEachList( { lists: lists, name: name } ).switch({
        error: function(err) { return res.serverError(err); },
        success: function(suc) {
          return res.ok();
        }
      });
    });
  },

  createListSpecificTag: function(req,res) {
    var name = req.param('name');
    var listId = req.param('listId');
    Tag.create( { name: name, type: 'List', list: listId } ).exec(function(err, tag) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(200);
    });
  },

  uploadLoincDocumentOntologyCSV: function(req,res) {

    req.file('tagFile').upload({ maxBytes: 1000000}, function(err, uploadedFiles) {
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
          headers: ["tag"],
          ignoreEmpty: true
        })
        .validate(function(data){
          return data.tag !== 'tag';
         })
        .on('data', function(data) {
          var tag = data.tag;
          var uid = uidgen.generateSync();
          tagLookUp[uid] = {
            documentSubjectMatterDomain: tag,
            normDSMD: tag.toLowerCase()
          };
        })
        .on('end', function() {

          fs.unlinkSync(uploadedFiles[0].fd);

          var tagsArr = [];
          _.forEach(tagLookUp, function(value, key) {
            value['origin'] = 'Global';
            tagsArr.push(value);
          });

          async.map(tagsArr, function(tag, mapCb) {
            GlobalTag.create( tag ).fetch().exec(function(err, tag) {
              if (err) {
                if (err.code == 'E_UNIQUE') {
                  return mapCb(null, { error: 'Failed Validation'});
                } else {
                  return mapCb(err);
                }
              }
              return mapCb(null, tag)
            });
          }, function(err, tags) {
            if (err) {
              return sails.log.error(err);
            }
            var cleanedTags = [];
            tags.map(function(tag) {
              if (!tag.error) {
                cleanedTags.push({
                  groupId: tag.groupId,
                  documentKind: tag.documentKind,
                  documentTypeOfService: tag.documentTypeOfService,
                  documentSetting: tag.documentSetting,
                  documentSubjectMatterDomain: tag.documentSubjectMatterDomain,
                  normDSMD: tag.normDSMD,
                  documentRole: tag.documentRole,
                  isDeleted: tag.isDeleted
                });
              }
            });

            List.find().exec(function(err, lists) {
              if (err) {
                sails.log.error(err);
                return res.sendStatus(500);
              }
              sails.helpers.createGlobalTagsForEachList( { lists: lists, tags: cleanedTags } ).switch({
                error: function(err) { return res.serverError(err); },
                success: function(suc) {
                  return res.send(200, { numCreatedGlobalTags: cleanedTags.length } );
                }
              });
            });
          });
        });
    });
  },

  count: function(req,res) {
    GlobalTag.count().exec(function(err,count) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send( { count: count } );
    });
  },

  getTags: function(req,res) {
    var listId = req.param('listId');
    var query = req.param('query').toLowerCase() ? req.param('query').toLowerCase() : '';

    Tag.find( { where: { list: listId, normDSMD: { 'contains': query } }, sort: 'normDSMD ASC' } ).exec(function(err,tags) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send( { tags: tags, numResults: tags.length } );
    });
  },

  apiDestroyGlobalTags: function(req,res) {
    GlobalTag.destroy({}).exec(function(err) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(200);
    });
  },

  apiDestroyTags: function(req,res) {
    Tag.destroy({}).exec(function(err) {
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(200);
    });
  }
}
