import Parse from 'parse/dist/parse.min.js';

const PARSE_APP_ID = "ZAwd6P087y93SBypSSz7haBCHdhTcxhDUZFT7swl";
const PARSE_JS_KEY = "YZKzmPahklFB9j3nSRYOWdi5G790k8jO7o7u5dbp";

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default Parse;