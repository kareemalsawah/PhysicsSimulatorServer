var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
ctx.textBaseline = 'middle';
//var mainCanvas = new simulationCanvas(-10,(canvas.height/canvas.width)*10,10,canvas,ctx,1,"black");

var graphCanvasDom = document.getElementById("canvas");
var graphCtx = graphCanvasDom.getContext("2d");
var graphCanvas = new graphingCanvas(-10,(graphCanvasDom.height/graphCanvasDom.width)*10,10,graphCanvasDom,graphCtx,1,"gray");

var scene;
var dtGeneral = 0.02; //dt that is used in scene.stepScene()
var timeControl = 1; //Determines how many times loop will be called (loop will be called every 1000*dtGeneral/timeControl milliseconds)
var placing = "0"; //Represents what is currently being placed (ex: particles, spring, etc.) or whether nothing is being placed (placing=="0")
var springElement1 = -1; //Represents the index of the first particle a new spring (currently being placed) will be connected to
var springElement2 = -1; //Represents the index of the second particle a new spring (currently being placed) will be connected to
var inCanvas = false; //Whether mouse cursor is inside the simulation canvas
var paused = true; //Whether the simulation is running or paused (if paused scene.stepScene() will not be called)
var graphingTime = 0;
var graphing = []; //Whether a graph/curve is currently visible or hidden
var objectsGraphed = []; //Has information about each graph/curve added to variables (both visible and hidden)
var shiftGraph = 0;
var movingWithTime = false; //Whether the graphCanvas is shifting along the time/x axis (when the graph reaches the center the graph automatically shifts with the curve to allow it to be visible)
var netAddedTime = 0; //net time the simulation ran for
var timerOn = false; //Whether the timer/stopwatch was started
var timerTime = 0; //Time displayed in the timer/stopwatch
var ropeElement = -1; //Represents whether the position of the first particle of a rope that will be placed (simple and complex) has been determined
var ropePos = [[0,0],[0,0]]; //Positions of the start and end of a rope (simple and complex) that will be placed
var support = false; //Whether a spring that will be placed is a normal spring or a support (just a spring with l0 = current distance between the two particles)
var tempTime = 0;
var externalLoopOn = false;

//If objects graphed is not empty at initialization, add the corresponding elements to DOM
for(var i = 0; i < objectsGraphed.length; i++){
	document.getElementById("variables").innerHTML += generateDomElement(i,objectsGraphed[i][2],objectsGraphed[i][3]);
}

function externalLoop(){

}

/*
loop is executed every frame of the simulation.
It handles calling scene.stepScene() and scene.draw()
It handles calling all draw functions in graphCanvas and adding points to graphCanvas each frame
It handles the time displayed in the timer/stopwatch
It handles adding particles, springs, supports, simple ropes, and complex ropes to the scene using the DOM
*/
function loop(){
		if(!paused){
			if(timerOn){
				timerTime += dtGeneral;
				updateDomTime();
			}

			for(var z = 0; z < objectsGraphed.length; z++){
				if(graphing[z]){
					var objectGraphed = objectsGraphed[z];
					var particleGraphed = scene.particles[objectGraphed[0]];
					var valueGraphed = shiftGraph;
					switch(objectGraphed[1]){
						case "x":
							valueGraphed += particleGraphed.pos[0];
						break;
						case "y":
							valueGraphed += particleGraphed.pos[1];
						break;
						case "vx":
							valueGraphed += particleGraphed.velocity[0];
						break;
						case "vy":
							valueGraphed += particleGraphed.velocity[1];
						break;
						case "d":
							var dx = particleGraphed.pos[0];
							var dy = particleGraphed.pos[1];
							valueGraphed += dist(dx,dy,0,0);
						break;
						case "v":
							var dvx = particleGraphed.velocity[0];
							var dvy = particleGraphed.velocity[1];
							valueGraphed += dist(dvx,dvy,0,0);
						break;
						case "KE":
							var dvx = particleGraphed.velocity[0];
							var dvy = particleGraphed.velocity[1];
							var vNorm = dist(dvx,dvy,0,0);
							valueGraphed += 0.5*particleGraphed.mass*vNorm*vNorm;
						break;
					}
					graphCanvas.addPoint(graphingTime,valueGraphed,z);
				}
			}
			var addedTime = false;
			for(var z = 0; z < graphing.length; z++){
				if(graphing[z]){
					graphingTime += dtGeneral;
					netAddedTime += dtGeneral;
					z = graphing.length;
					addedTime = true;
				}
			}
			if (netAddedTime - graphCanvas.currentPos[0]>(graphCanvas.currentPos[2] - graphCanvas.currentPos[0])/2){
				movingWithTime = true;
			}
			if(movingWithTime&&addedTime){
				graphCanvas.x1 += dtGeneral;
				graphCanvas.x2 += dtGeneral;
				graphCanvas.updateTransform();
			}
		}

		graphCanvas.graphBorder();
		graphCanvas.drawGraphLines();
		if(drawingCursor){
			graphCanvas.drawCursor(drawingPointPos[0],drawingPointPos[1]);
		}
		for(var i = 0; i < graphing.length; i++){
			if(graphing[i]){
				graphCanvas.drawGraph(i,objectsGraphed[i][3],objectsGraphed[i][4]);
			}
		}
		setTimeout(loop,1000*dtGeneral/timeControl);
}

