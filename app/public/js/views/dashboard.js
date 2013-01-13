$(document).ready(function() {
	var dc = new DashboardController();
	$('.positive').click(function() {
		$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"1"},
      success: function (result) {
        alert("Your vote has been successfully posted");
      }
    });
	});
	
	$('.negative').click(function() {
		$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"0"},
      success: function (result) {
        alert("Your vote has been successfully posted");
      }
    });
	});
	
	var socket = io.connect('http://local.host:3000'); 
  
	//var data = {"start":1336594920000,"end":1336680960000,"step":120000,"names":["Stats_count2xx"],"values":[[15820.0101840488, 15899.7253668067, 16047.4476816121, 16225.0631734631, 16321.0429563369, 16477.289219996, 16372.5034462091, 16420.2024254868, 16499.3156905815, 16422.1844610347]]};
	var data = {};
	var dataA = {"start":1336594920000,"end":1336680960000,"step":120000,"names":["Stats_count2xx"],"values":[[15625.6826207297],[411.161376855185],[22.3887353437241],[22.3334186252455]]};
	
	var l1;
	socket.on('initial', function (stats) {
		data = stats.stats;
		dataA.start = data.start;
		dataA.end = data.end;
		dataA.step = data.step;
		l1 = new LineGraph({containerId: 'graph1', data: data});
	});

	/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 */
 if(parent.document.getElementsByTagName("iframe")[0]) {
	 parent.document.getElementsByTagName("iframe")[0].setAttribute('style', 'height: 650px !important');
 }


//var dataA = {"start":1336681080000,"end":1336681080000,"step":120000,"names":["Stats"],"values":[[15625.6826207297],[411.161376855185]]};


 // create graph now that we've added presentation config
setInterval(function() {
	socket.emit('update');
}, 2000);

socket.on('newstats', function(stats) {
	var newData = [];
	data.values.forEach(function(dataSeries, index) {
		// take the first value and move it to the end
		// and capture the value we're moving so we can send it to the graph as an update
		dataSeries.shift();
		dataSeries.push(stats.stats[0]);
		// put this value in newData as an array with 1 value
		newData[index] = [stats.stats[0]];
	})

	// we will reuse dataA each time
	dataA.values = newData;
	// increment time 1 step
	dataA.start = dataA.start + dataA.step;
	dataA.end = dataA.end + dataA.step; 
				
	l1.slideData(dataA);
	
});

	
});

