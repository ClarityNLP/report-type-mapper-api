module.exports = {

  friendlyName: 'Create Global Tag for Each List',
  description: 'Takes a array of lists and creates a global tag for each',

  inputs: {
    lists: {
      type: 'ref',
      description: 'Array of lists',
      required: true
    },
    name: {
      type: 'string',
      description: 'Name of tag',
      required: true
    }
  },

  fn: function(inputs, exits) {
    async.map(inputs.lists, function(list, mapCb) {
      console.log('list: ',list);
      Tag.create( { name: inputs.name, origin: 'Global', list: list.id } ).fetch().exec(function(err, tag) {
        if (err) return mapCb(err);
        return mapCb(null, tag)
      });
    }, function(err, suc) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(suc);
    });
  }
}
