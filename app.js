


//Overview Variables
let overview = [];
var countThreshold = d3.select("#thresh").property("value");
let onArray=[];
let offArray=[];
let ON;
let OFF;
let ONpercent;
let OFFpercent;
let ONOFFpercent;
var totalNumberOfCars = 0;
var maxValue;
var minValue;
var lowTraffic =0;
var mediumTraffic =0;
var highTraffic =0;
var brightness;
var sunless =0;

//PieChart Variables
let newArrayOnOff=[];
let onArrayPie=[];
let offArrayPie=[];
let ONPie;
let OFFPie;


var svg = d3.select("#pie").append("svg").attr("width",1700).attr("height",1700);

svg.append("g").attr("id","energySavings");


//HeatMap Variables

var marginHM = { top: 40, right: 20, bottom: 30, left: 80 },
          widthHM = 1428.8 - marginHM.left - marginHM.right,
          heightHM = 640 - marginHM.top - marginHM.bottom,
          gridSize = Math.floor(widthHM / 24),
          legendElementWidth = gridSize*2,
          buckets = 9,
          colors = ["#F7EBB5","#DEC95F","#FFD300","#FFB000","#FF7F00","#FF5300","#FF4100","#FF0000","#FF251A"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Su","Mo", "Tu", "We", "Th", "Fr", "Sa"],
          times = ["0a","1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p"];

          var svg =
          d3.select("#chart").append("svg")
            .attr("width", widthHM + marginHM.left + marginHM.right)
            .attr("height", heightHM + marginHM.top + marginHM.bottom)
            .append("g")
            .attr("transform", "translate(" + marginHM.left + "," + marginHM.top + ")");

            var dayLabels =
            svg.selectAll(".dayLabel")
                .data(days)
                .enter().append("text")
                  .text(function (d) { return d; })
                  .attr("x", 0)
                  .attr("y", function (d, i) { return i * gridSize; })
                  .style("text-anchor", "end")
                  .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                  .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });


          var timeLabels =
          svg.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
              .text(function(d) { return d; })
              .attr("x", function(d, i) { return i * gridSize; })
              .attr("y", 0)
              .style("text-anchor", "middle")
              .attr("transform", "translate(" + gridSize / 2 + ", -6)")
              .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });



