/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  InstituteController: {
    all: [],
    create: [],
    show: ['isNotPending', 'isAuthenticated'],//TODO isInInstitute aware of Admin
    name: ['isNotPending', 'isAuthenticated'],
    update: ['isNotPending', 'isAuthenticated', 'isAdmin'],
    destroy: ['isNotPending', 'isAuthenticated', 'isAdmin']
  },

  ListController: {
    all: ['isNotPending', 'isAuthenticated'],
    create: ['isNotPending', 'isAuthenticated'],
    getReportTypes: ['isNotPending', 'isAuthenticated'],
    addTag: ['isNotPending', 'isAuthenticated'],
    removeTag: ['isNotPending', 'isAuthenticated'],
    allSelectedAddTag: ['isNotPending', 'isAuthenticated'],
    allSelectedRemoveTag: ['isNotPending', 'isAuthenticated'],
    apiGetListsForInstitute: ['tokenBelongsToUser', 'userBelongsToInstitute'],
    apiGetReportTypesForList: ['tokenBelongsToUser', 'userBelongsToInstitute'],
    apiGetReportTypesByTag: ['tokenBelongsToUser', 'userBelongsToInstitute'],
    apiDestroyLists: ['tokenBelongsToUser', 'tokenBelongsToAdmin'],
    apiDestroyReportTypes: ['tokenBelongsToUser', 'tokenBelongsToAdmin']
  },

  SessionController: {
    login: [],
    logout: [],
    me: []
  },

  TagController: {
    createGlobalTag: ['isNotPending', 'isAuthenticated', 'isAdmin'],
    createListSpecificTag: ['isNotPending', 'isAuthenticated'],
    uploadLoincDocumentOntologyCSV: ['isNotPending', 'isAuthenticated'],
    count: ['isNotPending', 'isAuthenticated'],
    getTags: ['isNotPending', 'isAuthenticated'],
    apiDestroyTags: ['tokenBelongsToUser', 'tokenBelongsToAdmin'],
    apiDestroyGlobalTags: ['tokenBelongsToUser', 'tokenBelongsToAdmin']
  },

  UserController: {
    create: [],
    getToken: [],
    getAll: ['isNotPending', 'isAuthenticated', 'isAdmin'],
    activate: ['isNotPending', 'isAuthenticated', 'isAdmin'],
    destroy: ['isNotPending', 'isAuthenticated', 'isAdmin']
  }

};
