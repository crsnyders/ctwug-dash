var transmissionConfig ={url:'/transmission/rpc/',host :'127.0.0.1',port:8080,username:'',password:''};
var eiskaltdcppConfig = {
url : '/eiskaltdc/',
host :'127.0.0.1',
port: 8080,
separator :',',
enc : 'UTF-8',
huburl : 'dchub.ctwug.za.net',
nick : '',
downloadDirectory : ''
}

var loginConfig = {username:'',password:''}

var rssConfig = {url : ''}

var restServer = {port :, defaultDownloadFolder: ""}

module.exports = {transmission: transmissionConfig, eiskaltdcpp:eiskaltdcppConfig,login :loginConfig, rss: rssConfig,rest: restServer};
//edit as needed and rename to config.js
