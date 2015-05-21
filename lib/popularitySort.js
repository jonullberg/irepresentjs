'use strict';

// Descending order
function compareVotesD (a, b) {
	return b.votes_total - a.votes_total;
}

// Ascending order
function compareVotesA (a, b) {
	return a.votes_total - b.votes_total;
}

// Bubble sort (O^2) based on javascript-algorithms by mgechev on GitHub
module.exports = function (arr, sort) {
	var cmp = compareVotesD;
	if(sort === 1) {
		cmp = compareVotesA;
	}

	var temp;
	for(var i = 0; i < arr.length; i++) {
		for(var j = i; j > 0; j--) {
			if(cmp(arr[j], arr[j - 1]) < 0) {
				temp = arr[j];
				arr[j] = arr[j - 1];
				arr[j - 1] = temp;
			}
		}
	}
	return arr;
};