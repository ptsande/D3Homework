// Create the canvas
var svgWidth = 960;
var svgHeight = 500;

// set the margins of the chart
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create a SVG wrapper & append a SVG group. Where chart will live.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//Append the SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//importing health data csv
d3.csv("data/data.csv").then(function(healthData) {

    console.log(healthData);
    //cast healthData to a number
    healthData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });
    //Building scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(healthData, d => d.obesity)])
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.smokes)])
        .range([height, 0]);

    //Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Appending the axes to the chart using the group element
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //Creating circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    // // Initialize a tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<hr>Obesity Rate: ${d.obesity}<br>Smokes: ${d.smokes}`);
        });
    
    // Create tool tip
    chartGroup.call(toolTip);

    // // Create event listeners on mouseover
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    // Create event lister on mouseout
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });
    //set axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smoking Rates");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Obesity Rates");
    });
