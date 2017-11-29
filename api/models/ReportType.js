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

    tags: {
      type: 'json',
      defaultsTo: []
    }
  }

}
