module.exports = {

  attributes: {

    groupId: {
      type: 'string'
    },

    documentKind: {
      type: 'string'
    },

    documentTypeOfService: {
      type: 'string'
    },

    documentSetting: {
      type: 'string'
    },

    documentSubjectMatterDomain: {
      type: 'string'
    },

    normDSMD: {
      type: 'string'
    },

    documentRole: {
      type: 'string'
    },

    isDeleted: {
      type: 'boolean',
      defaultsTo: false
    },

    reportTypes: {
      collection: 'reportType',
      via: 'tags'
    },

    list: {
      model: 'list'
    },

    origin: {
      type: 'string',
      isIn: ['Global', 'List']
    }
  }
}
