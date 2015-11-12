/*jshint node:true, mocha:true*/

/**
 * @author pmeijer / https://github.com/pmeijer
 */

var testFixture = require('../../_globals.js');

describe('Worker Requests', function () {
    'use strict';

    var gmeConfig = testFixture.getGmeConfig(),
        Q = testFixture.Q,
        expect = testFixture.expect,
        BlobFSBackend = require('./../../../src/server/middleware/blob/BlobFSBackend'),
        BlobRunPluginClient = require('./../../../src/server/middleware/blob/BlobRunPluginClient'),
        logger,
        WorkerRequests = require('./../../../src/server/worker/workerrequests'),
        wr,
        blobClient;

    before(function () {
        var blobBackend = new BlobFSBackend(gmeConfig);
        blobClient = new BlobRunPluginClient(blobBackend);
        logger = testFixture.logger.fork('Worker_Requests');
        wr = new WorkerRequests(logger, gmeConfig);
    });

    beforeEach(function (done) {
        testFixture.rimraf(gmeConfig.blob.fsDir, done);
    });

    it('should _addZippedExportToBlob when using compressed DEFLATE', function (done) {
        var metaHash = 'b1f1f11201951f23b0d0c86d6c298389b3f8f0c0';
        wr._addZippedExportToBlob('./test/server/worker/workerrequests/exported.zip', blobClient)
            .then(function (/*projectStr*/) {
                return Q.ninvoke(blobClient, 'getMetadata', metaHash);
            })
            .then(function (metadata) {
                expect(metadata.name).to.equal('a.txt');
            })
            .nodeify(done);
    });

    it('should _addZippedExportToBlob when using no compression (as exported)', function (done) {
        var metaHash = 'b1f1f11201951f23b0d0c86d6c298389b3f8f0c0';
        wr._addZippedExportToBlob('./test/server/worker/workerrequests/asExported.zip', blobClient)
            .then(function (/*projectStr*/) {
                return Q.ninvoke(blobClient, 'getMetadata', metaHash);
            })
            .then(function (metadata) {
                expect(metadata.name).to.equal('a.txt');
            })
            .nodeify(done);
    });
});