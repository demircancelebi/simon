(function(){
	var blocks = $('.simon-block');
	blocks.on('mouseenter',function(e){
	//	console.log("mouse entered");
		$(this).on('mousemove',function(e){
		//	console.log(e.pageX);;
		})
	}).on('mouseleave', function(){
	//	console.log("mouse left");
	})
})();