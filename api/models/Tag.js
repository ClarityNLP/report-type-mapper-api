module.exports = {

  attributes: {

    name: {
      type: 'string',
      maxLength: 300,
      unique: true
    },

    isDeleted: {
      type: 'boolean'
    }
  }

}
