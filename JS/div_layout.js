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

//TODO:  add grid line http://www.d3noob.org/2013/01/adding-grid-lines-to-d3js-graph.html


// bar plot
var margin = {top: 70, right: 20, bottom: 30, left: 20},
    // width = 960 - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;
    width = 240 - margin.left - margin.right,
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
	    .attr("transform", "translate(" + margin.left + "," + 200+ ")");

var fileName = "data/bar_chart_fillna.csv";

var parseDate = d3.time.format("%Y-%m-%d").parse;

function type(d) {
		  d.Count = +d.Count;
		  return d;
		}


var bar_plot = function(file,index) {

	d3.csv(file, type, function(error, data) {

		
		Data = data;
		data = data[index];
        temp = [];


		temp.push({Count:data.topic1, File:"topic1", Topics:"Political"});
		temp.push({Count:data.topic2, File:"topic2", Topics:"Conflit"});
		temp.push({Count:data.topic3, File:"topic3", Topics:"Population"});
		temp.push({Count:data.topic4, File:"topic4", Topics:"Disaster"});
		temp.push({Count:data.topic5, File:"topic5", Topics:"Food Insecurity"});
		temp.push({Count:data.topic6, File:"topic6", Topics:"Disease"});
		temp.push({Count:data.topic7, File:"topic7", Topics:"Water Insecurity"});
		temp.push({Count:data.topic8, File:"topic8", Topics:"Fund"});



		x.domain([0,40]);

		y.domain(["Political", "Conflit", "Population",
			"Disaster","Food Insecurity","Disease","Water Insecurity","Fund"]);

		d3.select("#bar_container").remove();

		var svgContainer = d3.select("#Bar_plot").append("svg")
				.attr("id","bar_container")
				.attr("width",  width + margin.left + margin.right)
			    .attr("height",  height + margin.top + margin.bottom)

		var svg = svgContainer
			  	.append("g")
			    .attr("transform", "translate(" + 150 + "," + 200+ ")");


		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + 200 + ")")
			.call(bar_xAxis)
			.append("text")
		    .attr("x",200)
		    .attr("y", 30)
		    .attr("dy", ".50em")
		    .style("text-anchor", "end")
		    .text("Frequency");

		svg.append("g")
		    .attr("class", "y axis")
		    .call(bar_yAxis)
		    .append("text")
		    .attr("x",0)
		    .attr("y",-10)
		    .style("text-anchor","end")
		    .text("Topic")

		svg.selectAll(".bar")
			.data(temp)
			.enter().append("rect")
			.attr("class","bar")
			.attr("id",function(d){return d.File})
			.attr("x",2)
			.attr("width",function(d){return x(d.Count); })
			.attr("y",function(d){ return y(d.Topics); })
			.attr("height", y.rangeBand())
			.on("click",function(){	
					$("g.bubbles").remove();
					var map = d3.select(".datamaps-subunits").append("g")
						.attr("class","bubbles");

					var orderedColumns = [];
					var Bfile_name = this.getAttribute("id");
					var Bfile_path = "data/topic/"+Bfile_name+".csv";
					console.log(Bfile_path);
					d3.csv(Bfile_path,function(data){
					    var first = data[0];
					    // get columns

					    for ( var mug in first ){
					      if ( mug != "Country" && mug != "Code"){
					        orderedColumns.push(mug);
					      }
					    }
					    
					    orderedColumns.sort(sortColumns);
					    // draw city points 
					    for ( var i in data ){

						    try {
						    	var projected = getCentroid(d3.select("."+data[i].Code));
						    }
						    catch(err) {
						    	// console.log(data[i].Country);
						    	var projected = [0,0];
						    }
						    // console.log(data[i])
						    map.append("circle")
						        .datum(data[i])
						        .attr("cx",projected[0])
						        .attr("cy",projected[1])
						        .attr("class",Bfile_name)
						        .attr("id",data[i].Country+"-"+data[i].Code)
						        .attr("r",1)
						        .attr("vector-effect","non-scaling-stroke")
						        .on("click",function(){
						        	console.log(this.id);
						        	$(".currentGraph").remove();
						        	var temp = this.getAttribute("id").split("-");
							        var countryCode = temp[1]
							        var countryName = temp[0];
							        var dir = "data/countries/";
							        $('#Cname').text(countryName);
							        var line_file = dir+countryCode+".csv";
							        drawline(line_file);
						        })
					    } // end of for loop
				});			
				})

	});
};

bar_plot(fileName,0);





function getCentroid(selection) {
    // get the DOM element from a D3 selection
    // you could also use "this" inside .each()
    var element = selection.node(),
        // use the native SVG interface to get the bounding box
        bbox = element.getBBox();
    // return the center of the bounding box
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
};


