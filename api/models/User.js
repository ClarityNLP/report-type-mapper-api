var uuid = require('node-uuid');

module.exports = {

  // autoPK: false,

  attributes: {

    // id: {
    //     type: 'string',
    //     primaryKey: true,
    //     defaultsTo: function (){ return uuid.v4(); },
    //     unique: true,
    //     index: true,
    //     uuidv4: true
    // },

    firstName: {
      type: 'string',
      maxLength: 100
    },

    lastName: {
      type: 'string',
      maxLength: 100
    },

    email: {
      type: 'string',
      maxLength: 100
      // maxLength: 200
    },

    roles: {
      type: 'json',
      defaultsTo: ['ROLE_USER']
    },

    password: {
      type: 'string',
      required: true,
      columnName: 'hashed_password'
    },

    isPending: {
      type: 'boolean',
      defaultsTo: true
    },

    isDeleted: {
      type: 'boolean'
    },

    institute: {
      model: 'institute'
    }

    // customToJSON: function() {
    //   var obj = this.toObject();
    //   delete obj.password;
    //   delete obj.hashedPassword;
    //   delete obj._csrf;
    //   return obj;
    // }
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
