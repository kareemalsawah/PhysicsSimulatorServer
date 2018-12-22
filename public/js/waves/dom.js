function domShow(nav){
		document.getElementById("VariablesNav").classList.remove("active");
		document.getElementById("TimeNav").classList.remove("active");
		document.getElementById("SettingsNav").classList.remove("active");
		document.getElementById("VariablesDiv").style.display = "none";
		document.getElementById("TimeDiv").style.display = "none";
		document.getElementById("SettingsDiv").style.display = "none";

	if(nav=="settings"){
		document.getElementById("SettingsNav").classList.add("active");
		document.getElementById("SettingsDiv").style.display = "block";

	}else if(nav=="variables"){
		document.getElementById("VariablesNav").classList.add("active");
		document.getElementById("VariablesDiv").style.display = "block";
	}else if(nav=="time"){
		document.getElementById("TimeNav").classList.add("active");
		document.getElementById("TimeDiv").style.display = "block";
	}
}


//Variables control
function showOptions(id){
  document.getElementById('name').value = objectsGraphed[id][2];
  document.getElementById('myMsgBox').style.display = "block";
  document.getElementById('toAdd').innerHTML += '<input type="button" value="save" class="btn btn-primary" onclick="save('+id+')" />';
  document.getElementById('parNum').value = objectsGraphed[id][0]+1;
  document.getElementById('toGraph').value = objectsGraphed[id][1];
  document.getElementById('colorpicker').value = objectsGraphed[id][3];
  document.getElementById('graphYShift').value = objectsGraphed[id][4];
}

function generateDomElement(id,name,color,type){
	var p1 = '<div class="variablesTitle" id="var';
	var p2 = 'name"><div class="sideBySide varNameState"><a class="sideBySide varName">';
	var p3 = '</a><a class="sideBySide state" id="hidden';
	var p4 = '">Hidden</a></div><a class="sideBySide variablesElems colorBlock" style="background-color:';
	var p5 = '"></a><a class="sideBySide variablesElemsBtn btn btn-primary" onclick="switchGraphing(';
	var p6 = ');">Switch Visibility</a><a class="sideBySide variablesElemsBtn btn btn-primary" onclick="showOptions(';
	var p7 = ');">Edit</a><a class="sideBySide variablesElemsBtn btn btn-danger" onclick="deleteVar(';
	var p8 = ');">Delete</a><br></div>';
	var answer = p1+id+p2+name+p3+id+p4+color+p5+id+p6+id+p7+id+p8;
	return answer;
}

function save(id){
  objectsGraphed[id][2] = document.getElementById('name').value;
  objectsGraphed[id][0] = parseInt(document.getElementById('parNum').value)-1;
  objectsGraphed[id][1] = document.getElementById('toGraph').value;
  objectsGraphed[id][3] = document.getElementById('colorpicker').value;
  objectsGraphed[id][4] = parseFloat(document.getElementById('graphYShift').value);
  document.getElementById("var"+id+"name").getElementsByClassName("varNameState")[0].getElementsByClassName("varName")[0].innerHTML = objectsGraphed[id][2];
  document.getElementById("var"+id+"name").getElementsByClassName("colorBlock")[0].style = "background-color:"+objectsGraphed[id][3]+";";
  document.getElementById('myMsgBox').style.display = "none";
  document.getElementById('toAdd').innerHTML = '';
}

function deleteVar(id){
	objectsGraphed.splice(id,1);
	graphing.splice(id,1);
	document.getElementById("var"+id+"name").parentNode.removeChild(document.getElementById("var"+id+"name"));
}


function switchGraphing(id){
	if(graphing[id]){
		graphing[id] = false;
		document.getElementById("hidden"+id).innerHTML = "Hidden";
	}else{
		graphing[id] = true;
		document.getElementById("hidden"+id).innerHTML = "Visible";
	}
}

function addNewDefaultVar(){
	newObject = [0,"x","Default","#000000",0];
	objectsGraphed.push(newObject);
	graphing.push(false);
	var index = objectsGraphed.length-1;
	document.getElementById("variables").innerHTML += generateDomElement(index,objectsGraphed[index][2],objectsGraphed[index][3]);

}

