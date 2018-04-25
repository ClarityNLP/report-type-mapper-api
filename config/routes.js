/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'pages/homepage'
  },


  // SESSION
  'post /login': 'SessionController.login',
  'get /me': 'SessionController.me',
  'get /logout': 'SessionController.logout',

  // USER
  'post /signup': 'UserController.create',
  'get /getToken': 'UserController.getToken',
  'get /users': 'UserController.getAll',
  'post /users/:userId/activate': 'UserController.activate',
  'delete /users/:userId': 'UserController.destroy',

  // LIST
  'get /institutes/:instituteId/lists': 'ListController.all',
  'get /institutes/:instituteId/lists/:listId': 'ListController.show',
  'get /institutes/:instituteId/lists/:listId/reportTypes': 'ListController.getReportTypes',
  'post /institutes/:instituteId/lists/:listId/addTag': 'ListController.addTag',
  'post /institutes/:instituteId/lists/:listId/allSelectedAddTag': 'ListController.allSelectedAddTag',
  'post /institutes/:instituteId/lists/:listId/removeTag': 'ListController.removeTag',
  'post /institutes/:instituteId/lists/:listId/allSelectedRemoveTag': 'ListController.allSelectedRemoveTag',
  'post /institutes/:instituteId/lists': 'ListController.create',
  'get /destroyLists': 'ListController.apiDestroyLists',
  'get /destroyReportTypes': 'ListController.apiDestroyReportTypes',

  // TAG
  'post /tags': 'TagController.create', //create list specific tag
  'post /createGlobalTag': 'TagController.createGlobalTag', //create global tag for each list
  'post /uploadLoincDocumentOntologyCSV': 'TagController.uploadLoincDocumentOntologyCSV', //upload LOINC csv for bulk global tag creation
  'get /destroyGlobalTags': 'TagController.apiDestroyGlobalTags',
  'get /destroyTags': 'TagController.apiDestroyTags',

  'get /institutes/:instituteId/lists/:listId/tags': 'TagController.getTags',
  'get /tags/count': 'TagController.count',

  //INSTITUTE
  'get /institutes': 'InstituteController.all',
  'post /institutes': 'InstituteController.create',
  'get /institutes/:instituteId/name': 'InstituteController.name',
  'get /institutes/:instituteId': 'InstituteController.show',
  'post /institutes/:instituteId': 'InstituteController.update',
  'delete /institutes/:instituteId': 'InstituteController.destroy',

  //API
  'get /api/institutes/:instituteId/lists': 'ListController.apiGetListsForInstitute',
  'get /api/institutes/:instituteId/lists/:listId/reportTypes': 'ListController.apiGetReportTypesForList',
  'get /api/institutes/:instituteId/reportTypes': 'InstituteController.apiGetReportTypesForInstitute',
  'get /api/institutes/:instituteId/lists/:listId/tags/:tagId/reportTypes': 'ListController.apiGetReportTypesByTag',
  // 'get /api/institutes/:instituteId/lists/:listId/tags': 'ListController.apiGetTagsForList',
  // 'get /api/institutes/:instituteId/lists/:listId/tags/:tagId': 'ListController.apiGetTagForList'

  //SWAGGER
  'get /v1/swagger.json': 'SwaggerController.getSwaggerFile'

};
