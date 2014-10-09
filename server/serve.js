/*global Npm, WebApp, console, process*/
'use strict';
var Fiber = Npm.require('fibers');
var idx = 0;
var send = Meteor.npmRequire('send');

WebApp.connectHandlers.use(function(req, res, next) {
    var re = /^\/uploads((?:\/[\w_\-.%]+)+)(?:\?.*)?$/.exec(req.url);
    if (re) {
        Fiber(function() {
            sendFile(req, res, re[1]);
        }).run();
    } else {
        next();
    }
});

var sendFile = function(req, res, urlPath) {
    var lidx = idx++;

    console.log(lidx, 'requesting', urlPath);

    var maxAge = 20 * 60 * 1000;
    var mime = 'image/jpeg';

    send(req, urlPath, {
        root: process.env.PWD + '/.uploads',
        index: false,
        maxAge: maxAge,
        dotfiles: 'allow'
    }).on('error', function(err) {
        console.log(res._headers);
        console.error(err);
        res.writeHead(500);
        res.end();
    }).on('headers', function(res) {
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Content-Type', mime);
    }).on('directory', function() {
        console.error('Unexpected directory ' + urlPath);
        res.writeHead(500);
        res.end();
    }).pipe(res);
};
