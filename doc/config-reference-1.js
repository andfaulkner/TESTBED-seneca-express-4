/* global module, __dirname, process, require */
var path = require('path');
var _ = require('lodash');
var fs = require('fs');


/***************************************************************************************************
*
*   GET CONFIG VARIABLE VALUES FROM ENVIRONMENT VARIABLES (& PROVIDE DEFAULTS IF NONE PRESENT
*
*/
// DATABASE ========================================================================
var DB_HOST = process.env.DB_HOST || '127.0.0.1';
var REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
var ES_HOST = process.env.ES_HOST || '127.0.0.1';

var DB_NAME = process.env.DB_NAME || 'isight';
var DB_USER = process.env.DB_USER || 'postgres';
var AUDIT_DB_NAME = process.env.AUDIT_DB_NAME || 'isight_audit';

var ES_INDEX = process.env.ES_INDEX || DB_NAME;
var ES_IMPORT_ASYNC_LIMIT = process.env.ES_IMPORT_ASYNC_LIMIT
    ? parseInt(process.env.ES_IMPORT_ASYNC_LIMIT, 10)
    : 2000;
//==================================================================================

// MAIL ============================================================================
//TODO: default to false, leave true for now to prevent breaking envs
var MAIL_ENABLED = process.env.MAIL_ENBLED || true;
var MAIL_OVERRIDE_RECIP = process.env.MAIL_OVERRIDE_RECIP || null;
var MAIL_TRANSPORT = process.env.MAIL_TRANSPORT || null;
var MAIL_FROM = process.env.MAIL_FROM || 'info@isight.nodemail.com';
var MAIL_HOST = process.env.MAIL_HOST || '127.0.0.1';

var MAIL_DISABLE_DNS_VALID = process.env.MAIL_DISABLE_DNS_VALID
    ? true
    : false;

var MAILSRV_DOMAIN = process.env.MAILSRV_DOMAIN || 'isight.com';
//==================================================================================

// PATH ============================================================================
process.env.PLATFORM_PATH = process.env.PLATFORM_PATH || path.resolve(__dirname + '/../');

var defaultConfigPath = __dirname + '/../test/fixture';
var APP_CONFIG_PATH = process.env.APP_CONFIG_PATH || defaultConfigPath;
//==================================================================================

// LOGGING & TESTING ===============================================================
var SENECA_LOG_ENABLED = process.env.SENECA_LOG_ENABLED === 'true' ||
    process.env.SENECA_LOG_ENABLED === '1';

var LOG_LEVEL = process.env.LOG_LEVEL || 'info';

var QUNIT_ENABLED = process.env.QUNIT_ENABLED === 'true' || process.env.QUNIT_ENABLED === '1';
//==================================================================================

// LOGIN ===========================================================================

// deprecated, LOGINUSERNOPASSWORD is enforced to prevent managing Yellowfin user password
/*
var YF_LOGIN_NO_PASSWORD = process.env.YF_LOGIN_NO_PASSWORD === 'true' ||
    process.env.YF_LOGIN_NO_PASSWORD === '1';
 */

// Login is case sensitive if specified or if SAML login is case sensitive
// By default, both are case insensitive
var LOGIN_CASE_INSENSITIVE = (
    process.env.LOGIN_CASE_INSENSITIVE !== 'false' &&
    process.env.LOGIN_CASE_INSENSITIVE !== '0'
) && (
    process.env.SAMLID_CASE_INSENSITIVE !== 'false' &&
    process.env.SAMLID_CASE_INSENSITIVE !== '0'
);
//==================================================================================


var CSRF_ENABLED = !!process.env.CSRF || true;

var BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8000';

// QUARTZ-SCHEDULER ================================================================
var QUARTZ_PORT = process.env.QUARTZ_PORT || 8001;
var QUARTZ_CALLBACK = process.env.QUARTZ_CALLBACK || 'http://127.0.0.1:8001/api/job';
var QUARTZ_URL = process.env.QUARTZ_URL || 'http://127.0.0.1:8090/scheduler/api';
var QUARTZ_CONCURRENCY = process.env.QUARTZ_CONCURRENCY || 5;
var QUARTZ_MONITOR = process.env.QUARTZ_MONITOR;
//==================================================================================

// APP DYNAMICS ====================================================================
var APPDYN_HOST = process.env.APPDYN_HOST || false;
var APPDYN_PORT = process.env.APPDYN_PORT || 9500;
var APPDYN_SSL = process.env.APPDYN_SSL || false;
var APPDYN_USER = process.env.APPDYN_USER || '';
var APPDYN_KEY = process.env.APPDYN_KEY || '';
var APPDYN_NAME = process.env.APPDYN_NAME || 'My App';
var INSTANCE_NAME = process.env.INSTANCE_NAME || '';
var APPDYN_DEBUG = process.env.APPDYN_DEBUG || false;

