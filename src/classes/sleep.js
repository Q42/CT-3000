module.exports = function(duration) {
	return function(){
		return new Promise(function(resolve, reject){
			setTimeout(function(){
				resolve();
			}, duration)
		});
	};
};
