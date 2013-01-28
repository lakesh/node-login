$(document).ready(function() {
	var dc = new DashboardController();
  happy_count = 0;
  sad_count = 0;
  angry_count = 0;
  sleepy_count = 0;

	$('.positive').click(function() {
		$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"1"},
      success: function (result) {
        //alert("Your vote has been successfully posted");
      }
    });
	});
	
	$('.negative').click(function() {
		$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"0"},
      success: function (result) {
        //alert("Your vote has been successfully posted");
      }
    });
	});
	
	$('.happy').click(function() {
    $(this).attr('class','happy_pressed');
		$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"1"},
      success: function (result) {
        //alert("Your vote has been successfully posted");
      }
    });
	});
	
	$('.sad').click(function() { 
    $(this).attr('class','sad_pressed');
		$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"2"},
      success: function (result) {
        //alert("Your vote has been successfully posted");
      }
    });
	});
	
	$('.angry').click(function() {
    $(this).attr('class','angry_pressed');
		$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"3"},
      success: function (result) {
        //alert("Your vote has been successfully posted");
      }
    });
	});
	
	$('.sleepy').click(function() {
    $(this).attr('class','sleepy_pressed');
		$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"4"},
      success: function (result) {
        //alert("Your vote has been successfully posted");
      }
    });
	});
	
	var socket = io.connect('http://local.host:3000'); 
  	
	socket.on('initial', function (stats) {
    happy_count = stats.stats[0];
    sad_count = stats.stats[1];
    angry_count = stats.stats[2];
    sleepy_count = stats.stats[3];   
    $('span.happy').html(happy_count);         
    $('span.sad').html(sad_count);         
    $('span.angry').html(angry_count);         
    $('span.sleepy').html(sleepy_count); 
    drawChart();                  
	});

  setInterval(function() {
  	socket.emit('update');
  }, 2000);

  socket.on('newstats', function(stats) {
    happy_count = stats.stats[0];
    sad_count = stats.stats[1];
    angry_count = stats.stats[2];
    sleepy_count = stats.stats[3];
    $('span.happy').html(happy_count);         
    $('span.sad').html(sad_count);         
    $('span.angry').html(angry_count);         
    $('span.sleepy').html(sleepy_count);
    drawChart();
  });


});

setTimeout(function()
{
  google.load('visualization', '1', {'callback':'', 'packages':['imagechart']})
  //google.setOnLoadCallback(drawChart);
}, 1);



function drawChart() {

  total = happy_count + sad_count + angry_count + sleepy_count;
  happy_norm = Math.round(happy_count / total * 100);
  sad_norm = Math.round(sad_count / total * 100);
  angry_norm = Math.round(angry_count / total * 100);
  sleepy_norm = 100 - (happy_norm + sad_norm + angry_norm);

	var data = google.visualization.arrayToDataTable([
    ['Name', 'Percentage', 'Smokes'],
    ['Happy', happy_norm, true],
    ['Sad', sad_norm, true],
    ['Angry', angry_norm, false],
    ['Sleepy', sleepy_norm, true]
  ]);

  var options = {};

  // 'bhg' is a horizontal grouped bar chart in the Google Chart API.
  // The grouping is irrelevant here since there is only one numeric column.
  options.cht = 'bhg';

  // Add a data range.
  var min = 0;
  var max = 100;
  options.chds = min + ',' + max;

  // Now add data point labels at the end of each bar.

  // Add meters suffix to the labels.
  var meters = 'N** %';

  // Draw labels in pink.
  var color = 'ff3399';

  // Google Chart API needs to know which column to draw the labels on.
  // Here we have one labels column and one data column.
  // The Chart API doesn't see the label column.  From its point of view,
  // the data column is column 0.
  var index = 0;

  // -1 tells Google Chart API to draw a label on all bars.
  var allbars = -1;

  // 10 pixels font size for the labels.
  var fontSize = 10;

  // Priority is not so important here, but Google Chart API requires it.
  var priority = 0;

  options.chm = [meters, color, index, allbars, fontSize, priority].join(',');

  // Create and draw the visualization.
  new google.visualization.ImageChart(document.getElementById('chart_div')).
    draw(data, options);

}

