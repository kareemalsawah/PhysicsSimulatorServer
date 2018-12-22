//Global variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
ctx.textBaseline = 'middle';
var mainCanvas = new simulationCanvas(-10,(canvas.height/canvas.width)*10,10,canvas,ctx,1,"black");

var graphCanvasDom = document.getElementById("graphCanvas");
var graphCtx = graphCanvasDom.getContext("2d");
var graphCanvas = new graphingCanvas(-1,6.66,19,graphCanvasDom,graphCtx,1,"gray");

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
	nextFrame();
}

function nextFrame(){
	if(placing=="0"){
		if(!paused){
			if(scene.particles.length>0){
				scene.stepScene(dtGeneral);
				tempTime += dtGeneral;
				if(externalLoop){
					externalLoop();
				}
			}
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

		scene.draw();
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
	}else{
		canvas.addEventListener("mouseover",function(){
			inCanvas = true;
		});
		canvas.addEventListener("mouseout",function(){
			inCanvas = false;
		});
		canvas.addEventListener("click",function(evt){
			if(inCanvas){
				var rect = canvas.getBoundingClientRect();
				var mouseX = evt.clientX - rect.left;
				var mouseY = evt.clientY - rect.top;
				touchClick(mouseX,mouseY);
			}
		});
		canvas.addEventListener("touchstart",function(evt){
			var rect = canvas.getBoundingClientRect();
			var touchX = evt.touches[0].clientX - rect.left;
			var touchY = evt.touches[0].clientY - rect.top;
			touchClick(touchX,touchY);
		});
	}
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
/*
scene controls most of the simulation's physical characteristics. It stores all particles, edges, and forces.
It updates their position as they move forward in time (Time Integration). It has 4 integration methods:
	-Explicit Euler
	-Symplectic Euler
	-Implicit Euler
	-ImplicitExplicit Euler (a mix between them that makes sure the total energy = inital energy of the system)
scene also calls draw for particles and edges.
*/
function Scene(particles,edges,integrationMethod,forceTypes){
	this.particles = particles; //Array that contains all particles
	this.edges = edges; //Array that contains all edges
	this.integrationMethod = integrationMethod; //String that contains which integration method will be used
	this.numParticles = particles.length;
	this.numEdges = edges.length;
	this.forceTypes = forceTypes; //Array containing all forces
	this.startEnergy = -1; //Initial system's energy
	this.currentEnergy = this.startEnergy; //Current system's energy
	this.maxLoopsForImplicit = 500; //max loops implicit euler is allowed to execute (terminates before reaching convergence is loops > 500)
	this.minConvergenceImplicit = 0.00000000001; //Minimum convergence required for implicit euler to terminate

	//Steps all objects in the simulation forward in time by dt
	this.stepScene = function(dt){
		//If the inital energy wasn't computed or was reset (when a particles or force is added), calculate the inital energy
		if(this.startEnergy==-1){
			this.startEnergy = this.computeEnergy();
		}

		var x = [];
		var v = [];
		var m = [];
		for (var i = 0; i < this.numParticles; i++){
			x.push(this.particles[i].pos[0]);
			x.push(this.particles[i].pos[1]);
			v.push(this.particles[i].velocity[0]);
			v.push(this.particles[i].velocity[1]);
			m.push(this.particles[i].mass);
			m.push(this.particles[i].mass);
		}

		var forces = this.calculateForces(x,v,m);
		if (this.integrationMethod=="ExplicitEuler"){
			this.ExplicitEuler(x,v,m,forces,dt);
		}else if(this.integrationMethod=="SymplecticEuler"){
    		this.SymplecticEuler(x,v,m,forces,dt);
		}else if(this.integrationMethod=="ImplicitEuler"){
			this.ImplicitEuler(x,v,m,forces,dt);
		}else if(this.integrationMethod=="LinearizedImplicit"){
			this.LinearizedImplicit(x,v,m,forces,dt);
		}else if(this.integrationMethod=="ImplicitExplicit"){
			this.ImplicitEuler(x,v,m,forces,dt);
    		this.currentEnergy = this.computeEnergy();
    		if(this.currentEnergy<this.startEnergy){
    			this.integrationMethod = "ExplicitImplicit";
    		}
		}else if(this.integrationMethod=="ExplicitImplicit"){
    		this.ExplicitEuler(x,v,m,forces,dt);
    		this.currentEnergy = this.computeEnergy();
    		if(this.currentEnergy>this.startEnergy){
    			this.integrationMethod = "ImplicitExplicit";
    		}
		}else if(this.integrationMethod=="ImplicitSymplectic"){
			this.ImplicitEuler(x,v,m,forces,dt);
    		this.currentEnergy = this.computeEnergy();
    		if(this.currentEnergy<this.startEnergy){
    			this.integrationMethod = "SymplecticImplicit";
    		}
		}else if(this.integrationMethod=="SymplecticImplicit"){
    		this.SymplecticEuler(x,v,m,forces,dt);
    		this.currentEnergy = this.computeEnergy();
    		if(this.currentEnergy>this.startEnergy){
    			this.integrationMethod = "ImplicitSymplectic";
    		}
		}else{
			console.log("Integration Method "+this.integrationMethod+" wasn't found");
		}
	}

	this.ExplicitEuler = function(x,v,m,forces,dt){
		for(var i = 0; i < this.numParticles; i++){
	        if(!this.particles[i].fixed[0]){
	            this.particles[i].velocity[0] = v[2*i] + (dt*forces[2*i]/m[2*i]);
	            this.particles[i].pos[0] = x[2*i]+dt*v[2*i];
        	}
        	if(!this.particles[i].fixed[1]){
	            this.particles[i].velocity[1] = v[2*i+1] + (dt*forces[2*i+1]/m[2*i+1]);
	            this.particles[i].pos[1] = x[2*i+1]+dt*v[2*i+1];
        	}
		}
	}

	this.SymplecticEuler = function(x,v,m,forces,dt){
		for(var i = 0; i < this.numParticles; i++){
	        var newVel = [];
	        newVel.push(v[2*i] + (dt*forces[2*i]/m[2*i]));
	        newVel.push(v[2*i+1] + (dt*forces[2*i+1]/m[2*i+1]));
	        if(!this.particles[i].fixed[0]){
	            this.particles[i].velocity[0] = newVel[0];
	            this.particles[i].pos[0] = x[2*i]+dt*newVel[0];
        	}
        	if(!this.particles[i].fixed[1]){
	            this.particles[i].velocity[1] = newVel[1];
	            this.particles[i].pos[1] = x[2*i+1]+dt*newVel[1];
        	}
		}
	}

	this.ImplicitEuler = function(x,v,m,forces,dt){
		var converged = false;
		var currentX = x;
		var currentV = v;
		var M = IdMatrix(x.length);
		for(var i = 0; i < x.length; i++){
			M[i][i] = m[i];
		}
		var index = 0;
		while(!converged){
			var dfdq = scalarMat(0,x.length,x.length);
			var dfdv = scalarMat(0,x.length,x.length);
			dfdq = this.addHessX(dfdq,addVecs(x,multiplyVecs(dt,currentV)),currentV,m);
			dfdv = this.addHessV(dfdv,addVecs(x,multiplyVecs(dt,currentV)),currentV,m);
			dfdq = multiplyMatrices(scalarMat(-1,x.length,x.length),dfdq);
			dfdv = multiplyMatrices(scalarMat(-1,x.length,x.length),dfdv);
			forces = this.calculateForces(addVecs(x,multiplyVecs(dt,currentV)),currentV,m);
			var toInvert = addMatrices(multiplyMatrices(scalarMat(dt*dt,x.length,x.length),dfdq),multiplyMatrices(scalarMat(dt,x.length,x.length),dfdv));
			toInvert = addMatrices(M,multiplyMatrices(scalarMat(-1,x.length,x.length),toInvert));
			for(var i = 0; i < this.numParticles/2; i++){
				if(scene.particles[i].fixed[0]){
					forces[2*i] = 0;
					for(var j = 0; j < toInvert[2*i].length; j++){
						toInvert[2*i][j] = 0;
					}
					var tempMat = transposeMat(toInvert);
					for(var j = 0; j < tempMat[2*i].length; j++){
						tempMat[2*i][j] = 0;
					}
					toInvert = transposeMat(tempMat);
					toInvert[2*i][2*i] = 1;
				}
				if(scene.particles[i].fixed[1]){
					forces[2*i+1] = 0;
					for(var j = 0; j < toInvert[2*i+1].length; j++){
						toInvert[2*i+1][j] = 0;
					}
					var tempMat = transposeMat(toInvert);
					for(var j = 0; j < tempMat[2*i+1].length; j++){
						tempMat[2*i+1][j] = 0;
					}
					toInvert = transposeMat(tempMat);
					toInvert[2*i+1][2*i+1] = 1;
				}
			}
			var rightSide = multiplyMatrices(M,vecToMat(addVecs(currentV,multiplyVecs(-1,v))));
			rightSide = addMatrices(vecToMat(multiplyVecs(-1,matToVec(rightSide))),vecToMat(multiplyVecs(dt,forces)));
			var dv = multiplyMatrices(transposeMat(rightSide),math.inv(toInvert))[0];
			currentV = addVecs(currentV,dv);
			if(vecNorm(dv)<this.minConvergenceImplicit){
				converged = true;
			}
			if(index>this.maxLoopsForImplicit){
				converged = true;
				console.log("loop");
			}
			index++;
		}
		currentX = addVecs(x,multiplyVecs(dt,currentV));

		for(var i = 0; i < this.numParticles; i++){
	        if(!this.particles[i].fixed[0]){
	            this.particles[i].velocity[0] = currentV[2*i];
	            this.particles[i].pos[0] = currentX[2*i];
        	}
        	if(!this.particles[i].fixed[1]){
	            this.particles[i].velocity[1] = currentV[2*i+1];
	            this.particles[i].pos[1] = currentX[2*i+1];
        	}
		}
	}

	this.LinearizedImplicit = function(x,v,m,forces,dt){
		var currentX = x;
		var currentV = v;
		var M = IdMatrix(x.length);
		for(var i = 0; i < x.length; i++){
			M[i][i] = m[i];
		}
		var dfdq = scalarMat(0,x.length,x.length);
		var dfdv = scalarMat(0,x.length,x.length);
		dfdq = this.addHessX(dfdq,addVecs(x,multiplyVecs(dt,currentV)),currentV,m);
		dfdv = this.addHessV(dfdv,addVecs(x,multiplyVecs(dt,currentV)),currentV,m);
		dfdq = multiplyMatrices(scalarMat(-1,x.length,x.length),dfdq);
		dfdv = multiplyMatrices(scalarMat(-1,x.length,x.length),dfdv);
		forces = this.calculateForces(addVecs(x,multiplyVecs(dt,currentV)),currentV,m);
		var toInvert = addMatrices(multiplyMatrices(scalarMat(dt*dt,x.length,x.length),dfdq),multiplyMatrices(scalarMat(dt,x.length,x.length),dfdv));
		toInvert = addMatrices(M,multiplyMatrices(scalarMat(-1,x.length,x.length),toInvert));
		for(var i = 0; i < this.numParticles/2; i++){
			if(scene.particles[i].fixed[0]){
				forces[2*i] = 0;
				for(var j = 0; j < toInvert[2*i].length; j++){
					toInvert[2*i][j] = 0;
				}
				var tempMat = transposeMat(toInvert);
				for(var j = 0; j < tempMat[2*i].length; j++){
					tempMat[2*i][j] = 0;
				}
				toInvert = transposeMat(tempMat);
				toInvert[2*i][2*i] = 1;
			}
			if(scene.particles[i].fixed[1]){
				forces[2*i+1] = 0;
				for(var j = 0; j < toInvert[2*i+1].length; j++){
					toInvert[2*i+1][j] = 0;
				}
				var tempMat = transposeMat(toInvert);
				for(var j = 0; j < tempMat[2*i+1].length; j++){
					tempMat[2*i+1][j] = 0;
				}
				toInvert = transposeMat(tempMat);
				toInvert[2*i+1][2*i+1] = 1;
			}
		}
		var rightSide = multiplyMatrices(M,vecToMat(addVecs(currentV,multiplyVecs(-1,v))));
		rightSide = addMatrices(vecToMat(multiplyVecs(-1,matToVec(rightSide))),vecToMat(multiplyVecs(dt,forces)));
		var dv = multiplyMatrices(transposeMat(rightSide),math.inv(toInvert))[0];
		currentV = addVecs(currentV,dv);
		currentX = addVecs(x,multiplyVecs(dt,currentV));

		for(var i = 0; i < this.numParticles; i++){
	        if(!this.particles[i].fixed[0]){
	            this.particles[i].velocity[0] = currentV[2*i];
	            this.particles[i].pos[0] = currentX[2*i];
        	}
        	if(!this.particles[i].fixed[1]){
	            this.particles[i].velocity[1] = currentV[2*i+1];
	            this.particles[i].pos[1] = currentX[2*i+1];
        	}
		}
	}


	//Draws a white blank canvas, out lines, axis lines, then calls draw for each particle and edge.
	this.draw = function(){
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fill();
		ctx.closePath();
		mainCanvas.graphBorder();
		mainCanvas.drawGraphLines();
		for(var i = 0; i < this.numEdges; i++){
			this.edges[i].draw(this.particles[this.edges[i].p1],this.particles[this.edges[i].p2]);
		}
		for(var i = 0; i < this.numParticles; i++){
			this.particles[i].draw(i);
		}
	}

	//returns a vector containing 2 components of the force applied on each particle
	this.calculateForces = function(x,v,m){
		forces = [];
		for(var i = 0; i < this.numParticles; i++){
			forces.push(0.0);
			forces.push(0.0);
		}
		for(var i = 0; i < this.forceTypes.length; i++){
			if (this.forceTypes[i].type=="SpringForce"){
				var forceEdge = this.edges[this.forceTypes[i].edgeIndex];
				forces = this.forceTypes[i].addGradE(x,v,m,forces,forceEdge,this.particles[forceEdge.p1],this.particles[forceEdge.p2]);
			}else{
				forces = this.forceTypes[i].addGradE(x,v,m,forces);
			}
		}
		return forces;
	}

	//computes HessX for all forces, adds it to HessX, and returns HessX
	this.addHessX = function(HessX,x,v,m){
		for(var i = 0; i < this.forceTypes.length; i++){
			if(this.forceTypes[i].type=="SpringForce"){
				var forceEdge = this.edges[this.forceTypes[i].edgeIndex];
				HessX = this.forceTypes[i].addHessX(x,v,m,HessX,forceEdge,this.particles[forceEdge.p1],this.particles[forceEdge.p2]);
			}
		}
		return HessX;
	}

	//computes HessV for all forces, adds it to HessV, and returns HessV
	this.addHessV = function(HessV,x,v,m){
		for(var i = 0; i < this.forceTypes.length; i++){
			if(this.forceTypes[i].type=="SpringForce"){
				var forceEdge = this.edges[this.forceTypes[i].edgeIndex];
				HessV = this.forceTypes[i].addHessV(x,v,m,HessV,forceEdge,this.particles[forceEdge.p1],this.particles[forceEdge.p2]);
			}
		}
		return HessV;
	}

	//returns the system's current total energy = potential energy + kinetic energy
	this.computeEnergy = function(){
		return this.computePotentialEnergy()+this.computeKineticEnergy();
	}

	//returns the net potential energy in the system
	this.computePotentialEnergy = function(){
		var E = 0;
		var x = [];
		var v = [];
		var m = [];
		for (var i = 0; i < this.numParticles; i++){
			x.push(this.particles[i].pos[0]);
			x.push(this.particles[i].pos[1]);
			v.push(this.particles[i].velocity[0]);
			v.push(this.particles[i].velocity[1]);
			m.push(this.particles[i].mass);
			m.push(this.particles[i].mass);
		}

		for(var i = 0; i < this.forceTypes.length; i++){
			if(this.forceTypes[i].type=="SpringForce"){
				var forceEdge = this.edges[this.forceTypes[i].edgeIndex];
				E = this.forceTypes[i].addE(x,v,m,E,forceEdge,this.particles[forceEdge.p1],this.particles[forceEdge.p2]);
				this.startEnergy = this.forceTypes[i].subtractE(x,v,m,this.startEnergy,forceEdge,this.particles[forceEdge.p1],this.particles[forceEdge.p2]);
			}else if(this.forceTypes[i].type=="SimpleGravity"){
				E = this.forceTypes[i].addE(x,v,m,E);
			}else if(this.forceTypes[i]=="DragDampingForce"){
				this.startEnergy = this.forceTypes[i].addE(x,v,m,this.startEnergy);
			}
		}
		return E;
	}

	//returns the sum of kinetic energies for all particles
	this.computeKineticEnergy = function(){
		var result = 0;
		var x = [];
		var v = [];
		var m = [];
		for (var i = 0; i < this.numParticles; i++){
			x.push(this.particles[i].pos[0]);
			x.push(this.particles[i].pos[1]);
			v.push(this.particles[i].velocity[0]);
			v.push(this.particles[i].velocity[1]);
			m.push(this.particles[i].mass);
			m.push(this.particles[i].mass);
		}

		for(var i = 0; i < this.numParticles; i++){
			result += 0.5*m[2*i]*vecNorm([v[2*i],v[2*i+1]])*vecNorm([v[2*i],v[2*i+1]]);
		}
		return result;
	}

	//Adds a new particle to the scene
	this.addParticle = function(x,y,vx,vy,fixed,mass,radius,color){
		this.particles.push(new ball(x,y,vx,vy,fixed,mass,radius,color));
		this.numParticles++;
	}

	//Adds a new edge to the scene
	this.addEdge = function(p1,p2,radius,color){
		this.edges.push(new edge(p1,p2,radius,color));
		this.numEdges++;
	}

	//Adds a new force to the scene
	this.addSpringForce = function(edgeIndex,k,l0,b){
		this.forceTypes.push(new SpringForce(edgeIndex,k,l0,b));

	}
}