//https://docs.google.com/spreadsheets/d/e/2PACX-1vQY_RMLzyn9Kxt5XS3Pzv2UIRXS_qhUDFb2csGlhoUBMuCF4Uht8s0_jJh1kEsw0Gd167feLjYNIuKA/pub?gid=471976905&single=true&output=csv
//OverView begins here
//https://docs.google.com/spreadsheets/d/e/2PACX-1vRhI7nrcgGTzPiWMBp9VxVt_RK7xET97_YUkjZg_Vi00bBWehfYS0eczWo28SK5SfOLMN6GyCIhfwsz/pub?gid=471976905&single=true&output=csv
d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vRWgTU-yqUs7CpYkoAn1N4aA8fgHihYhvQLlsLxUK6NYUNMJL5J9aUPFoFBmOL5rhSBsoEidLrTCgva/pub?gid=1876450238&single=true&output=csv',function(row){
 var time = new Date(row.time);
 var count = +row.CarCount;
 var hour = time.getHours();
 var date = time.getDate();
 var month = time.getMonth();
 var year = time.getFullYear();
 var day = time.getDay();
 var sunlight = (hour <= 17 && hour > 7) ? "yes" : "no" ;

  return{
     value: count,
     hour: hour,
     date: date,
     month: month,
     year: year,
     day: day,
     sunlight: sunlight,
     time: time

   }
 },function(error,data){
  if(error) throw error;

  maxValue = d3.max(data,d=> d.value);
  minValue = d3.min(data,d=> d.value);
  var lowTrafficThreshold =maxValue*(1/4);
  var mediumTrafficThreshold =maxValue*(1/2);
  var highTrafficThreshold =maxValue*(3/4);

  //Hour On & Off
  for(var i=0;i<data.length;i++)
    {

      if(data[i].value<countThreshold)
        {

        offArray.push(data[i]);
        }
      else if(data[i].value>=countThreshold)
        {
        onArray.push(data[i]);
        }
      }

//Total Cars
      for(var i=0;i<data.length;i++)
        {

          totalNumberOfCars += data[i].value;

        }

      for(var i=0;i<data.length;i++)
        {
          if(data[i].value<=lowTrafficThreshold)
          {
            lowTraffic++;
          }
          else if(data[i].value<=mediumTrafficThreshold)
          {
            mediumTraffic++;
          }
          else if(data[i].value<=highTrafficThreshold)
          {
            highTraffic++;
          }
        }


				for(var i=0;i<data.length;i++)
					{
						if(data[i].sunlight == "no")
						{
							sunless++;
					}
					}



      ON=onArray.length;
      OFF=offArray.length;
      OFFpercent = OFF*10*5;
      ONpercent = ON*10*5 ;


      //Energy Consumed Percentage
      ONOFFpercent = OFFpercent/(ONpercent+OFFpercent);



$(document).ready(function () {
  var bubbleChart = new d3.svg.BubbleChart({
    supportResponsive: false,
    //container: => use @default
    size: 650,
    //viewBoxSize: => use @default
    innerRadius: 600 / 3.5,
    //outerRadius: => use @default
    radiusMin: 70,
    //radiusMax: use @default
    //intersectDelta: use @default
    //intersectInc: use @default
    //circleColor: use @default


    data: {
      items: [

        {text: "Total Cars", count: totalNumberOfCars},
        {text: "Low Traffic(hrs)", count: lowTraffic},
        {text: "Medium Traffic(hrs)", count: mediumTraffic},
        {text: "High Traffic(hrs)", count: highTraffic},
        {text: "Hours monitored", count:ON + OFF },
				{text: "Least cars in an hour", count:minValue },
				{text: "Most cars in an hour", count:maxValue},
				{text: "Hours without daylight", count:sunless}


      ],
      eval: function (item) {return item.count;},
      classed: function (item) {return item.text.split(" ").join("");}
    },
    plugins: [

      {
        name: "lines",
        options: {
          format: [
            {// Line #0
              textField: "count",
              classed: {count: true},
              style: {
                "font-size": "28px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "0px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            },
            {// Line #1
              textField: "text",
              classed: {text: true},
              style: {
                "font-size": "12px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "20px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            }
          ],
          centralFormat: [
            {// Line #0
              style: {"font-size": "50px"},
              attr: {}
            },
            {// Line #1
              style: {"font-size": "30px"},
              attr: {dy: "40px"}
            }
          ]
        }
      }]
  });
});

})



//Donut Piechart begins here
d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vRWgTU-yqUs7CpYkoAn1N4aA8fgHihYhvQLlsLxUK6NYUNMJL5J9aUPFoFBmOL5rhSBsoEidLrTCgva/pub?gid=1876450238&single=true&output=csv',
function(row){
var time = new Date(row.time);
var count = +row.CarCount;
var hour = time.getHours();
var date = time.getDate();
var month = time.getMonth();
var year = time.getFullYear();
var day = time.getDay();
var sunlight = (hour <= 17 && hour > 7) ? "yes" : "no" ;

 return{
    value: count,
    hour: hour,
    date: date,
    month: month,
    year: year,
    day: day,
    sunlight: sunlight,
    time: time

  }
},function(error,data){
 if(error) throw error;






for(var i=0;i<data.length;i++)
  {

    if(data[i].value<countThreshold && data[i].sunlight=="no")
      {

      offArrayPie.push(data[i]);
      }
    else if(data[i].value>=countThreshold && data[i].sunlight=="no")
      {
      onArrayPie.push(data[i]);
      }
    }

    ONPie=onArrayPie.length;
    OFFPie=offArrayPie.length;


newArrayOnOff.push({label:"On",value:ONPie,color:"red"});
newArrayOnOff.push({label:"Off",value:OFFPie,color:"green"});

var slNumber=d3.select("#slNumber")
      .property("value");
var slTotal= d3.select("#slTotal")
			.property("value");
var slType=d3.select("#slType")
        .property("value");

d3.select("#slNumber")
.property("max",slTotal);


d3.select("#slTotal")
.property("max",99);


//Dimming Approach
/*
//dimmed to 50%
        newArrayOnOff[1].value=(OFFPie*slNumber*(slType*0.5));
//on + 50% birghtness when dimmed
        newArrayOnOff[0].value=(ONPie*slNumber*slType)+(newArrayOnOff[1].value);
*/

//Just on and off approach
//just on
newArrayOnOff[0].value=(ONPie*slTotal*slType)+(OFFPie*(slTotal-slNumber)*slType);
//just off
newArrayOnOff[1].value=(OFFPie*slNumber*slType);

Donut3D.draw("energySavings", newArrayOnOff, 150, 150, 130, 100, 30, 0.4);
    d3.select('form')
      .on('change',()=>{
countThreshold = d3.select("#thresh").property("value");
offArrayPie=[];
onArrayPie=[];

				for(var i=0;i<data.length;i++)
				  {


				    if(data[i].value<countThreshold && data[i].sunlight=="no")
				      {

				      offArrayPie.push(data[i]);
				      }
				    else if(data[i].value>=countThreshold && data[i].sunlight=="no")
				      {
				      onArrayPie.push(data[i]);
				      }
				    }

				    ONPie=onArrayPie.length;
				    OFFPie=offArrayPie.length;
console.log(onArrayPie);
console.log(offArrayPie);
        var slNumber=d3.select("#slNumber")
              .property("value");
				var slTotal= d3.select("#slTotal")
							.property("value");
        var slType=d3.select("#slType")
                .property("value");

d3.select("#slNumber")
.property("max",slTotal);
d3.select("#slTotal")
.property("max",99);

//Dimming Approach
/*
//dimmed to 50%
        newArrayOnOff[1].value=(OFFPie*slNumber*(slType*0.5));
//on + 50% birghtness when dimmed
        newArrayOnOff[0].value=(ONPie*slNumber*slType)+(newArrayOnOff[1].value);
*/

//Just on and off approach
//just on
newArrayOnOff[0].value=(ONPie*slTotal*slType)+(OFFPie*(slTotal-slNumber)*slType);
//just off
newArrayOnOff[1].value=(OFFPie*slNumber*slType);

        Donut3D.draw("energySavings", newArrayOnOff, 150, 150, 130, 100, 30, 0.4);



      });


})


