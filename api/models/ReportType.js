module.exports = {

  attributes: {

    name: {
      type: 'string'
    },

    isDeleted: {
      type: 'boolean'
    },

    list: {
      model: 'list'
    },

    // tags: {
    //   type: 'json',
    //   defaultsTo: []
    // }

    tags: {
      collection: 'tag',
      via: 'reportTypes'
    }

  }

}
