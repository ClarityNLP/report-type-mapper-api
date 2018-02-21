module.exports = {

  friendlyName: 'Filter Report Types for untagged only',
  description: 'Filters array of report types for untagged report types only',

  inputs: {
    reportTypes: {
      type: 'ref',
      description: 'Array of report types',
      required: true
    },
    untaggedOnly: {
      type: 'boolean',
      description: 'Untagged only?',
      required: true
    }
  },

  fn: function(inputs, exits) {
    if (!inputs.untaggedOnly) {
      return exits.success(inputs.reportTypes);
    } else {
      var filteredReportTypes = _.filter(inputs.reportTypes, function(o) {
        return o.tags.length == 0;
      });
      return exits.success(filteredReportTypes);
    }
  }
}
