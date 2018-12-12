var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Append Div and Chart Id element
var $div = d3
  .select("body")
  .append("div")
  .attr("id","schart")

  // Append SVG element
var svg = d3
  .select("#schart")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append group element
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// append a div to tooltips, 
$div.append("div").attr("class", "tooltip").style("opacity", 0);
// Read CSV
d3.csv("./assets/data/data.csv", function(err, cleanData) {
  if (err) throw err;
    // create date parser (keep the code here in case we need it)
    //var dateParser = d3.timeParse("%d-%b");

    // parse data
  cleanData.forEach(function(data) {
    data.id = data.id;
    data.state = data.state;
    data.abbr = data.abbr;
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMoe = +data.ageMoe;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.healthcare = +data.healthcare;
    data.healthcareLow = +data.healthcareLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.obesity = +data.obesity;
    data.obesityLow = +data.obesityLow;
    data.obesityHigh = +data.obesityHigh;
    data.smokes = +data.smokes;
    data.smokesLow = +data.smokesLow;
    data.smokesHigh = +data.smokesHigh;
  });

  // create scales, axes, value and function for later the transition
  // for x
  var xValue,
	   	xScale,
	  	xMap,
	  	xAxis;
	function xSelection(dataColumn){
    xValue = (d) => {return d[dataColumn];},
    xScale = d3.scaleLinear().range([0, width]),    
    xMap = (d) => {return xScale(xValue(d));},
	  xAxis = d3.axisBottom(xScale);		
	}
	// for y
	var yValue,
	   	yScale,
	  	yMap,
	  	yAxis;
	function ySelection(dataColumn){
	  yValue = (d) => {return d[dataColumn];},
	  yScale = d3.scaleLinear().range([height, 0]),
	  yMap = (d) => {return yScale(yValue(d));},
	  yAxis = d3.axisLeft(yScale);
	}

  // set initial x and y:
	var nowx = 'poverty';
	var nowy = 'healthcare';
	xSelection(nowx);
	ySelection(nowy);

  // append axes
  chartGroup.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

// ==============================
	var abbrtext = (d) => {return d.abbr;};

    // Initialize Tooltip
    var tooltip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
      	var state = d.state;
      	var xpercent = d[nowx];
      	var ypercent = d[nowy];
        return (`<strong>${state}<strong><hr>x is ${xpercent}<br>y is ${ypercent}`);
      });

	// don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(cleanData, xValue)-1, d3.max(cleanData, xValue)+1]);
    yScale.domain([d3.min(cleanData, yValue)-1, d3.max(cleanData, yValue)+1]);

    // Create the tooltip in chartGroup.
    chartGroup.call(tooltip);

	// draw scatterplots
	var dots = chartGroup.selectAll(".dot")
	    .data(cleanData).enter();

		dots
		  .append("circle")
		  .attr("class", "dot")
		  .attr("r", 15)
		  .attr("cx", xMap)
		  .attr("cy", yMap)
		  .style("fill","blue")

	    dots
	      .append("text")
	      .attr("class", "states")
	      .attr("x", (d) => {return xScale(d[nowx])})
	      .attr("y", (d) => {return yScale(d[nowy])})
	      .text(abbrtext)
	      .on("mouseover", (d) => {
	      	tooltip.show(d)})
	      .on("mouseout", (d) => {
	      	tooltip.hide(d)});

// Change Label 
    chartGroup	
      .append("text")
      .attr("transform", "translate(" + width/2 + "," + (height + margin.top+18) + ")")
      .attr("class", "xaxis-text active")
      .attr("data-axis-name","poverty")
      .text("In Poverty (%)");
    chartGroup	
      .append("text")
      .attr("transform", "translate(" + width/2 + "," + (height + margin.top+35) + ")")
      .attr("class", "xaxis-text inactive")
      .attr("data-axis-name","age")
      .text("Age (median)");
    chartGroup	
      .append("text")
      .attr("transform", "translate(" + width/2 + "," + (height + margin.top+53) + ")")
      .attr("class", "xaxis-text inactive")
      .attr("data-axis-name","income")
      .text("Household Income (median)");
    //Y Labels
    chartGroup
      .append("text") 
      .attr("transform", "translate(" + -margin.left*2/5 + "," + height/2 + ") rotate(270)")
      .attr("class", "yaxis-text active")
      .attr("data-axis-name", "healthcare")
      .text("Lacks Healthcare (%)");
    chartGroup
      .append("text")
      .attr("transform", "translate(" + -margin.left*3/5 + "," + height/2 + ") rotate(270)")
      .attr("class", "yaxis-text inactive")
      .attr("data-axis-name", "smokes")
      .text("Smokes (%)");
    chartGroup
      .append("text")
      .attr("transform", "translate(" + -margin.left*4/5 + "," + height/2 + ") rotate(270)")
      .attr("class", "yaxis-text inactive")
      .attr("data-axis-name", "obesity")
      .text("Obese (%)");

    function xlabelChange(clickedxAxis){
    	d3
    	  .selectAll(".xaxis-text")
          .filter(".active")
          .classed("active", false)
          .classed("inactive", true);
        clickedxAxis.classed("inactive", false).classed("active", true);
      }

    function ylabelChange(clickedyAxis){
    	d3
    	  .selectAll(".yaxis-text")
          .filter(".active")
          .classed("active", false)
          .classed("inactive", true);
        clickedyAxis.classed("inactive", false).classed("active", true);
      }
// change when click
    d3.selectAll(".yaxis-text").on("click", function(){
    	var clickedySelection = d3.select(this);
        var clickedySelectionInactive = clickedySelection.classed("inactive");
        var clickedyAxis = clickedySelection.attr("data-axis-name");

        if (clickedySelectionInactive){
          nowy = clickedyAxis;
          ySelection(nowy);
          yScale.domain([d3.min(cleanData, yValue)-1, d3.max(cleanData, yValue)+1]);

          svg
            .select(".y-axis")
            .transition()
            .duration(1800)
            .call(yAxis);

          d3.selectAll(".dot").each(function (){
            d3
              .select(this)
              .transition()
              .attr("cy", (d) => {
                return yScale(+d[nowy]);
              })

              .duration(1800);
          });

          d3.selectAll(".states").each(function (){
            d3
              .select(this)
              .transition()
              .attr("y", (d) => {
                return yScale(+d[nowy]);
              })
              .duration(1800);
          });
          ylabelChange(clickedySelection);
        }
      })

    d3.selectAll(".xaxis-text").on("click", function(){
        // assign a variable to current axis
    	var clickedxSelection = d3.select(this);
        var clickedxSelectionInactive = clickedxSelection.classed("inactive");
        var clickedxAxis = clickedxSelection.attr("data-axis-name");

        if (clickedxSelectionInactive){
          nowx = clickedxAxis;
          xSelection(nowx);
          xScale.domain([d3.min(cleanData, xValue)-1, d3.max(cleanData, xValue)+1]);

          svg
            .select(".x-axis")
            .transition()
            .duration(1800)
            .call(xAxis);

          d3.selectAll(".dot").each(function (){
            d3
              .select(this)
              .transition()
              .attr("cx", (d) => {
                return xScale(+d[nowx]);
              })
              .duration(1800);
          });

          d3.selectAll(".states").each(function (){
            d3
              .select(this)
              .transition()
              .attr("x", (d) => {
                return xScale(+d[nowx]);
              })
              .duration(1800);
          });
          xlabelChange(clickedxSelection);
        }
      })
  });
