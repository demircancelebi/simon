(function(){
	var Simon = {
		init:function(){
			this.simonSays = $('.simon-says');
			this.circle1 = $('.circle-1');
			this.circle2 = $('.circle-2');
			this.circle3 = $('.circle-3');
			this.circle4 = $('.circle-4');
			this.circles = [Simon.circle1,Simon.circle2,Simon.circle3,Simon.circle4];
			
			Simon.simonSaysHandler("Start the simon");

			this.array =[];
			this.shortArray =[];
			this.playerArray = [];
			this.roundNumber = 0;
			this.clickTime = 200;
			this.waitTime = 600;
			this.gameOn = false;
			this.gameOver = false;
			this.events();
		},

		events:function(){
			this.simonSays.on('click', this.start);
		},

		start:function(){
			if(!Simon.gameOn){
				if(!Simon.gameOver){
					$('*[class^="circle"]').on('click', Simon.checkPlayer);
				}else{
					$('*[class^="circle"]').off('click', Simon.checkPlayer);
				}
				$.each(Simon.circles, Simon._onCircleClick);
				Simon.gameOn = true;
				Simon.newRound();
			}
		},

		simonSaysHandler: function(arg){
			var ssh = Simon.simonSays.height();
			if(Array.isArray(arg)){
				var text = arg[Math.floor(Math.random()*arg.length)];
			}else{
				var text = arg;
			}
			var p = Simon.simonSays.html("<p>" + text + "</p>").children('p');
			var ph = p.height();
			var mt = (ssh-ph)/2;
			p.animate({
				"marginTop" : mt
			})
		},

		newRound: function(){
			Simon.delayTime = this.clickTime + 200;
			Simon.roundNumber++;
			Simon.simonSaysHandler('round');
			setTimeout(function(){
				Simon.simonSaysHandler(Simon.roundNumber);
			},Simon.waitTime);
			setTimeout(function(){
				Simon.computerPlays();
			},Simon.waitTime * 2)
			setTimeout(function(){
				Simon._onComputerFinished();
			},Simon.waitTime * 2 + Simon.delayTime * Simon.roundNumber);
		},

		computerPlays: function(){
			Simon.addRandomNumberToArray(Simon.array);
			Simon.shortArray = Simon.arrayShortener(Simon.array);	
			Simon.simulateClicks(Simon.array);
		},

		simulateClicks: function(arr){
			Simon.delayTime = this.clickTime + 200;
			$.each(arr, function(index, value){
				setTimeout(function(index){
					Simon.simulateClick(value);
				},Simon.delayTime * index);
			});		
		},

		simulateClick: function(el){
			el.trigger('mousedown');
			setTimeout(function(){
				el.trigger('mouseup');
			},Simon.clickTime)
		},

		arrayShortener: function(arr){
			var	i = 0,
				shortArray = [];
			$.map( arr , function(n){
				var item = n.selector.replace('.circle-','');
				shortArray.push(item);
			});	
			return shortArray;
		},
		
		addRandomNumberToArray: function(arr){
			return arr.push(Simon.circles[Math.floor(Math.random()*4)]);
		},

		checkPlayer: function(){			
			if(Simon.playerArray.length < Simon.shortArray.length){
				Simon._onRightGuess.call(this);
				if(Simon.playerArray[Simon.playerArray.length-1] != Simon.shortArray[Simon.playerArray.length-1]){
					Simon._onWrongGuess();
				}
			}
			if(Simon.areArraysEqual(Simon.playerArray, Simon.shortArray)){
				Simon._onLevelComplete();
			}
		},

		_onRightGuess: function(){
			var item = $(this).attr('class').replace('circle-','');
			Simon.playerArray.push(item);
		},

		_onWrongGuess: function(){
			if(!Simon.gameOver){
				Simon.playerDies();
			}
		},

		_onLevelComplete: function(){
			Simon.simonSaysHandler(["well done","good job","congrats!","master!","keep goin'","you rock"])
			setTimeout(function(){
				Simon.playerArray = [];
				Simon.newRound();
				item = '';
			},Simon.waitTime * 2);
		},

		_onComputerFinished: function(){
			Simon.simonSaysHandler(["your turn","play now"]);
		},

		_onCircleClick: function(){
			$(this).on('mousedown', function(){
				var nth = $(this).attr('class').replace('circle-','');
					MIDI.noteOn(60, nth*2 + 73, 50, 0);
					$(this).addClass('active');
			}).on('mouseup' , function(){
				$(this).removeClass('active');
			});
		},

		areArraysEqual: function(a1,a2) {
		    return JSON.stringify(a1)==JSON.stringify(a2);
		},

		playerDies: function(){
			var score = Simon.shortArray.length - 1;
			Simon.simonSaysHandler('Score: ' + score);
			Simon.gameOver = true;
		}
	}
	MIDI.loadPlugin(function() {
		Simon.init();
	});
})();
























