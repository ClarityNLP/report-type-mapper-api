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

  // LIST
  'get /institutes/:instituteId/lists': 'ListController.all',
  'get /institutes/:instituteId/lists/:listId': 'ListController.show',
  'get /institutes/:instituteId/lists/:listId/reportTypes': 'ListController.getReportTypes',
  'post /institutes/:instituteId/lists/:listId/addTag': 'ListController.addTag',
  'post /institutes/:instituteId/lists/:listId/removeTag': 'ListController.removeTag',
  // 'post /insitutes/:instituteId/lists/:listId/reportTypes': 'ListController.uploadReportTypes',
  'post /institutes/:instituteId/lists': 'ListController.create',

  // TAG
  'post /tags': 'TagController.create', //create list specific tag
  'post /createGlobalTag': 'TagController.createGlobalTag', //create global tag for each list
  'post /uploadLoincDocumentOntologyCSV': 'TagController.uploadLoincDocumentOntologyCSV', //upload LOINC csv for bulk global tag creation

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
  'get /api/institutes/:instituteId/lists/:listId/tags/:tagId/reportTypes': 'ListController.apiGetReportTypesByTag'
  // 'get /api/institutes/:instituteId/lists/:listId/tags': 'ListController.apiGetTagsForList',
  // 'get /api/institutes/:instituteId/lists/:listId/tags/:tagId': 'ListController.apiGetTagForList'



  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝



  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
