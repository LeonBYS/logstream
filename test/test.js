'use strict'

var assert = require('assert');
var request = require('supertest');
var app = require('../server.js');

describe('test api', function() {
    it('response to /api/projects', (done) => {
        request(app).get('/api/projects').expect(200, done);
    });

    it('404 everything else', (done) => {
        request(app).get('/api/some-strange-thing').expect(404, done);
    });
});

