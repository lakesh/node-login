happy_count = 0;
sad_count = 0;
angry_count = 0;
sleepy_count = 0;

happy_set = false;
sad_set = false;
angry_set = false;
sleepy_set = false;

happy_send_count = 0;
sad_send_count = 0;
angry_send_count = 0;
sleepy_send_count = 0;

threshold = 10;

function reset_all() {
  happy_set = false;
  sad_set = false;
  angry_set = false;
  sleepy_set = false;

  happy_send_count = 0;
  sad_send_count = 0;
  angry_send_count = 0;
  sleepy_send_count = 0;
}

function css_reset_all() {
  $('.happy_pressed').attr('class','happy');
  $('.sad_pressed').attr('class','sad');
  $('.angry_pressed').attr('class','angry');
  $('.sleepy_pressed').attr('class','sleepy');
}


function send_happy() {
  $.ajax({
    url: '/feedback',
    type: 'POST',
    data: {"feedback":"1"},
    success: function (result) {
    }
  });
  if(happy_set == true && happy_send_count < threshold) {
    setTimeout(send_happy, 1000);
    happy_send_count = happy_send_count + 1;
  } else {
    happy_send_count = 0;  
    $('.happy_pressed').attr('class','happy');  
  }
}

function send_sad() {
  $.ajax({
    url: '/feedback',
    type: 'POST',
    data: {"feedback":"2"},
    success: function (result) {
    }
  });
  if(sad_set == true  && sad_send_count < threshold) {
    setTimeout(send_sad, 1000);
    sad_send_count = sad_send_count + 1;
  } else {
    sad_send_count = 0;  
    $('.sad_pressed').attr('class','sad');  
  }
}

function send_angry() {
  $.ajax({
    url: '/feedback',
    type: 'POST',
    data: {"feedback":"3"},
    success: function (result) {
    }
  });
  if(angry_set == true  && angry_send_count < threshold) {
    setTimeout(send_angry, 1000);
    angry_send_count = angry_send_count + 1;
  } else {
    angry_send_count = 0;  
    $('.angry_pressed').attr('class','angry');  
  }
}

function send_sleepy() {
  $.ajax({
    url: '/feedback',
    type: 'POST',
    data: {"feedback":"4"},
    success: function (result) {
    }
  });
  if(sleepy_set == true && sleepy_send_count < threshold) {
    setTimeout(send_sleepy, 1000);
    sleepy_send_count = sleepy_send_count + 1;
  } else {
    sleepy_send_count = 0;  
    $('.sleepy_pressed').attr('class','sleepy');  
  }
}


$(document).ready(function() {
	var dc = new DashboardController();


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
    reset_all();
    css_reset_all();
    $(this).attr('class','happy_pressed');
    happy_set = true;
    setTimeout(send_happy, 1000);
		/*$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"1"},
      success: function (result) {
        //alert("Your vote has been successfully posted");
      }
    });*/
	});
	
	$('.sad').click(function() { 
    reset_all();
    css_reset_all();
    $(this).attr('class','sad_pressed');
    sad_set = true;
    setTimeout(send_sad, 1000);
		/*$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"2"},
      success: function (result) {
        //alert("Your vote has been successfully posted");
      }
    });*/
	});
	
	$('.angry').click(function() {
    reset_all();
    css_reset_all();
    $(this).attr('class','angry_pressed');
    angry_set = true;
    setTimeout(send_angry, 1000);
		/*$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"3"},
      success: function (result) {
        //alert("Your vote has been successfully posted");
      }
    });*/
	});
	
	$('.sleepy').click(function() {
    reset_all();
    css_reset_all();
    $(this).attr('class','sleepy_pressed');
    sleepy_set = true;
    setTimeout(send_sleepy, 1000);
		/*$.ajax({
      url: '/feedback',
      type: 'POST',
      data: {"feedback":"4"},
      success: function (result) {
        //alert("Your vote has been successfully posted");
      }
    });*/
	});

	$('.reset').click(function() {
    reset_all();
    css_reset_all();
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

