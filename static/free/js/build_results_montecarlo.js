/* Javascript used to start an experiment and showns graphics in real time

Developed by José Veiga and Pedro Rosa

Last updated out 9 11:12 , 2021*/


let  total_point_1 = 0;
let point_in_1 = 0;
let  stop_signal = "all good"
let R =0;


function getCookie(name) 
{
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) 
  {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  }
  else
  {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) 
    {
      end = dc.length;
    }
  }
  
  // because unescape has been deprecated, replaced with decodeURI
  // return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}

$(".menu .item").click(function() {
  var tab_description = $(this).attr("data-tab");
  // console.log('Description : ', tab_description);
  if (tab_description === 'results')
  {
    Show_data()
  }
  });

function Show_data(){
  result_data = JSON.parse(document.getElementById('final-result').textContent);
  buildPlot1(JSON.parse(document.getElementById('execution-config').textContent).config.R,"resultstab-myplot");
  receive_error_velocity = 0.1;
  receive_error_period = 0.0005;//response.data.value.e_period;
  console.log(JSON.parse(document.getElementById('execution-config').textContent).config.R)
  let in_x_points = [result_data.value.map(data => { 
    if (parseInt(data.circ) === 0){
      return data.eX
    }
    else{

    }}).filter(function (element) { 
      return element !== undefined;
    })]
  let in_y_points = [result_data.value.map(data => { 
    if (parseInt(data.circ) === 0){
      return data.eY
    }
    else{
    }}).filter(function (element) { 
    return element !== undefined;
    })]
  let out_x_points = [result_data.value.map(data => { 
    if (parseInt(data.circ) === 1){
      return data.eX
    }
    else{

    }}).filter(function (element) { 
    return element !== undefined;
    })]
  let out_y_points = [result_data.value.map(data => { 
    if (parseInt(data.circ) === 1){
      return data.eY
    }
    else{
    }}).filter(function (element) { 
      return element !== undefined;
    })]
  // console.log(in_x_points)
  console.log([result_data.value.map(data => parseInt(data.circ))]);
  Plotly.extendTraces("resultstab-myplot", {x: in_x_points,y: in_y_points}, [0]);
  Plotly.extendTraces("resultstab-myplot", {x: out_x_points,y: out_y_points}, [1]);
}


function cleanPlots(){
  console.log("Clean all plots ");
  Plotly.purge('myplot');
  Plotly.purge('resultstab-myplot');
}



function buildGraph(response){
  R = new_execution.config.R
  buildPlot1(R,"myplot");
  console.log("aqui")
  console.log(response.data[0].id)
}




function plotRunTime(response){
  if (response.data[0].id > response.data[response.data.length-1].id)
    {
      check = response.data.length-1
    }
    else{
      check = 0 
    }
  if (typeof response.data[0] === 'object'){
    for (let i = 0; i < response.data.length; i++)
    { 
      if ( response.data[i].result_type === 'p'){
        
        // console.log('value',response.data.map(data => data.value.eX))~
        console.log(response.data.length)
        console.log(response.data[i].value.eX)
        let j = parseInt(response.data[i].value.circ,10);
        Plotly.extendTraces('myplot', {x: [[response.data[i].value.eX]],y: [[response.data[i].value.eY]]}, [j]);
        if (j === 1)
        {
          point_in_1 = point_in_1+1;
          document.getElementById('point_in').innerHTML = 'Points in : ' + parseInt(point_in_1,10);
        }
        total_point_1 = total_point_1 +1
        document.getElementById('total_point').innerHTML = 'Total points : ' +  parseInt(total_point_1,10);
        document.getElementById('pi').innerHTML = 'PI : ' + (4*parseFloat(point_in_1,10)/parseFloat(total_point_1,10));
      }
      else{
        stop_signal = "f found"
      }
    }
    if (response.data[0].id >response.data[response.data.length-1].id)
    {
      last_result_id = parseInt(response.data[0].id)+1
    }
    else{
      last_result_id = parseInt(response.data[response.data.length-1].id)+1
    }
    if (stop_signal === "f found")
    {
      myStopFunction(); 
    }

  }
}





// //// nao usado
// function tablebind(response) {  
//           if (obj.length > 0) {  

//               var table = $("<table />");  
//               table[0].border = "1";  

//               var row$;  

//               var columns = addAllColumnHeaders(["S"]);  
//               for (var i = 0; i < data.length; i++)
//                {  
//                   row$ = $('<tr/>');  
           
//                   for (var colIndex = 0; colIndex < columns.length; colIndex++) 
//                   {  
//                       var cellValue = data[i][columns[colIndex]];  

//                       if (cellValue == null) { cellValue = ""; }  

//                       row$.append($('<td/>').html(cellValue));  
//                   }  
//                   $("#jsonTable").append(row$);  
//               }      
//           }  

// }  




var point_x;
var point_y;
/////////////////////////////////////////////////////////////////////////////////
//////////// Build graphic                    
/////////////////////////////////////////////////////////////////////////////////


// To improve
var selectorOptions = {
  buttons: [{
      step: '1',
      stepmode: 'backward',
      count: 1,
      label: '10N'
  },{

      step: 'all',

  }],

};


function buildPlot1(R,plotdiv) {

  var dados_f = [];
           //color = "rgb(" + (200*Math.random()+50).toString()+',' + (200*Math.random()+20).toString()+',' +(200*Math.random()+10).toString()+')';
           for (let i=0; i < 2; i++){
              if (i === 1){
                 name= "IN";
                 color = "rgb(0, 204, 0)";
              }
              else{
                 name = "OUT";
                 color = "rgb(255, 0, 0)";
              }
              dados_f.push({
                      name: name,
                      x: [],
                      y: [],
                      marker: {
                       color: color,
                       size: 5,
                      },
                      line: {
                       color: color,
                       width: 0,
                      },
                      mode: 'lines+markers',
                      type: 'scatter',
                    });
           }
           var layout = {
              title: 'Monte Carlo',
              width: 550,
              height: 550,
              xaxis: {
                 title: 'R [ua]',
                 titlefont: {
                   family: 'Arial, sans-serif',
                   size: 18,
                   color: 'black'
                 },
                 showticklabels: true,
                 exponentformat: 'e',
                 showexponent: 'all',
                 range: [-R, R]
              },
              yaxis: {
                 title: 'R [ua]',
                 titlefont: {
                   family: 'Arial, sans-serif',
                   size: 18,
                   color: 'black'
                 },
                 showticklabels: true,
                   range: [-R, R]
                 
              },
              shapes: [
  
                 // Unfilled Circle
  
                 {
                   type: 'circle',
                   xref: 'x',
                   yref: 'y',
                   x0: -R,
                   y0: -R,
                   x1: R,
                   y1: R,
                   line: {
                    color: "rgb(0, 204, 0)",
                    width: 1
                   }
                 },
                 {
                  type: 'rect',
                  x0: -R,
                  y0: -R,
                  x1: R,
                  y1: R,
                  line: {
                     color: 'rgba(128, 0, 128, 1)'
                  }

                 }
              ],
              
           };
           console.log(dados_f);
           Plotly.newPlot(plotdiv, dados_f, layout);
   
}





function set_reset() {
  var resetBtn = document.getElementById('delete_conf');
  var location = window.location.href.split('?')[0];
  
    resetBtn.addEventListener('click', function(event) {
    console.log('Reseting values of R or iteration...');
    window.location.href = location;
    });
    }





