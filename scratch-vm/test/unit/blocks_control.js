var test = require('tap').test;
var Control = require('../../src/blocks/scratch3_control');
var Runtime = require('../../src/engine/runtime');

test('getPrimitives', function (t) {
    var rt = new Runtime();
    var c = new Control(rt);
    t.type(c.getPrimitives(), 'object');
    t.end();
});

test('repeat', function (t) {
    var rt = new Runtime();
    var c = new Control(rt);

    // Test harness (mocks `util`)
    var i = 0;
    var repeat = 10;
    var util = {
        stackFrame: Object.create(null),
        startBranch: function () {
            i++;
            c.repeat({TIMES: repeat}, util);
        }
    };

    // Execute test
    c.repeat({TIMES: 10}, util);
    t.strictEqual(util.stackFrame.loopCounter, -1);
    t.strictEqual(i, repeat);
    t.end();
});

test('repeatUntil', function (t) {
    var rt = new Runtime();
    var c = new Control(rt);

    // Test harness (mocks `util`)
    var i = 0;
    var repeat = 10;
    var util = {
        stackFrame: Object.create(null),
        startBranch: function () {
            i++;
            c.repeatUntil({CONDITION: (i === repeat)}, util);
        }
    };

    // Execute test
    c.repeatUntil({CONDITION: (i === repeat)}, util);
    t.strictEqual(i, repeat);
    t.end();
});

test('forever', function (t) {
    var rt = new Runtime();
    var c = new Control(rt);

    // Test harness (mocks `util`)
    var i = 0;
    var util = {
        startBranch: function (branchNum, isLoop) {
            i++;
            t.strictEqual(branchNum, 1);
            t.strictEqual(isLoop, true);
        }
    };

    // Execute test
    c.forever(null, util);
    t.strictEqual(i, 1);
    t.end();
});

test('if / ifElse', function (t) {
    var rt = new Runtime();
    var c = new Control(rt);

    // Test harness (mocks `util`)
    var i = 0;
    var util = {
        startBranch: function (branchNum) {
            i += branchNum;
        }
    };

    // Execute test
    c.if({CONDITION: true}, util);
    t.strictEqual(i, 1);
    c.if({CONDITION: false}, util);
    t.strictEqual(i, 1);
    c.ifElse({CONDITION: true}, util);
    t.strictEqual(i, 2);
    c.ifElse({CONDITION: false}, util);
    t.strictEqual(i, 4);
    t.end();
});

test('stop', function (t) {
    var rt = new Runtime();
    var c = new Control(rt);

    // Test harness (mocks `util`)
    var state = {
        stopAll: 0,
        stopOtherTargetThreads: 0,
        stopThread: 0
    };
    var util = {
        stopAll: function () {
            state.stopAll++;
        },
        stopOtherTargetThreads: function () {
            state.stopOtherTargetThreads++;
        },
        stopThread: function () {
            state.stopThread++;
        }
    };

    // Execute test
    c.stop({STOP_OPTION: 'all'}, util);
    c.stop({STOP_OPTION: 'other scripts in sprite'}, util);
    c.stop({STOP_OPTION: 'other scripts in stage'}, util);
    c.stop({STOP_OPTION: 'this script'}, util);
    t.strictEqual(state.stopAll, 1);
    t.strictEqual(state.stopOtherTargetThreads, 2);
    t.strictEqual(state.stopThread, 1);
    t.end();
});
