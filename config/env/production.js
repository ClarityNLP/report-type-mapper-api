module.exports = {

  datastores: {

    default: {
      adapter: 'sails-mysql',
      url: 'mysql://root:gtri@localhost:3306/report-type-mapper',
    }

  },

  models: {
    migrate: 'safe'
  },

  blueprints: {
    shortcuts: false,
  },

  security: {
    cors: {
      allRoutes: true,
      allowOrigins: ['http://report-type-mapper.hdap.gatech.edu', 'http://report-type-mapper.hdap.gatech.edu:3000'],
      allowCredentials: true,
    },
  },



  /***************************************************************************
  *                                                                          *
  * Configure how your app handles sessions in production.                   *
  *                                                                          *
  * (https://sailsjs.com/config/session)                                     *
  *                                                                          *
  * > If you have disabled the "session" hook, then you can safely remove    *
  * > this section from your `config/env/production.js` file.                *
  *                                                                          *
  ***************************************************************************/
  session: {

    secret: 'fcea8be379be2dc12d47a5a40a0f7a89',

    adapter: 'connect-redis',
    url: 'redis://redis:6379/0',

    cookie: {
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    },

  },



  /**************************************************************************
  *                                                                          *
  * Set up Socket.io for your production environment.                        *
  *                                                                          *
  * (https://sailsjs.com/config/sockets)                                     *
  *                                                                          *
  * > If you have disabled the "sockets" hook, then you can safely remove    *
  * > this section from your `config/env/production.js` file.                *
  *                                                                          *
  ***************************************************************************/
  sockets: {

    /***************************************************************************
    *                                                                          *
    * Uncomment the `onlyAllowOrigins` whitelist below to configure which      *
    * "origins" are allowed to open socket connections to your Sails app.      *
    *                                                                          *
    * > Replace "https://example.com" with the URL of your production server.  *
    * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
    *                                                                          *
    ***************************************************************************/
    onlyAllowOrigins: ['http://report-type-mapper.hdap.gatech.edu', 'http://report-type-mapper.hdap.gatech.edu:3000'],


    /***************************************************************************
    *                                                                          *
    * If you are deploying a cluster of multiple servers and/or processes,     *
    * then uncomment the following lines.  This tells Socket.io about a Redis  *
    * server it can use to help it deliver broadcasted socket messages.        *
    *                                                                          *
    * > Be sure you have a compatible version of socket.io-redis installed!    *
    * > (See https://sailsjs.com/config/sockets for the latest version info)   *
    *                                                                          *
    * (https://sailsjs.com/docs/concepts/deployment/scaling)                   *
    *                                                                          *
    ***************************************************************************/
    // adapter: 'socket.io-redis',
    // url: 'redis://user:password@bigsquid.redistogo.com:9562/dbname',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_sockets__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/
    // ```
    //--------------------------------------------------------------------------

  },



  /**************************************************************************
  *                                                                         *
  * Set the production log level.                                           *
  *                                                                         *
  * (https://sailsjs.com/config/log)                                        *
  *                                                                         *
  ***************************************************************************/
  log: {
    level: 'debug'
  },



  http: {

    /***************************************************************************
    *                                                                          *
    * The number of milliseconds to cache static assets in production.         *
    * (the "max-age" to include in the "Cache-Control" response header)        *
    *                                                                          *
    ***************************************************************************/
    cache: 365.25 * 24 * 60 * 60 * 1000, // One year

    /***************************************************************************
    *                                                                          *
    * Proxy settings                                                           *
    *                                                                          *
    * If your app will be deployed behind a proxy/load balancer - for example, *
    * on a PaaS like Heroku - then uncomment the `trustProxy` setting below.   *
    * This tells Sails/Express how to interpret X-Forwarded headers.           *
    *                                                                          *
    * This setting is especially important if you are using secure cookies     *
    * (see the `cookies: secure` setting under `session` above) or if your app *
    * relies on knowing the original IP address that a request came from.      *
    *                                                                          *
    * (https://sailsjs.com/config/http)                                        *
    *                                                                          *
    ***************************************************************************/
    // trustProxy: true,

  },



  /**************************************************************************
  *                                                                         *
  * Lift the server on port 80.                                             *
  * (if deploying behind a proxy, or to a PaaS like Heroku or Deis, you     *
  * probably don't need to set a port here, because it is oftentimes        *
  * handled for you automatically.  If you are not sure if you need to set  *
  * this, just try deploying without setting it and see if it works.)       *
  *                                                                         *
  ***************************************************************************/
  // port: 80,



  /**************************************************************************
  *                                                                         *
  * Configure an SSL certificate                                            *
  *                                                                         *
  * For the safety of your users' data, you should use SSL in production.   *
  * ...But in many cases, you may not actually want to set it up _here_.    *
  *                                                                         *
  * Normally, this setting is only relevant when running a single-process   *
  * deployment, with no proxy/load balancer in the mix.  But if, on the     *
  * other hand, you are using a PaaS like Heroku, you'll want to set up     *
  * SSL in your load balancer settings (usually somewhere in your hosting   *
  * provider's dashboard-- not here.)                                       *
  *                                                                         *
  * > For more information about configuring SSL in Sails, see:             *
  * > https://sailsjs.com/config/*#?sailsconfigssl                          *
  *                                                                         *
  **************************************************************************/
  // ssl: undefined,



  /**************************************************************************
  *                                                                         *
  * Overrides for any custom configuration specifically for your app.       *
  * (for example, production API keys)                                      *
  *                                                                         *
  ***************************************************************************/
  custom: {

    // mailgunApiKey: 'key-prod_fake_bd32301385130a0bafe030c',
    // stripeSecret: 'sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking them in to version control, you might opt to
    // ||   set sensitive credentials like these using environment variables.
    //
    // For example:
    // ```
    // sails_custom__mailgunApiKey=key-prod_fake_bd32301385130a0bafe030c
    // sails_custom__stripeSecret=sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm
    // ```
    //--------------------------------------------------------------------------

  },



};
