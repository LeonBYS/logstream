exports.creds = {
    returnURL: process.env.OAUTH_RETURN_URL,
    identityMetadata: 'https://login.microsoftonline.com/common/.well-known/openid-configuration', // For using Microsoft you should never need to change this.
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_SECRET, // if you are doing code or id_token code
    skipUserProfile: true, // for AzureAD should be set to true.
    responseType: 'id_token code', // for login only flows use id_token. For accessing resources use `id_token code`
    responseMode: 'query', // For login only flows we should have token passed back to us in a POST
    //scope: ['email', 'profile'] // additional scopes you may wish to pass
 };