/***************************************************************************************************/


/***************************************************************************************************
*
*   DATABASE CONFIG
*   Database connections that are re-used across the config.
*/
var redis = {
    host: REDIS_HOST,
    port: 6379
};

var elasticsearch = {
    connection: {
        host: ES_HOST + ':9200',
        index: ES_INDEX
    }
};

var postgresql = {
    host: DB_HOST,
    port: 5432,
    database: DB_NAME,
    name: DB_NAME,
    username: DB_USER,
    user: DB_USER,
    password: 'postgres'
};
/***************************************************************************************************/


//@Exports
module.exports = {
    appConfigPath: path.resolve(APP_CONFIG_PATH),
    qUnitEnabled: QUNIT_ENABLED,
    csrfEnabled: CSRF_ENABLED,

    //Logging & Debugging
    senecaLogEnabled: SENECA_LOG_ENABLED,
    cleanError: LOG_LEVEL,

    // baseUrl must NOT have a trailing /
    baseUrl: BASE_URL,

    // seneca service configurations
    filestore: {
        postgresql: postgresql
    },
    'elasticsearch': _.extend({}, elasticsearch, {
        pingTimeout: 5000
    }),
    'postgresql-store': postgresql,
    'redis-cache': {
        redis: redis
    },
    'login-sessions': {
        expiry: 86400,
        redis: redis
    },

    audit: {
        host: DB_HOST,
        port: 8125,
        file: 'audit.log',

        'elasticsearch': elasticsearch,
        postgresql: _.extend({}, postgresql, {
            database: AUDIT_DB_NAME,
            name: AUDIT_DB_NAME,
            map: {
                '-/audit/-': '*'
            }
        })
    },

    sequence: {
        redis: redis
    },
    soap: {
        port: 8004
    },

    'quartz-scheduler': {
        queue: {
            redis: redis
        },
        listen: QUARTZ_PORT,
        callbackURL: QUARTZ_CALLBACK,
        quartzURL: QUARTZ_URL,
        concurrency: QUARTZ_CONCURRENCY,
        monitor: QUARTZ_MONITOR || false
    },

    /***
     *   TODO:
     *   - Fill in proper settings as this hasn't been configured at all, just dummy data and
     *       disabled.
     *   NOTES:
     *   - Do not put 'tierName' as it gets overwriten in app-dynamics-helper.js and injects the
     *     service name there.
     *   - Do not change 'nodeName' attribute from this example as it is set to pull from environment
     *     variables.
     */
    appDynamics: {
        enabled: !!APPDYN_HOST,
        settings: {
            controllerHostName: APPDYN_HOST || '',
            controllerPort: APPDYN_PORT,
            controllerSslEnabled: !!APPDYN_SSL,
            accountName: APPDYN_USER,
            accountAccessKey: APPDYN_KEY,
            applicationName: APPDYN_NAME,
            nodeName: INSTANCE_NAME,
            debug: !!APPDYN_DEBUG
        }
    },

    'isight-auth': {
        enabled: !process.env.ISIGHT_AUTH_DISABLED,
        lockoutStore: {
            plugin: 'redis-store',
            options: redis
        },
        maxTries: parseInt(process.env.ISIGHT_AUTH_MAXTRIES, 10) || 3,
        expiry: parseInt(process.env.ISIGHT_AUTH_EXPIRY, 10) || 60 * 60, // one hour
        redirect: process.env.ISIGHT_AUTH_REDIRECT || '/login?locked_out',
        serviceName: process.env.ISIGHT_AUTH_SERVICENAME || 'isight'
    },
    /***
     *  Options for SAML authentication
     *
     *  NOTES:
     *    - both sections are optional; remove to skip service registration
     *    - if saml-auth is enabled then passport-saml strategy will be used
     *    - if saml-adfs-auth is enabled then passport-wsfed-saml2 strategy will be used
     *    - only one of saml-auth / saml-adfs-auth can be enabled
     */
    'saml-auth': {
        enabled: !!process.env.SAML_ENABLED,
        issuer: process.env.SAML_ISSUER || '127.0.0.1_no_ssl_8000',
        callbackUrl: process.env.SAML_CALLBACK_URL || '/auth/saml/callback',
        entryPoint: process.env.SAML_ENTRY_POINT ||
            'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
        cert: process.env.SAML_CERT,
        privateCert: process.env.SAML_PRIVATE_CERT,
        authnContext: process.env.SAML_AUTHN_CONTEXT
    },

    loginCaseInsensitive: LOGIN_CASE_INSENSITIVE,

    'saml-adfs-auth': {
        enabled: !!process.env.SAML_WSFED_IDENTITY_PROVIDER_URL,
        caseInsensitive: LOGIN_CASE_INSENSITIVE,

        // This object here is passed raw to passport-wsfed-saml2 plugin.
        pluginOptions: {
            protocol: process.env.SAML_WSFED_PROTOCOL || 'samlp',
            path: process.env.SAML_WSFED_PATH || '/auth/saml/callback',
            realm: process.env.SAML_WSFED_REALM, // 'urn:node:app',
            homeRealm: process.env.SAML_WSFED_HOME_REALM || '',
            identityProviderUrl: process.env.SAML_WSFED_IDENTITY_PROVIDER_URL,
            // https://sso.server/adfs/ls/IdpInitiatedSignon.aspx
            // HACK:
            // From Adam Jones
            // if a cert file is provided then use contents of the file
            // otherwise, use the SAML_WSFED_CERT environment variable
            cert: (process.env.SAML_WSFED_CERT_FILE
                ? fs.readFileSync(
                    process.env.SAML_WSFED_CERT_FILE,
                    process.env.SAML_CERT_ENCODING || 'utf8')
                : (process.env.SAML_WSFED_CERT))
        }
    },

    settings: {
        spec: {}
    },
    main: {
        port: 3333,
        'public': '/public'
    },

    mail: {
        enabled: MAIL_ENABLED,
        overwriteEmail: MAIL_OVERRIDE_RECIP,
        folder: APP_CONFIG_PATH + '/mail-templates',
        mail: {
            from: MAIL_FROM
        },
        transport: MAIL_TRANSPORT, // set to null if we're not passing config options - i.e. 127.0.0.1
        config: {
            host: MAIL_HOST
        }
    },

    'mail-server': {
        port: 2525,
        domain: MAILSRV_DOMAIN,
        banner: 'isight',
        secure: false,
        debug: false,
        disableDNSValidation: MAIL_DISABLE_DNS_VALID
    },

    'navex-server': {
        host: '127.0.0.1', //local test server
        username: 'none',
        password: 'none',
        protocol: 'ftp',
        port: 4444
    },

    'data-import': {
        asyncLimitIndex: ES_IMPORT_ASYNC_LIMIT,
        peoplesoft: {
            ftps: {
                protocol: process.env.PEOPLESOFT_FTP_PROTOCOL || 'sftp',
                host: process.env.PEOPLESOFT_FTP_HOST || '127.0.0.1',
                port: process.env.PEOPLESOFT_FTP_PORT || 22,
                username: process.env.PEOPLESOFT_FTP_USER || 'none',
                password: process.env.PEOPLESOFT_FTP_PASSWORD || 'none',
                cwd: process.env.PEOPLESOFT_FTP_CWD || '/',
                pattern: process.env.PEOPLESOFT_FTP_PATTERN || '*'
            },
            downloadDir: process.env.PEOPLESOFT_DOWNLOAD_DIR || '/tmp/peoplesoft/'
        }
    },

    /*
        The keys in the roles mapping connects the Yellowfin roles to the i-Sight application roles.
        Values in the array should contain the i-Sight roles that will be used within Yellowfin.
    */
    yellowfin: {
        // YF defaults to enabled
        enabled: process.env.YF_ENABLED !== 'false' && process.env.YF_ENABLED !== '0',
        // Use LOGINUSERNOPASSWORD method to obtain a token
        loginNoPassword: true, // Deprecated: YF_LOGIN_NO_PASSWORD,
        //Yellowfin URL
        url: process.env.YF_URL || 'http://127.0.0.1',
        // Web service url if separate
        urlSvc: process.env.YF_URL_SVC || process.env.YF_URL || 'http://127.0.0.1',
        //Basic SOAP information used to make requests
        requestConfig: {
            orgId: parseInt('' + process.env.YF_ORG_ID, 10) || 1,
            orgRef: process.env.YF_ORG || 'test',
            loginId: process.env.YF_USER || 'admin@yellowfin.com.au',
            password: process.env.YF_PASSWORD || 'CHANGE_ME'
        }
    },

    ftp: {
        host: '127.0.0.1', // required
        username: 'user', // required
        password: 'test', // required
        protocol: 'sftp', // optional, values : 'ftp', 'sftp', 'ftps',... default is 'ftp'
        port: 22, // optional,
        ftpPath: '',
        localPath: '/your/local/path/'
    }
};