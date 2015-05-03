
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
var margin = {top: 20, right: 20, bottom: 30, left: 50},
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

var bar_plot = function(file) {
	var svgContainer = d3.select("#Bar_plot").append("svg")
			.attr("x",700)
			.attr("y",200)
			.attr("width",  width + margin.left + margin.right+30)
		    .attr("height",  height + margin.top + margin.bottom+300)

	var svg = svgContainer
	  .append("g")
	    .attr("transform", "translate(" + 80 + "," + 200 + ")");

	var fileName = "data/test2.csv";

	function type(d) {
		  d.Count = +d.Count;
		  return d;
		}
	d3.csv(file, type, function(error, data) {

		x.domain([0,d3.max(data,function(d){return d.Count;})]);
		y.domain(data.map(function(d){return d.Topics;}));

		console.log(data);

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(bar_xAxis)
		    .append("text")
		    .attr("x",width+10)
		    .attr("y", 20)
		    .attr("dy", ".71em")
		    .style("text-anchor", "end")
		    .text("Frequency");

		svg.append("g")
		    .attr("class", "y axis")
		    .call(bar_yAxis)

		svg.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class","bar")
			.attr("x",2)
			.attr("width",function(d){return x(d.Count); })
			.attr("y",function(d){ return y(d.Topics); })
			.attr("height", y.rangeBand())

	});
};
var fileName = "data/test2.csv";
bar_plot(fileName);


// slider:
var slider2 = d3.select("#Date_slider").append("div")
	.attr("class","sliderContainer")
	.append("div")
	.attr("class","slider");

// set up an array to hold the months
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// lets be fancy for the demo and select the current month.
var activeMonth = new Date().getMonth();

// console.log(activeMonth);

$(".slider")
                    
    // activate the slider with options
    .slider({ 
        min: 0, 
        max: months.length-1, 
        value: activeMonth 
    })
                    
    // add pips with the labels set to "months"
    .slider("pips", {
        rest: "label",
        labels: months
    })
                    
    // and whenever the slider changes, lets echo out the month
    .on("slidechange", function(e,ui) {
        $("#labels-months-output").text( "You selected " + months[ui.value] + " (" + ui.value + ")");
    });
