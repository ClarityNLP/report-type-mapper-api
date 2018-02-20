module.exports = {

  friendlyName: 'Get Report Types for List',
  description: 'Get All Reports Types for a given array of Lists',

  inputs: {
    lists: {
      type: 'ref',
      description: 'Array of lists',
      required: true
    }
  },

  fn: function(inputs, exits) {
    async.map(inputs.lists, function(list, mapCb) {
      ReportType.find( { list: list.id } ).populate('tags').exec(function(err, reportTypes) {
        if (err) return mapCb(err);
        return mapCb(null, reportTypes);
      });
    }, function(err, suc) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(suc);
    });
  }
}
