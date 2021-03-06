module.exports = {

  attributes: {

    name: {
      type: 'string',
      maxLength: 300
    },

    isDeleted: {
      type: 'boolean'
    },

    reportTypes: {
      collection: 'reportType',
      via: 'list'
    },

    numOfReportTypes: {
      type: 'number'
    },

    tags: {
      collection: 'tag',
      via: 'list'
    },

    institute: {
      model: 'institute'
    }
  }
}
