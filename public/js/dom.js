function domShow(nav){
		document.getElementById("placeObjectsNav").classList.remove("active");
		document.getElementById("GraphNav").classList.remove("active");
		document.getElementById("VariablesNav").classList.remove("active");
		document.getElementById("TimeNav").classList.remove("active");
		document.getElementById("SettingsNav").classList.remove("active");
		document.getElementById("placeObjectsDiv").style.display = "none";
		document.getElementById("GraphDiv").style.display = "none";
		document.getElementById("VariablesDiv").style.display = "none";
		document.getElementById("TimeDiv").style.display = "none";
		document.getElementById("SettingsDiv").style.display = "none";

	if(nav=="place"){
		document.getElementById("placeObjectsNav").classList.add("active");
		document.getElementById("placeObjectsDiv").style.display = "block";
	}else if(nav=="graph"){
		document.getElementById("GraphNav").classList.add("active");
		document.getElementById("GraphDiv").style.display = "block";

	}else if(nav=="settings"){
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
	var p5 = '"></a><a class="sideBySide btn btn-primary" id="variablesElemsBtn" onclick="switchGraphing(';
	var p6 = ');">Switch Visibility</a><a class="sideBySide btn btn-primary" id="variablesElemsBtn" onclick="showOptions(';
	var p7 = ');">Edit</a><a class="sideBySide btn btn-danger" id="variablesElemsBtn" onclick="deleteVar(';
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
	document.getElementById("gravitySetting").value=scene.forceTypes[0].gravity[0]+","+scene.forceTypes[0].gravity[1];
	document.getElementById("linearDampingSetting").value="0.0";
	document.getElementById("integrationType").value=scene.integrationMethod;
	document.getElementById("convergenceRate").value=scene.minConvergenceImplicit;
	document.getElementById("maxLoops").value=scene.maxLoopsForImplicit;
}

var toAddParticle = [0,[0,0],0,0,[0,0]];
var toAddSpring = [0,0,0,0,0];
function place(type){
	if(placing=="0"){
		if(type=="particle"){
			toAddParticle[0] = document.getElementById("particleMass").value;
			toAddParticle[1] = document.getElementById("particleVelocity").value.split(",");
			toAddParticle[2] = document.getElementById("particleRadius").value;
			toAddParticle[3] = document.getElementById("particleColor").value;
			toAddParticle[4][0] = parseInt(document.getElementById("particleFixed").value.split(",")[0]);
			toAddParticle[4][1] = parseInt(document.getElementById("particleFixed").value.split(",")[1]);
			placing = type;
			document.getElementById("currentCommand").innerHTML = "Current Command: Placing Particle";
			document.getElementById("particleSettings").style.display = "block";
		}else if(type=="spring"){
			toAddSpring[0] = document.getElementById("springConstant").value;
			toAddSpring[1] = document.getElementById("springL0").value;
			toAddSpring[2] = document.getElementById("springDampingBeta").value;
			toAddSpring[3] = document.getElementById("springWidth").value;
			toAddSpring[4] = document.getElementById("springColor").value;
			placing = type;
			document.getElementById("currentCommand").innerHTML = "Current Command: Select first object";
		}else if(type=="rope"){
			//rope(pos1,pos2,v1,v2,width,fixedEndpoints,mass,pRadius,pColor,sColor,k,pNum,kBeta)
			var v = document.getElementById("ropeVelocity").value.split(",");
			var v1 = [];
			var v2 = [];
			v1.push(parseFloat(v[0]));
			v1.push(parseFloat(v[1]));
			v2.push(parseFloat(v[2]));
			v2.push(parseFloat(v[3]));

			var f = document.getElementById("ropeFixed").value.split(",");
			var f1 = [];
			var f2 = [];
			f1.push(parseInt(f[0]));
			f1.push(parseInt(f[1]));
			f2.push(parseInt(f[2]));
			f2.push(parseInt(f[3]));
			f = [];
			f.push(f1);
			f.push(f2);

			var internalFixed = document.getElementById("ropeFixedInternal").value.split(",");
			internalFixed[0] = parseInt(internalFixed[0]);
			internalFixed[1] = parseInt(internalFixed[1]);
			var wid = parseFloat(document.getElementById("ropeWidth").value);
			var mass = parseFloat(document.getElementById("ropeMass").value);
			var pRadius = parseFloat(document.getElementById("ropeParticleWidth").value);
			var k = parseFloat(document.getElementById("ropeK").value);
			var kBeta = parseFloat(document.getElementById("ropeBeta").value);
			var pNum = parseFloat(document.getElementById("ropeSections").value);
			var pColor = document.getElementById("ropeParticleColor").value;
			var sColor = document.getElementById("ropeSpringColor").value;
			var newRope = new rope(ropePos[0],ropePos[1],v1,v2,wid,f,mass,pRadius,pColor,sColor,k,pNum,kBeta,internalFixed);
		}else if(type=="simpleRope"){
			var v = document.getElementById("simpleRopeVelocity").value.split(",");
			var v1 = [];
			var v2 = [];
			v1.push(parseFloat(v[0]));
			v1.push(parseFloat(v[1]));
			v2.push(parseFloat(v[2]));
			v2.push(parseFloat(v[3]));

			var f = document.getElementById("simpleRopeFixed").value.split(",");
			var f1 = [];
			var f2 = [];
			f1.push(parseInt(f[0]));
			f1.push(parseInt(f[1]));
			f2.push(parseInt(f[2]));
			f2.push(parseInt(f[3]));
			f = [];
			f.push(f1);
			f.push(f2);


			var internalFixed = document.getElementById("simpleRopeFixedInternal").value.split(",");
			internalFixed[0] = parseInt(internalFixed[0]);
			internalFixed[1] = parseInt(internalFixed[1]);
			var mass = parseFloat(document.getElementById("simpleRopeMass").value);
			var pRadius = parseFloat(document.getElementById("simpleRopeParticleWidth").value);
			var k = parseFloat(document.getElementById("simpleRopeK").value);
			var kBeta = parseFloat(document.getElementById("simpleRopeBeta").value);
			var pNum = parseFloat(document.getElementById("simpleRopeSections").value);
			var pColor = document.getElementById("simpleRopeParticleColor").value;
			var sColor = document.getElementById("simpleRopeSpringColor").value;
			var newRope = new simpleRope(ropePos[0],ropePos[1],v1,v2,f,mass,pRadius,pColor,sColor,k,pNum,kBeta,internalFixed);
		}else if(type=="support"){
			toAddSpring[0] = parseFloat(document.getElementById("supportConstant").value);
			toAddSpring[2] = parseFloat(document.getElementById("supportDampingBeta").value);
			toAddSpring[3] = parseFloat(document.getElementById("supportWidth").value);
			toAddSpring[4] = document.getElementById("supportColor").value;
			placing = "spring";
			support = true;
			document.getElementById("currentCommand").innerHTML = "Current Command: Select first object";
		}
	}else{

	}
}

function showSettings(type){
		document.getElementById("particleSettings").style.display = "none";
		document.getElementById("springSettings").style.display = "none";
		document.getElementById("ropeSettings").style.display = "none";
		document.getElementById("simpleRopeSettings").style.display = "none";
		document.getElementById("supportSettings").style.display = "none";
	if(type=="particle"){
		showDeleteSettings("none");
		document.getElementById("deleteDropdown").style.display = "none";
		document.getElementById("particleSettings").style.display = "block";
	}else if(type=="spring"){
		showDeleteSettings("none");
		document.getElementById("deleteDropdown").style.display = "none";
		document.getElementById("springSettings").style.display = "block";
	}else if(type=="rope"){
		showDeleteSettings("none");
		document.getElementById("deleteDropdown").style.display = "none";
		document.getElementById("ropeSettings").style.display = "block";
	}else if(type=="support"){
		showDeleteSettings("none");
		document.getElementById("deleteDropdown").style.display = "none";
		document.getElementById("supportSettings").style.display = "block";
	}else if(type=="simpleRope"){
		showDeleteSettings("none");
		document.getElementById("deleteDropdown").style.display = "none";
		document.getElementById("simpleRopeSettings").style.display = "block";
	}
}

function showDeleteSettings(type){
		document.getElementById("particleDeleteSettings").style.display = "none";
		document.getElementById("forceDeleteSettings").style.display = "none";
	if(type=="particle"){
		showSettings("none");
		document.getElementById("placeDropdown").style.display = "none";
		document.getElementById("particleDeleteSettings").style.display = "block";
	}else if(type=="force"){
		showSettings("none");
		document.getElementById("placeDropdown").style.display = "none";
		document.getElementById("forceDeleteSettings").style.display = "block";
	}
}

function deleteParticle(){
	var particleIndex = parseInt(document.getElementById("deleteParticleNumber").value);
	if(particleIndex>scene.numParticles||particleIndex<1){
		alert("That particle doesn't exist");
	}else{
		var forceNum = scene.forceTypes.length;
		for(var i = 2; i < forceNum; i++){
			if(scene.forceTypes[i].type == "SpringForce"){
				var edgeToRemoveIndex = scene.forceTypes[i].edgeIndex;
				var forceEdge = scene.edges[edgeToRemoveIndex];
				if(forceEdge.p1 == particleIndex-1 || forceEdge.p2 == particleIndex-1){
					scene.edges.splice(edgeToRemoveIndex,1);
					scene.numEdges--;
					scene.forceTypes.splice(i,1);
					for(var j = 0; j < scene.forceTypes.length; j++){
						if(scene.forceTypes[j].type == "SpringForce"){
							if(scene.forceTypes[j].edgeIndex>edgeToRemoveIndex){
								scene.forceTypes[j].edgeIndex--;
							}
						}
					}
					i--;
					forceNum--;
				}
			}
		}
		scene.numParticles--;
		scene.particles.splice(particleIndex-1,1);
	}
}

function deleteForce(){
	var force1 = parseInt(document.getElementById("deleteForce1").value);
	var force2 = parseInt(document.getElementById("deleteForce2").value);
	var deletedAForce = false;
	var forceNum = scene.forceTypes.length;
	for(var i = 2; i < forceNum; i++){
		if(scene.forceTypes[i].type == "SpringForce"){
			var edgeToRemoveIndex = scene.forceTypes[i].edgeIndex;
			var edgeToRemove = scene.edges[edgeToRemoveIndex];
			if(edgeToRemove.p1==force1-1&&edgeToRemove.p2==force2-1){
				deletedAForce = true;
				scene.edges.splice(edgeToRemoveIndex,1);
				scene.numEdges--;
				scene.forceTypes.splice(i,1);
				for(var j = 0; j < scene.forceTypes.length; j++){
					if(scene.forceTypes[j].type == "SpringForce"){
						if(scene.forceTypes[j].edgeIndex>edgeToRemoveIndex){
							scene.forceTypes[j].edgeIndex--;
						}
					}
				}
				i--;
				forceNum--;
			}
		}
	}
	if(!deletedAForce){
		alert("No Force found between these two particles");
	}
}

function cancelDelete(){
	showDeleteSettings("none");
	document.getElementById("placeDropdown").style.display = "block";
}

function instantPlace(type){
	if(type=="particle"){
			toAddParticle[0] = document.getElementById("particleMass").value;
			toAddParticle[1] = document.getElementById("particleVelocity").value.split(",");
			toAddParticle[2] = document.getElementById("particleRadius").value;
			toAddParticle[3] = document.getElementById("particleColor").value;
			toAddParticle[4][0] = parseInt(document.getElementById("particleFixed").value.split(",")[0]);
			toAddParticle[4][1] = parseInt(document.getElementById("particleFixed").value.split(",")[1]);
			var toAddParticlePos = document.getElementById("particlePos").value.split(",");
			scene.addParticle(parseFloat(toAddParticlePos[0]),parseFloat(toAddParticlePos[1]),parseFloat(toAddParticle[1][0]),parseFloat(toAddParticle[1][1]),[parseInt(toAddParticle[4][0]),parseInt(toAddParticle[4][1])],parseFloat(toAddParticle[0]),parseFloat(toAddParticle[2]),toAddParticle[3]);
	}
}

function saveSettings(){
	var gravitySetting = document.getElementById("gravitySetting").value.split(",");
	var linearDampingSetting = parseFloat(document.getElementById("linearDampingSetting").value);
	var integrationType = document.getElementById("integrationType").value;
	var convergenceRate = document.getElementById("convergenceRate").value;
	var maxLoops = document.getElementById("maxLoops").value;
	scene.forceTypes[0].gravity[0] = parseFloat(gravitySetting[0]);
	scene.forceTypes[0].gravity[1] = parseFloat(gravitySetting[1]);
	scene.forceTypes[1].beta = linearDampingSetting;
	console.log(linearDampingSetting);
	scene.integrationMethod = integrationType;
	scene.minConvergenceImplicit = convergenceRate;
	scene.maxLoopsForImplicit = maxLoops;
}

function control(type){
	if(type=="pause"){
		paused = true;
		document.getElementById("currentCommand").innerHTML = "Current Command: Simulation Paused";
	}else if(type=="play"){
		paused = false;
		document.getElementById("currentCommand").innerHTML = "Current Command: Running Simulation";
	}else if(type=="nextFrame"){
		document.getElementById("currentCommand").innerHTML = "Current Command: Simulation Paused";
		paused = false;
		nextFrame();
		paused = true;
		/*scene.stepScene(dtGeneral);
		scene.draw();*/
	}
}

function placeRope(type){
	if(type=="simple"){
		placing = "simpleRope";
	}else if(type=="complex"){
		placing = "rope";
	}
}

function down(){
	var toDown = JSON.stringify(new toDownload(scene,graphCanvas,0));
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
	var dataObj = JSON.parse(data);
	var newScene = dataObj.sceneObj;
	scene.particles = [];
	scene.edges = [];
	scene.forceTypes = [];
	for(var i = 0; i < newScene.particles.length; i++){
		var newParticle = newScene.particles[i];
		scene.particles.push(new ball(newParticle.pos[0],newParticle.pos[1],newParticle.velocity[0],newParticle.velocity[1],newParticle.fixed,newParticle.mass,newParticle.radius,newParticle.color))
	}
	for(var i = 0; i < newScene.edges.length; i++){
		var newEdge = newScene.edges[i];
		scene.edges.push(new edge(newEdge.p1,newEdge.p2,newEdge.radius,newEdge.color))
	}
	for(var i = 0; i < newScene.forceTypes.length; i++){
		var newForce = newScene.forceTypes[i];
		if(newForce.type=="SimpleGravity"){
			scene.forceTypes.push(new SimpleGravity(newForce.gravity));
		}else if(newForce.type=="SpringForce"){
			scene.forceTypes.push(new SpringForce(newForce.edgeIndex,parseFloat(newForce.k),parseFloat(newForce.l0),parseFloat(newForce.dampingBeta)));
		}
	}
	scene.integrationMethod = newScene.integrationMethod;
	scene.numParticles = newScene.numParticles;
	scene.numEdges = newScene.numEdges;
	scene.startEnergy = newScene.startEnergy;
	scene.currentEnergy = newScene.currentEnergy;
	scene.maxLoopsForImplicit = newScene.maxLoopsForImplicit;
	scene.minConvergenceImplicit = newScene.minConvergenceImplicit;
	//graphCanvas = dataObj.graphCanv;
}

var drawingCursor = false;
var drawingPointPos = [0,0];
console.log(graphCanvas);
graphCanvas.addEventListener("mousemove",function(evt){
	if(drawingCursor){
	var rect = graphCanvasDom.getBoundingClientRect();
	var mouseX = evt.clientX - rect.left;
	var mouseY = evt.clientY - rect.top;
	var realCoord = graphCanvas.canToRealCoord(mouseX,mouseY);
	drawingPointPos = graphCanvas.realToCanCoord(realCoord[0],realCoord[1]);
	}
});



graphCanvas.addEventListener("mouseover",function(evt){
	drawingCursor = true;
});

graphCanvas.addEventListener("mouseout",function(evt){
	drawingCursor = false;
});

var rangeX = document.getElementById("rangeX");
var graphScaleX = document.getElementById("scaleX");
var rangeY = document.getElementById("rangeY");
var graphScaleY = document.getElementById("scaleY");

var timeSpeed = document.getElementById("timeSpeed");

var simulationX = document.getElementById("simulationX");
var simulationY = document.getElementById("simulationY");
var simulationScale = document.getElementById("simulationScale");

rangeX.oninput = function() {
    graphCanvas.shiftX = -1*parseFloat(this.value);
    movingWithTime = false;
    graphCanvas.updateTransform();
    for(var i = 0; i < graphing.length; i++){
    	if(graphing[i]){
    		graphCanvas.drawGraph(i);
    	}
    }
}

graphScaleX.oninput = function() {
    graphCanvas.scaleX = 1/parseFloat(this.value);
    movingWithTime = false;
    graphCanvas.updateTransform();
    for(var i = 0; i < graphing.length; i++){
    	if(graphing[i]){
    		graphCanvas.drawGraph(i);
    	}
    }
}

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

timeSpeed.oninput = function() {
	timeControl = this.value;
}

simulationX.oninput = function() {
	var shiftX = -1*parseFloat(this.value);
	mainCanvas.currentPos[0] = -10*mainCanvas.currentPos[4]+shiftX;
	mainCanvas.currentPos[2] = 10*mainCanvas.currentPos[4]+shiftX;
	mainCanvas.currentPos[3] = shiftX;
	mainCanvas.x1 = mainCanvas.currentPos[0];
	mainCanvas.y1 = mainCanvas.currentPos[1];
	mainCanvas.x2 = mainCanvas.currentPos[2];
	mainCanvas.updateTransform();
}
simulationY.oninput = function() {
	var shiftY = -1*parseFloat(this.value);
	mainCanvas.currentPos[1] = 7.5*mainCanvas.currentPos[4]+shiftY;
	mainCanvas.currentPos[5] = shiftY;
	mainCanvas.x1 = mainCanvas.currentPos[0];
	mainCanvas.y1 = mainCanvas.currentPos[1];
	mainCanvas.x2 = mainCanvas.currentPos[2];
	mainCanvas.updateTransform();
}
simulationScale.oninput = function() {
	var scaleX = 1/parseFloat(this.value);
	mainCanvas.currentPos[0] = -10*scaleX+mainCanvas.currentPos[3];
	mainCanvas.currentPos[2] = 10*scaleX+mainCanvas.currentPos[3];
	mainCanvas.currentPos[4] = scaleX;
	mainCanvas.currentPos[1] = 7.5*scaleX+mainCanvas.currentPos[5];
	mainCanvas.x1 = mainCanvas.currentPos[0];
	mainCanvas.y1 = mainCanvas.currentPos[1];
	mainCanvas.x2 = mainCanvas.currentPos[2];
	mainCanvas.updateTransform();
}

function resetDt(){
	timeControl = 1;
	timeSpeed.value = 1;
}

function cancelPlacement(){
	showSettings("none");
	placing = "0";
	springElement1 = -1;
	springElement2 = -1;
	ropeElement = -1;
	document.getElementById("deleteDropdown").style.display = "block";
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
rangeShifters(-9999,9999,"minGraphX","maxGraphX","rangeX");
rangeShifters(0.1,9999,"minScaleX","maxScaleX","scaleX");

//simulationCanvas
rangeShifters(-9999,9999,"minSimulationX","maxSimulationX","simulationX");
rangeShifters(-9999,9999,"minSimulationY","maxSimulationY","simulationY");
rangeShifters(0.1,9999,"minSimulationScale","maxSimulationScale","simulationScale");