//HeatMap begins here

 d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vRWgTU-yqUs7CpYkoAn1N4aA8fgHihYhvQLlsLxUK6NYUNMJL5J9aUPFoFBmOL5rhSBsoEidLrTCgva/pub?gid=1876450238&single=true&output=csv',function(row){
 var time = new Date(row.time);
 var count = +row.CarCount;
 var hour = time.getHours();
 var date = time.getDate();
 var month = time.getMonth();
 var year = time.getFullYear();
 var day = time.getDay();
 var sunlight = (hour <= 17 && hour > 7) ? "yes" : "no" ;

  return{
     value: count,
     hour: hour,
     date: date,
     month: month,
     year: year,
     day: day,
     sunlight: sunlight,
     time: time

   }
 },function(error,data){
  if(error) throw error;

  var data = data;
  let dataSet;
  let maxValue;
  let minValue;

  dataSet=data;
  maxValue=d3.max(dataSet,d=>d.value);
  minValue=d3.min(dataSet,d=>d.value);


	var currentDataType = d3.select('input[name="data-type"]:checked')
															.attr("value");

	if(currentDataType == 'vc')
	{
			var colorScale1 =
			d3.scale.quantile()
									.domain([0, maxValue])
									.range(colors);
			updateCards(dataSet,colorScale1,currentDataType);
	}
	else if(currentDataType == 'sl')
	{
			var colorScale2 =
			d3.scale.threshold()
									.domain([countThreshold])
									.range(["white","red"]);
			updateCards(dataSet,colorScale2,currentDataType);
	}


                d3.selectAll('input')
                    .on('change', ()=> {

										countThreshold = d3.select("#thresh").property("value");
                    var currentDataType = d3.select('input[name="data-type"]:checked')
                                                .attr("value");

                    if(currentDataType == 'vc')
                    {
                        var colorScale1 =
                        d3.scale.quantile()
                                    .domain([0, maxValue])
                                    .range(colors);
                        updateCards(dataSet,colorScale1,currentDataType);
                    }
                    else if(currentDataType == 'sl')
                    {
                        var colorScale2 =
                        d3.scale.threshold()
                                    .domain([countThreshold])
                                    .range(["white","red"]);
                        updateCards(dataSet,colorScale2,currentDataType);
                    }

                })
})



function updateCards(data,domainUsed,currentDataType)
{
  var cards = svg.selectAll(".hour")
            .data(data, function(d) {return d.day+':'+d.hour;});
            cards.append("title");

  cards.exit().remove();

  cards.enter()
  .append("rect")
      .attr("x", function(d) { return (d.hour ) * gridSize; })
      .attr("y", function(d) { return (d.day ) * gridSize; })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "hour bordered")
      .attr("width", gridSize)
      .attr("height", gridSize)
      .style("fill", function(d){
          if(currentDataType=="sl")
          {
          return (d.sunlight=="yes"? "white":domainUsed(d.value));
          }
          else
          {
        return domainUsed(d.value)
          };
      });

  cards.transition().duration(1000)
      .style("fill", function(d) {   if(currentDataType=="sl")
        {
        return (d.sunlight=="yes"? "white":domainUsed(d.value));
        }
        else
        {
      return domainUsed(d.value) }
    });

  cards.select("title").text(function(d) { return d.value; });



}
