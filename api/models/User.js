var uuid = require('node-uuid');

module.exports = {

  attributes: {

    firstName: {
      type: 'string',
      maxLength: 100,
      required: true
    },

    lastName: {
      type: 'string',
      maxLength: 100,
      required: true
    },

    email: {
      type: 'string',
      unique: true,
      maxLength: 200,
      required: true
    },

    roles: {
      type: 'json',
      defaultsTo: ['ROLE_PENDING_USER']
    },

    password: {
      type: 'string',
      required: true,
      columnName: 'hashed_password'
    },

    isDeleted: {
      type: 'boolean'
    },

    institute: {
      model: 'institute',
      required: true
    },

    apiToken: {
      type: 'string'
    }
  },

  beforeCreate: function(values, next) {
    console.log("values: ",values);
    if (!values.password) {
      return next({err: ['Password not provided.']});
    }
    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, hashedPassword) {
      if (err) return next(err);
      values.password = hashedPassword;
      next();
    });
  }

}
