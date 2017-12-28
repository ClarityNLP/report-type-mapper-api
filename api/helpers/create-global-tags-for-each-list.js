module.exports = {

  friendlyName: 'Create Global Tags for Each List',
  description: 'Takes a array of lists and array of tags and creates the global tags for each list',

  inputs: {
    lists: {
      type: 'ref',
      description: 'Array of lists',
      required: true
    },
    tags: {
      type: 'ref',
      description: 'Array of tags',
      required: true
    }
  },

  fn: function(inputs, exits) {
    async.map(inputs.lists, function(list, mapCb) {
      async.map(inputs.tags, function(tag, mapCb2) {
        var tagObj = Object.assign({}, tag, { list: list.id, origin: 'Global' } );
        Tag.create(tagObj).exec(function(err, tag) {
          if (err) return mapCb2(err);
          return mapCb2(null, tag);
        });
      }, function(err, suc) {
        if (err) {
          return mapCb(err);
        }
        return mapCb(null, suc);
      });
    }, function(err, suc) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(suc);
    });
  }
}
