module.exports = {

  attributes: {

    name: {
      type: 'string',
      maxLength: 300
    },

    isDeleted: {
      type: 'boolean'
    },

    list: {
      model: 'list'
    },

    tags: {
      type: 'json'
    }
  }

}
