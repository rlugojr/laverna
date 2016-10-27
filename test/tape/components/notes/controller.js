/**
 * Test components/notes/controller.js
 * @file
 */
import test from 'tape';
import sinon from 'sinon';
import _ from 'underscore';
import controller from '../../../../app/scripts/components/notes/controller';
import List from '../../../../app/scripts/components/notes/list/Controller';

let sand;
test('notes/Controller: before()', t => {
    sand = sinon.sandbox.create();
    t.end();
});

test('notes/Controller: get options', t => {
    t.equal(typeof controller.options, 'object', 'is an object');
    t.equal(_.isEmpty(controller.options), true,
        'returns an empty object for default');
    t.end();
});

test('notes/Controller: set options', t => {
    t.equal(controller._argsOld, undefined, 'filter backup is empty for default');

    controller._args   = {test: 'id'};
    controller.options = ['test-db', 'tag', 'my-tag', '2', 'my-note-id'];

    t.deepEqual(controller._argsOld, {test: 'id'}, 'updates the filter backup');
    t.deepEqual(controller.options, controller._args,
        'uses _args property');
    t.deepEqual(controller._args, {
        profileId : 'test-db',
        filter    : 'tag',
        query     : 'my-tag',
        page      : '2',
        id        : 'my-note-id',
    }, 'creates a correct filter object');

    t.end();
});

test('notes/Controller: showNotes()', t => {
    const init    = sand.stub(List.prototype, 'init');
    const oldArgs = _.clone(controller._args);
    const changed = sand.stub(controller, 'filterHasChanged');

    changed.returns(false);
    controller.showNotes();
    t.equal(init.notCalled, true,
        'does not render notes sidebar if filter parameters are the same');

    changed.returns(true);
    controller.showNotes('showNotes');
    t.notDeepEqual(controller.options, oldArgs, 'changes filter options');
    t.equal(init.called, true, 'initializes list controller');

    sand.restore();
    t.end();
});

test('notes/Controller: filterHasChanged()', t => {
    controller._args    = {};
    controller._argsOld = {};
    t.equal(controller.filterHasChanged(), false,
        'returns false if filters did not change');

    controller._args.id = 'my-note';
    t.equal(controller.filterHasChanged(), false,
        'returns false if only ID changed');

    controller._argsOld = undefined;
    t.equal(controller.filterHasChanged(), false,
        'returns false if _argsOld property does not exist');

    controller._args.filter = 'notebook';
    t.equal(controller.filterHasChanged(), true,
        'returns true if filter parameters changed');


    t.end();
});

test('notes/Controller: showNote()', t => {
    const showNotes = sand.stub(controller, 'showNotes');

    controller.showNote();
    t.equal(showNotes.called, true, 'shows the sidebar');

    sand.restore();
    t.end();
});
