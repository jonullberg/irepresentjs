'use strict';

var sort = require('../lib/popularitySort');
var chai = require('chai');
var expect = chai.expect;

describe('sort functions', function() {
	describe('inputs', function() {
		it('should take an array', function() {
			var array = [];
			sort(array, sort);
			expect(array).to.eql([]);
		});
		
		it('should like sort stuff "decrementingly", you know?', function() {
			var arr = [{votes_total: 234}, 
								 {votes_total: 3344}, 
								 {votes_total: 933}];
			var newArr = sort(arr);
			expect(arr[0]).to.eql({votes_total: 3344});
		});

		it('should return an array', function() {
			var arr = [];
			var newArr = sort(arr);
			expect(arr).to.eql([]);
		});
	});
});