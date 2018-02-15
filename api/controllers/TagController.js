const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();

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
    var fileFormat = req.param('fileFormat');
    var tagLookUp = {};
    var subjectMatterDomainArr = [];

    req.file('tagFile').upload({
      adapter: require('skipper-csv'),
      csvOptions: {delimiter: ',', columns: true},
      rowHandler: function(row, fd){
        if (fileFormat !== 'simple') {
          var groupId = row['groupId'];
          var attribute = row['attribute'];
          var attributeValue = row['attributeValue'];

          if (!tagLookUp[groupId]) {
            tagLookUp[groupId] = {}
          }

          var obj = tagLookUp[groupId];

          obj['groupId'] = groupId;
          if (attribute == 'Document.TypeOfService') {
            obj['documentTypeOfService'] = attributeValue;
          } else if (attribute == 'Document.Setting') {
            obj['documentSetting'] = attributeValue;
          } else if (attribute == 'Document.Role') {
            obj['documentRole'] = attributeValue;
          } else if (attribute == 'Document.Kind') {
            obj['documentKind'] = attributeValue;
          } else if (attribute == 'Document.SubjectMatterDomain') {
            obj['documentSubjectMatterDomain'] = attributeValue;
            obj['normDSMD'] = attributeValue.toLowerCase();
          }
        } else {
          var tagValue = row['tag'];
          var uid = uidgen.generateSync();
          tagLookUp[uid] = {
            documentSubjectMatterDomain: tagValue,
            normDSMD: tagValue.toLowerCase()
          };
        }
      },
      maxBytes: 10000000
    },function whenDone(err, uploadedFiles) {
      if (err) {
        return res.serverError(err);
      }
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }
      console.log('tagLookUp: ',tagLookUp);
      var tagsArr = [];
      _.forEach(tagLookUp, function(value, key) {
        value['origin'] = 'Global';
        if (value.documentSubjectMatterDomain) {
          tagsArr.push(value);
        }
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
            return res.send(500);
          }
          sails.helpers.createGlobalTagsForEachList( { lists: lists, tags: cleanedTags } ).switch({
            error: function(err) { return res.serverError(err); },
            success: function(suc) {
              return res.ok();
            }
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