function touchClick(mouseX,mouseY){
	var realCoord = mainCanvas.canToRealCoord(mouseX,mouseY);
	if(placing=="particle"){
		var fixedCopy = [0,0];
		fixedCopy[0] = toAddParticle[4][0];
		fixedCopy[1] = toAddParticle[4][1];
		scene.addParticle(realCoord[0],realCoord[1],parseFloat(toAddParticle[1][0]),parseFloat(toAddParticle[1][1]),fixedCopy,parseFloat(toAddParticle[0]),parseFloat(toAddParticle[2]),toAddParticle[3]);
		scene.startEnergy = scene.computeEnergy();
		placing = "0";
		scene.stepScene(dtGeneral);
		loop();
		canvas.removeEventListener("mouseover",function(){});
		canvas.removeEventListener("mouseout",function(){});
		canvas.removeEventListener("click",function(){});
		canvas.removeEventListener("touchstart",function(){});
		document.getElementById("currentCommand").innerHTML = "Current Command: Running Simulation";
	}else if(placing=="spring"){
		if(springElement1==-1){
			for(var i = 0; i < scene.numParticles; i++){
				if(dist(realCoord[0],realCoord[1],scene.particles[i].pos[0],scene.particles[i].pos[1])<scene.particles[i].radius){
					springElement1 = i;
					i = scene.numParticles;
				}
			}
			if(springElement1==-1){
			}else{
				document.getElementById("currentCommand").innerHTML = "Current Command: Select second object";
			}
		}else{
			for(var i = 0; i < scene.numParticles; i++){
				if(dist(realCoord[0],realCoord[1],scene.particles[i].pos[0],scene.particles[i].pos[1])<scene.particles[i].radius){
					if(springElement1!=i){
						springElement2 = i;
						i = scene.numParticles;
					}
				}
			}

			if(springElement2==-1){
			}else{
				scene.addEdge(springElement1,springElement2,toAddSpring[3],toAddSpring[4]);
				if(support){
					var supportL = dist(scene.particles[springElement1].pos[0],scene.particles[springElement1].pos[1],scene.particles[springElement2].pos[0],scene.particles[springElement2].pos[1]);
					scene.addSpringForce(scene.numEdges-1,toAddSpring[0],supportL,toAddSpring[2]);
					support = false;
				}else{
					scene.addSpringForce(scene.numEdges-1,toAddSpring[0],toAddSpring[1],toAddSpring[2]);
				}
				springElement1 = -1;
				springElement2 = -1;
				scene.startEnergy = scene.computeEnergy();
				placing = "0";
				loop();
				canvas.removeEventListener("mouseover",function(){});
				canvas.removeEventListener("mouseout",function(){});
				canvas.removeEventListener("click",function(){});
				canvas.removeEventListener("touchstart",function(){});
				document.getElementById("currentCommand").innerHTML = "Current Command: Running Simulation";
			}
		}
	}else if(placing=="rope"||placing=="simpleRope"){
		if(ropeElement==-1){
			ropePos[0] = realCoord;
			ropeElement = 1;
		}else{
			if(realCoord[0]!=ropePos[0][0]||realCoord[1]!=ropePos[0][1]){
				ropePos[1] = realCoord;
				ropeElement = -1;


				if(placing=="rope"){
					placing = "0";
					place("rope");
				}else if(placing=="simpleRope"){
					placing = "0";
					place("simpleRope");
				}
				scene.startEnergy = scene.computeEnergy();
				loop();
				canvas.removeEventListener("mouseover",function(){});
				canvas.removeEventListener("mouseout",function(){});
				canvas.removeEventListener("click",function(){});
				canvas.removeEventListener("touchstart",function(){});
				document.getElementById("currentCommand").innerHTML = "Current Command: Running Simulation";
			}
		}
	}
}
