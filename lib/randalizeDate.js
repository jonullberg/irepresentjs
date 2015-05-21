'use strict';

module.exports = function formatDate(data) {
    var monthNames = [
    	'January', 
    	'February', 
    	'March', 
    	'April', 
    	'May', 
    	'June', 
    	'July', 
    	'August', 
    	'September', 
    	'October', 
    	'November', 
    	'December'
    ];
    var result = monthNames[data.getUTCMonth()] + 
    	' ' + data.getUTCDate() + 
    	' ' + data.getUTCFullYear();
    	
    return result;
};