function sortColumns(a,b){
	// [month,year]
	a = a.slice(0,10);
	b = b.slice(0,10);
	var monthA = a.split("-"),
	  	monthB = b.split("-");
	// Y2K !!!
	// 99 becomes 9; 2000+ becomes 11+
	var numA = 10000*parseInt(monthA[0])+100*parseInt(monthA[1])+parseInt(monthA[2]);
	var numB = 10000*parseInt(monthB[0])+100*parseInt(monthB[1])+parseInt(monthB[2]);

	// turn year+month into a sortable number
	return numA-numB;
}


function sortColumns2(a,b) {
	return a-b
}



// slider vs map
var map = d3.select(".datamaps-subunits").append("g")
	.attr("class","bubbles");

var orderedColumns = [];

d3.csv("data/topic/topic2.csv",function(data){
    var first = data[0];
    // get columns

    for ( var mug in first ){
      if ( mug != "Country" && mug != "Code"){
        orderedColumns.push(mug);
      }
    }
    
    orderedColumns.sort(sortColumns);
    // console.log(orderedColumns);
    // draw city points 
    for ( var i in data ){

	    try {
	    	var projected = getCentroid(d3.select("."+data[i].Code));
	    }
	    catch(err) {
	    	// console.log(data[i].Country);
	    	var projected = [0,0];
	    }
	    // console.log(data[i])
	    map.append("circle")
	        .datum(data[i])
	        .attr("cx",projected[0])
	        .attr("cy",projected[1])
	        .attr("class","topic2")
	        .attr("id",data[i].Country+"-"+data[i].Code)
	        .attr("r",1)
	        .attr("vector-effect","non-scaling-stroke")
	        .on("click",function(){
	        	console.log(this.id);
	        	$(".currentGraph").remove();
	        	var temp = this.getAttribute("id").split("-");
		        var countryCode = temp[1]
		        var countryName = temp[0];
		        var dir = "data/countries/";
		        $('#Cname').text(countryName);
		        var line_file = dir+countryCode+".csv";
		        drawline(line_file);
	        })
	        // .on("mousemove",function(d){
	        //   hoverData = d;
	        //   setProbeContent(d);
	        //   probe
	        //     .style( {
	        //       "display" : "block",
	        //       "top" : (d3.event.pageY - 80) + "px",
	        //       "left" : (d3.event.pageX + 10) + "px"
	        //     })
	        // })
	        // .on("mouseout",function(){
	        //   hoverData = null;
	        //   probe.style("display","none");
	        // })
    } // end of for loop


});

$('circle').click(function(){
        console.log(this.class)
        $(".currentGraph").remove();
        var countryCode = this.getAttribute("class").slice(-3);
        var dir = "data/countries/";
        $('#Cname').text(countryCode);
        var line_file = dir+countryCode+".csv";
        drawline(line_file);

    });


function drawBubble(index,tween){

	var circle = d3.selectAll("circle")
	    .sort(function(a,b){
	      // catch nulls, and sort circles by size (smallest on top)
	      if ( isNaN(a[index]) ) a[index] = 0;
	      if ( isNaN(b[index]) ) b[index] = 0;
	      return Math.abs(b[index]) - Math.abs(a[index]);
	    })
	// 	.attr("class",function(d){
	// 	return d[m] > 0 ? "gain" : "loss";
	// })
	console.log(circle);
	circle
		.transition()
		.ease("linear")
		.duration(100)
		.attr("r",function(d){
			return 10*d[index]});
}

// var timescale2 = d3.time.scale();
// d3.csv("data/Non-continue/topic2.csv",function(data){
//     var first = data[0];
//     // get columns

//     for ( var mug in first ){
//       if ( mug != "Country" && mug != "Code"){
//         orderedColumns.push(new Date(mug));
//       }
//     }
//     console.log(orderedColumns);
//     orderedColumns.sort();
//     timescale2.domain(orderedColumns).range([0,orderedColumns.length])
//     console.log(orderedColumns.length)
    
// });

// console.log(timescale2(new Date("2013-10-05")));






//slider
formatDate = d3.time.format("%Y-%m-%d")


var margin2 = {top:50,right:70,bottom:50,left:50},
	width2 = 1100 - margin2.left-margin2.right,
	height2 = 110 - margin2.bottom - margin2.top;

// scale function
var timeScale = d3.time.scale()
		.domain([new Date('2013-06-25'), new Date('2015-01-01')])
		// .domain(orderedColumns)
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
	// console.log(index);
	drawBubble(orderedColumns[index]);
    handle.attr("transform", "translate(" + timeScale(value) + ",0)");
    handle.select('text').text(formatDate(value));
}

