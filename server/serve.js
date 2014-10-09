/*global Meteor, WebApp, console, process*/
'use strict';
var idx = 0;
var send = Meteor.npmRequire('send');

WebApp.connectHandlers.use(function(req, res /*, next*/ ) {
    sendFile(req, res, '/penken.jpg');
});

var sendFile = function(req, res, urlPath) {
    var lidx = idx++;
    console.log(lidx, 'requesting', urlPath);

    send(req, urlPath, {
        root: process.env.PWD + '/.uploads',
        maxAge: 20 * 60 * 1000
    }).pipe(res);
};