function closeMsg(){
  document.getElementById('myMsgBox').style.display = "none";
  document.getElementById('toAdd').innerHTML = '';
}

function saveTimeSettings(){
	var dtSetting = parseFloat(document.getElementById("dtSetting").value);
	dtGeneral = dtSetting;
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

function setSavedValues(){
	document.getElementById("dtSetting").value = dtGeneral;
}

function saveSettings(){
}

function control(type){
	if(type=="pause"){
		paused = true;
	}else if(type=="play"){
		paused = false;
		document.getElementById("currentCommand").innerHTML = "Current Command: Running Simulation";
	}else if(type=="nextFrame"){
		paused = true;
		scene.stepScene(dtGeneral);
		scene.draw();
	}
}

var drawingCursor = false;
var drawingPointPos = [0,0];
graphCanvasDom.addEventListener("mousemove",function(evt){
	if(drawingCursor){
	var rect = graphCanvasDom.getBoundingClientRect();
	var mouseX = evt.clientX - rect.left;
	var mouseY = evt.clientY - rect.top;
	var realCoord = graphCanvas.canToRealCoord(mouseX,mouseY);
	drawingPointPos = graphCanvas.realToCanCoord(realCoord[0],realCoord[1]);
	}
});



graphCanvasDom.addEventListener("mouseover",function(evt){
	drawingCursor = true;
});

graphCanvasDom.addEventListener("mouseout",function(evt){
	drawingCursor = false;
});

function down(){
	var toDown = JSON.stringify(new toDownload(scene,graphCanvasDom,0));
}

function loadFileAsText(){
  var fileToLoad = document.getElementById("fileToLoad").files[0];

  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent){
      var textFromFileLoaded = fileLoadedEvent.target.result;
      load(textFromFileLoaded);
  };

  fileReader.readAsText(fileToLoad, "UTF-8");
}

function load(data){

}

var timeSpeed = document.getElementById("timeSpeed");

var simulationX = document.getElementById("simulationX");
var simulationY = document.getElementById("simulationY");
var simulationScale = document.getElementById("simulationScale");

timeSpeed.oninput = function() {
	timeControl = this.value;
}

simulationX.oninput = function() {
	var shiftX = -1*parseFloat(this.value);
	graphCanvas.currentPos[0] = -10*graphCanvas.currentPos[4]+shiftX;
	graphCanvas.currentPos[2] = 10*graphCanvas.currentPos[4]+shiftX;
	graphCanvas.currentPos[3] = shiftX;
	graphCanvas.x1 = graphCanvas.currentPos[0];
	graphCanvas.y1 = graphCanvas.currentPos[1];
	graphCanvas.x2 = graphCanvas.currentPos[2];
	graphCanvas.updateTransform();
}
simulationY.oninput = function() {
	var shiftY = -1*parseFloat(this.value);
	graphCanvas.currentPos[1] = 7.5*graphCanvas.currentPos[4]+shiftY;
	graphCanvas.currentPos[5] = shiftY;
	graphCanvas.x1 = graphCanvas.currentPos[0];
	graphCanvas.y1 = graphCanvas.currentPos[1];
	graphCanvas.x2 = graphCanvas.currentPos[2];
	graphCanvas.updateTransform();
}
simulationScale.oninput = function() {
	var scaleX = 1/parseFloat(this.value);
	graphCanvas.currentPos[0] = -10*scaleX+graphCanvas.currentPos[3];
	graphCanvas.currentPos[2] = 10*scaleX+graphCanvas.currentPos[3];
	graphCanvas.currentPos[4] = scaleX;
	graphCanvas.currentPos[1] = 7.5*scaleX+graphCanvas.currentPos[5];
	graphCanvas.x1 = graphCanvas.currentPos[0];
	graphCanvas.y1 = graphCanvas.currentPos[1];
	graphCanvas.x2 = graphCanvas.currentPos[2];
	graphCanvas.updateTransform();
}

function resetDt(){
	timeControl = 1;
	timeSpeed.value = 1;
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


//simulationCanvas
rangeShifters(-9999,9999,"minSimulationX","maxSimulationX","simulationX");
rangeShifters(-9999,9999,"minSimulationY","maxSimulationY","simulationY");
rangeShifters(0.1,9999,"minSimulationScale","maxSimulationScale","simulationScale");
