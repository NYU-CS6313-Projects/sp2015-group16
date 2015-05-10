
// map part

var basic_choropleth = new Datamap({
			  element: document.getElementById("Map"),
			  projection: 'mercator',
			  fills: {
			    defaultFill: "#d9d9d9"
			  },
			  geographyConfig: {
			  	highlightFillColor: '#48CAF2'
			  }
			});
// var map = d3.select("#Map")
// map.append("object")

// 		.attr("type","image/svg+xml")
// 		.attr("data","data/Blank_Map_Pacific_World.svg")


// bar plot
var margin = {top: 70, right: 20, bottom: 30, left: 20},
    // width = 960 - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var y = d3.scale.ordinal()
	.rangeRoundBands([0,height], .1)

var x = d3.scale.linear()
	.range([0,width]);

var bar_xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var bar_yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

// var svgContainer = d3.select("#Bar_plot").append("svg")
// 		.attr("x",700)
// 		.attr("y",200)
// 		.attr("width",  width + margin.left + margin.right)
// 	    .attr("height",  height + margin.top + margin.bottom)

// var svg = svgContainer
//   .append("g")
//     .attr("transform", "translate(" + 50 + "," + margin.top + ")");



// function type(d) {
// 	  d.Count = +d.Count;
// 	  return d;
// 	}
var svgContainer = d3.select("#Bar_plot").append("svg")
		.attr("id","bar_container")
		.attr("width",  width + margin.left + margin.right)
	    .attr("height",  height + margin.top + margin.bottom)

var svg = svgContainer
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top+ ")");

var fileName = "data/bar_chart_fillna.csv";

var parseDate = d3.time.format("%Y-%m-%d").parse;

function type(d) {
		  d.Count = +d.Count;
		  return d;
		}


var bar_plot = function(file,index) {
	console.log(height)
	d3.csv(file, type, function(error, data) {
		console.log(height)
		
		Data = data;
		data = data[index];
        temp = [];


		temp.push({Count:data.topic1, Topics:"political"});
		temp.push({Count:data.topic2, Topics:"conflit"});
		temp.push({Count:data.topic3, Topics:"population displacement"});
		temp.push({Count:data.topic4, Topics:"disaster"});
		temp.push({Count:data.topic5, Topics:"food insecurity"});
		temp.push({Count:data.topic6, Topics:"disease"});
		temp.push({Count:data.topic7, Topics:"water insecurity"});
		temp.push({Count:data.topic8, Topics:"fund"});



		x.domain([0,30]);

		y.domain(["political", "conflit", "population displacement",
			"disaster","food insecurity","disease","water insecurity","fund"]);

		d3.select("#bar_container").remove();

		var svgContainer = d3.select("#Bar_plot").append("svg")
				.attr("id","bar_container")
				.attr("width",  width + margin.left + margin.right)
			    .attr("height",  height + margin.top + margin.bottom)

		var svg = svgContainer
			  	.append("g")
			    .attr("transform", "translate(" + 150 + "," + margin.top+ ")");


		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + 200 + ")")
			.call(bar_xAxis)
			.append("text")
		    .attr("x",width+10)
		    .attr("y", 20)
		    .attr("dy", ".50em")
		    .style("text-anchor", "end")
		    .text("Frequency");

		svg.append("g")
		    .attr("class", "y axis")
		    .call(bar_yAxis)
		    .append("text")
		    .attr("x",-20)
		    .attr("y",-10)
		    .style("text-anchor","end")
		    .text("Topic")

		svg.selectAll(".bar")
			.data(temp)
			.enter().append("rect")
			.attr("class","bar")
			.attr("x",2)
			.attr("width",function(d){return x(d.Count); })
			.attr("y",function(d){ return y(d.Topics); })
			.attr("height", y.rangeBand())

	});
};

bar_plot(fileName,0);


//slider
formatDate = d3.time.format("%Y-%m-%d");


var margin2 = {top:50,right:70,bottom:50,left:50},
	width2 = 1100 - margin2.left-margin2.right,
	height2 = 150 - margin2.bottom - margin2.top;

// scale function
var timeScale = d3.time.scale()
		.domain([new Date('2013-06-25'), new Date('2015-01-01')])
		.range([0, width2])
		.clamp(true);

var startValue = timeScale(new Date('2013-06-25'));
startingValue = new Date('2013-06-26');


var brush = d3.svg.brush()
			.x(timeScale)
			.extent([startingValue,startingValue])
			.on("brush",brushed);


var svg = d3.select("#Date_slider").append("svg")
	        .attr("width", width2 + margin2.left + margin2.right)
	        .attr("height", height2 + margin2.top + margin2.bottom)
	        .append("g")
	        // classic transform to position g
	        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

svg.append("g")
			.attr("class", "x axis")
			// put in middle of screen
			.attr("transform", "translate(0," + height2 / 2 + ")")
			// inroduce axis
			.call(d3.svg.axis()
				.scale(timeScale)
				.orient("bottom")
				.tickFormat(function(d) {
					return formatDate(d);
			})
			.tickSize(0)
			.tickPadding(12)
			.tickValues([timeScale.domain()[0], timeScale.domain()[1]]))
			.select(".domain")
			.select(function() {
				// console.log(this);
				return this.parentNode.appendChild(this.cloneNode(true));
			})
			.attr("class", "halo");


var slider = svg.append("g")
			.attr("class", "slider")
			.call(brush);

slider.selectAll(".extent,.resize")
			.remove();

slider.select(".background")
			.attr("height", height2);

var handle = slider.append("g")
			.attr("class", "handle")

handle.append("path")
			.attr("transform", "translate(0," + height2 / 2 + ")")
			.attr("d", "M 0 -20 V 20")

handle.append('text')
			.text(startingValue)
			.attr("transform", "translate(" + (-18) + " ," + (height2 / 2 - 25) + ")");


slider.call(brush.event)

function brushed() {
	var value = brush.extent()[0];

	if (d3.event.sourceEvent) { // not a programmatic event
		value = timeScale.invert(d3.mouse(this)[0]);
		brush.extent([value, value]);
    }
      //console.log(Math.round((brush.extent()[0] - timeScale.domain()[0]) / 1000 /60/60/24));
	var index = (Math.round((brush.extent()[0] - timeScale.domain()[0]) / 1000 /60/60/24));
	bar_plot(fileName, index);
    handle.attr("transform", "translate(" + timeScale(value) + ",0)");
    handle.select('text').text(formatDate(value));
}

// // slider:
// var slider2 = d3.select("#Date_slider").append("div")
// 	.attr("class","sliderContainer")
// 	.append("div")
// 	.attr("class","slider");

// // set up an array to hold the months
// var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// // lets be fancy for the demo and select the current month.
// var activeMonth = new Date().getMonth();

// // console.log(activeMonth);

// $(".slider")
                    
//     // activate the slider with options
//     .slider({ 
//         min: 0, 
//         max: months.length-1, 
//         value: activeMonth 
//     })
                    
//     // add pips with the labels set to "months"
//     .slider("pips", {
//         rest: "label",
//         labels: months
//     })
                    
//     // and whenever the slider changes, lets echo out the month
//     .on("slidechange", function(e,ui) {
//         $("#labels-months-output").text( "You selected " + months[ui.value] + " (" + ui.value + ")");
//     });
