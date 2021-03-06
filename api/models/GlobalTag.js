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
      type: 'string',
      required: true,
      unique: true
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
    }

  }

}
