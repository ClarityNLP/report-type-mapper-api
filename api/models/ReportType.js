module.exports = {

  attributes: {

    name: {
      type: 'string'
    },

    normName: {
      type: 'string'
    },

    isDeleted: {
      type: 'boolean'
    },

    list: {
      model: 'list'
    },

    tags: {
      collection: 'tag',
      via: 'reportTypes'
    }

  }

}
