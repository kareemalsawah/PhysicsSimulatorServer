function domShow(nav){
		document.getElementById("mainNav").classList.remove("active");
		document.getElementById("TimeNav").classList.remove("active");
		document.getElementById("SettingsNav").classList.remove("active");
		document.getElementById("mainDiv").style.display = "none";
		document.getElementById("TimeDiv").style.display = "none";
		document.getElementById("SettingsDiv").style.display = "none";

	if(nav=="main"){
		document.getElementById("mainNav").classList.add("active");
		document.getElementById("mainDiv").style.display = "block";
	}else if(nav=="settings"){
		document.getElementById("SettingsNav").classList.add("active");
		document.getElementById("SettingsDiv").style.display = "block";

	}else if(nav=="time"){
		document.getElementById("TimeNav").classList.add("active");
		document.getElementById("TimeDiv").style.display = "block";
	}
}

function resetDt(){
	timeControl = 1;
	document.getElementById("timeSpeed").value = 1;
}

function control(type){
	if(type=="pause"){
		paused = true;
		document.getElementById("currentCommand").innerHTML = "Current Command: Simulation Paused";
	}else if(type=="play"){
		paused = false;
		document.getElementById("currentCommand").innerHTML = "Current Command: Running Simulation";
	}else if(type=="nextFrame"){
		paused = true;
		stepScene();
	}
}

function timer(cmd){
	if(cmd=="start"){
		timerOn = true;
	}else if(cmd=="pause"){
		timerOn = false;
	}else if(cmd=="reset"){
		timerOn = false;
		timerTime = 0;
		updateDomTime();
	}
}

function updateDomTime(){
	var minutesTime = Math.floor(timerTime/60);
	var secondsTime = Math.floor((timerTime%60)*1000)/1000;
	var minutesToSave = "";
	var secondsToSave = "";
	if(minutesTime<10){
		minutesToSave = "0"+minutesTime;
	}else{
		minutesToSave = ""+minutesTime;
	}
	if(secondsTime<10){
		secondsToSave = "0"+secondsTime;
	}else{
		secondsToSave = ""+secondsTime;
	}
	if(secondsToSave.length==2){
		secondsToSave += ".";
	}
	while(secondsToSave.length<6){
		secondsToSave += "0";
	}
	document.getElementById("timer").innerHTML = minutesToSave + ":" + secondsToSave;
}



graphCanvasDom.addEventListener("mouseover",function(evt){
	drawingCursor = true;
});

graphCanvasDom.addEventListener("mouseout",function(evt){
	drawingCursor = false;
});

var rangeY = document.getElementById("rangeY");
var graphScaleY = document.getElementById("scaleY");

//var timeSpeed = document.getElementById("timeSpeed");

rangeY.oninput = function() {
    graphCanvas.shiftY = -1*parseFloat(this.value)*-1;
    //graphCanvas.updateTransformY2();
    graphCanvas.updateTransform();
    for(var i = 0; i < graphing.length; i++){
    	if(graphing[i]){
    		graphCanvas.drawGraph(i);
    	}
    }
}

graphScaleY.oninput = function() {
    graphCanvas.scaleY = 1/parseFloat(this.value);
    //graphCanvas.updateTransformY2();
    graphCanvas.updateTransform();
    for(var i = 0; i < graphing.length; i++){
    	if(graphing[i]){
    		graphCanvas.drawGraph(i);
    	}
    }
}

document.getElementById("timeSpeed").oninput = function() {
	timeControl = parseFloat(this.value);
  console.log(timeControl);
}

function rangeShifters(min,max,minDOM,maxDOM,sliderDOM){
	document.getElementById(minDOM).oninput = function(){
		if(parseFloat(this.value)>=min){
			document.getElementById(sliderDOM).setAttribute("min",parseFloat(this.value));
		}
	}
	document.getElementById(maxDOM).oninput = function(){
		if(parseFloat(this.value)<=max){
			document.getElementById(sliderDOM).setAttribute("max",parseFloat(this.value));
		}
	}
}

//graphCanvas
rangeShifters(-9999,9999,"minGraphY","maxGraphY","rangeY");
rangeShifters(0.1,9999,"minScaleY","maxScaleY","scaleY");
