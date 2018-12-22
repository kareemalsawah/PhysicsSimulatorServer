//Miscellanous Objects
/*
Notes:
	There are multiple coordinate systems used:
		Real-Coords: represents coords that are used in the simulation
		SimulationCanvas-Coords: representes coords that are used to draw elements on the simulation canvas
		GraphCanvas-Coords: represents coords that are used to draw elements on the graphing canvas
	All physical variables (position, velocity, etc.) are saved using real coordinates.
*/


/*
ball represents the particles in the simulation. It handles drawing them
, and keeps track of their physical properties and variables.
*/
function ball(x,y,vx,vy,fixed,mass,radius,color){
	this.pos = []; //Particle's current position (2-dimensional vector)
	this.pos.push(x);
	this.pos.push(y);
	this.mass = mass; //Particle's mass (scalar)
	this.velocity = []; //Particle's velocity (2-dimensional vector)
	this.velocity.push(vx);
	this.velocity.push(vy);
	this.radius = radius; //Particle's radius (only used to draw the particle, i.e doesn't affect the simulation)(scalar)
	this.color = color; //Particle's color (only used to draw the particle)(string)
	this.fixed = fixed; //2-dimensional vector that has boolean values that represent whether the particles is fixed along an axis

	//Draws the particle as a circle and writes a number in it = num
	this.draw = function(num){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		var realPos = mainCanvas.realToCanCoord(this.pos[0],this.pos[1]);
		var realRadius = mainCanvas.realToCanScale(this.radius);
		ctx.arc(realPos[0],realPos[1],realRadius,0,2*Math.PI);
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.fillStyle="green";
		ctx.fillText((num+1)+"",realPos[0]-3,realPos[1],realRadius);
		ctx.fill();
		ctx.closePath();
	}
}

/*
edge represents an edge that connects two particles. It mainly handles drawing the edge.
*/
function edge(p1,p2,radius,color){
	this.p1 = p1; //Index of the first particle
	this.p2 = p2; //Index of the second particle
	this.radius = radius; //The width of the line used to draw the edge
	this.color = color; //The color of the edge

	//Draws the edge given the positions of the particles
	this.draw = function(particle1,particle2){
		ctx.beginPath();
		var p1RealPos = mainCanvas.realToCanCoord(particle1.pos[0],particle1.pos[1]);
		var p2RealPos = mainCanvas.realToCanCoord(particle2.pos[0],particle2.pos[1]);
		var realRadius = mainCanvas.realToCanScale(this.radius);
		ctx.moveTo(p1RealPos[0],p1RealPos[1]);
		ctx.lineTo(p2RealPos[0],p2RealPos[1]);
		ctx.lineWidth = realRadius;
		ctx.strokeStyle = this.color;
		ctx.stroke();
		ctx.closePath();
	}
}

/*
Rope is used to construct the complex rope which is made of two layers of particles connected
with springs and springs connecting the top layer to the bottom layer in X shapes. This function
just adds the particles, edges, and spring forces to the scene.
*/
function rope(pos1,pos2,v1,v2,width,fixedEndpoints,mass,pRadius,pColor,sColor,k,pNum,kBeta,internalFixed){
	var particleMass = mass;
	var kBeta = kBeta;
	var p1 = new ball(pos1[0],pos1[1],v1[0],v1[1],fixedEndpoints[0],particleMass,pRadius,pColor);
	var p2 = new ball(pos2[0],pos2[1],v2[0],v2[1],fixedEndpoints[1],particleMass,pRadius,pColor);
	var width = width;
	var sColor = sColor;
	var k = k;
	var startParticles = scene.numParticles;
	var startEdges = scene.edges.length;
	scene.particles.push(p1);
	var len = dist(pos1[0],pos1[1],pos2[0],pos2[1]);
	var smallWidth = len/pNum;
	var edges = [];
	var springs = [];
	var wHat = [0,0];
	wHat[0] = (pos2[0]-pos1[0])/pNum;
	wHat[1] = (pos2[1]-pos1[1])/pNum;
	var nHat = [];
	nHat.push(-1*wHat[1]);
	nHat.push(wHat[0]);
	var nHatL = dist(0,0,nHat[0],nHat[1]);
	nHat[0] /= nHatL;
	nHat[1] /= nHatL;
	nHat[0] *= width/2;
	nHat[1] *= width/2;
	var pNum = pNum;
	var pRadius = pRadius;
	var pColor = pColor;
	var currentPos = pos1;
	for(var i = 0; i < pNum-1; i++){
		currentPos[0] += wHat[0];
		currentPos[1] += wHat[1];

		scene.particles.push(new ball(currentPos[0]+nHat[0],currentPos[1]+nHat[1],0,0,internalFixed,particleMass,pRadius,pColor));
		scene.particles.push(new ball(currentPos[0]-nHat[0],currentPos[1]-nHat[1],0,0,internalFixed,particleMass,pRadius,pColor));
		if(i>0){
			edges.push(new edge(startParticles+2*i+1,startParticles+2*i+2,pRadius,sColor));
			edges.push(new edge(startParticles+2*i+1,startParticles+2*i,pRadius,sColor));
			edges.push(new edge(startParticles+2*i-1,startParticles+2*i+2,pRadius,sColor));
			edges.push(new edge(startParticles+2*i-1,startParticles+2*i+1,pRadius,sColor));
			edges.push(new edge(startParticles+2*i,startParticles+2*i+2,pRadius,sColor));
		}else if(i==0){
			edges.push(new edge(startParticles+2*i+1,startParticles+2*i+2,pRadius,sColor));
			edges.push(new edge(startParticles,startParticles+2*i+1,pRadius,sColor));
			edges.push(new edge(startParticles,startParticles+2*i+2,pRadius,sColor));
		}
	}
	scene.particles.push(p2);
	scene.numParticles = scene.particles.length;
	edges.push(new edge(scene.numParticles-1,scene.numParticles-2,pRadius,sColor));
	edges.push(new edge(scene.numParticles-1,scene.numParticles-3,pRadius,sColor));

	for(var i = 0; i < edges.length; i++){
		scene.edges.push(edges[i]);
	}
	scene.numEdges = scene.edges.length;
	for(var i = 0; i < edges.length; i++){
		var l0 = dist(scene.particles[edges[i].p1].pos[0],scene.particles[edges[i].p1].pos[1],scene.particles[edges[i].p2].pos[0],scene.particles[edges[i].p2].pos[1]);
		scene.forceTypes.push(new SpringForce(startEdges+i,k,l0-0.05,kBeta));
	}
}

/*
simpleRope is used to construct the simple rope which is made of one layer of particles connected
with springs. This function just adds the particles, edges, and spring forces to the scene.
*/
function simpleRope(pos1,pos2,v1,v2,fixedEndpoints,mass,pRadius,pColor,sColor,k,pNum,kBeta,internalFixed){
	var particleMass = mass;
	var kBeta = kBeta;
	var p1 = new ball(pos1[0],pos1[1],v1[0],v1[1],fixedEndpoints[0],particleMass,pRadius,pColor);
	var p2 = new ball(pos2[0],pos2[1],v2[0],v2[1],fixedEndpoints[1],particleMass,pRadius,pColor);
	var sColor = sColor;
	var k = k;
	var startParticles = scene.numParticles;
	var startEdges = scene.edges.length;
	scene.particles.push(p1);
	var len = dist(pos1[0],pos1[1],pos2[0],pos2[1]);
	var smallWidth = len/pNum;
	var edges = [];
	var springs = [];
	var wHat = [0,0];
	wHat[0] = (pos2[0]-pos1[0])/pNum;
	wHat[1] = (pos2[1]-pos1[1])/pNum;
	var pNum = pNum;
	var pRadius = pRadius;
	var pColor = pColor;
	var currentPos = pos1;
	for(var i = 0; i < pNum-1; i++){
		currentPos[0] += wHat[0];
		currentPos[1] += wHat[1];

		scene.particles.push(new ball(currentPos[0],currentPos[1],0,0,internalFixed,particleMass,pRadius,pColor));
		edges.push(new edge(startParticles+i+1,startParticles+i,pRadius,sColor));
	}
	scene.particles.push(p2);
	edges.push(new edge(scene.particles.length-1,scene.particles.length-2,pRadius,sColor));
	scene.numParticles = scene.particles.length;

	for(var i = 0; i < edges.length; i++){
		scene.edges.push(edges[i]);
	}
	scene.numEdges = scene.edges.length;
	for(var i = 0; i < edges.length; i++){
		var l0 = dist(scene.particles[edges[i].p1].pos[0],scene.particles[edges[i].p1].pos[1],scene.particles[edges[i].p2].pos[0],scene.particles[edges[i].p2].pos[1]);
		scene.forceTypes.push(new SpringForce(startEdges+i,k,l0,kBeta));
	}
}


function simpleRopeTension(pos1,pos2,v1,v2,fixedEndpoints,mass,pRadius,pColor,sColor,k,pNum,kBeta,internalFixed,dl0){
	var particleMass = mass;
	var kBeta = kBeta;
	var p1 = new ball(pos1[0],pos1[1],v1[0],v1[1],fixedEndpoints[0],particleMass,pRadius,pColor);
	var p2 = new ball(pos2[0],pos2[1],v2[0],v2[1],fixedEndpoints[1],particleMass,pRadius,pColor);
	var sColor = sColor;
	var k = k;
	var startParticles = scene.numParticles;
	var startEdges = scene.edges.length;
	scene.particles.push(p1);
	var len = dist(pos1[0],pos1[1],pos2[0],pos2[1]);
	var smallWidth = len/pNum;
	var edges = [];
	var springs = [];
	var wHat = [0,0];
	wHat[0] = (pos2[0]-pos1[0])/pNum;
	wHat[1] = (pos2[1]-pos1[1])/pNum;
	var pNum = pNum;
	var pRadius = pRadius;
	var pColor = pColor;
	var currentPos = pos1;
	for(var i = 0; i < pNum-1; i++){
		currentPos[0] += wHat[0];
		currentPos[1] += wHat[1];

		scene.particles.push(new ball(currentPos[0],currentPos[1],0,0,internalFixed,particleMass,pRadius,pColor));
		edges.push(new edge(startParticles+i+1,startParticles+i,pRadius,sColor));
	}
	scene.particles.push(p2);
	edges.push(new edge(scene.particles.length-1,scene.particles.length-2,pRadius,sColor));
	scene.numParticles = scene.particles.length;

	for(var i = 0; i < edges.length; i++){
		scene.edges.push(edges[i]);
	}
	scene.numEdges = scene.edges.length;
	for(var i = 0; i < edges.length; i++){
		var l0 = dist(scene.particles[edges[i].p1].pos[0],scene.particles[edges[i].p1].pos[1],scene.particles[edges[i].p2].pos[0],scene.particles[edges[i].p2].pos[1]);
		scene.forceTypes.push(new SpringForce(startEdges+i,k,l0-dl0,kBeta));
	}
}

/*
graphingCanvas handles most features of the graphing. It has transformations from real coords to graphCanvas coords.
graphCanvas coords can be modified in order to scale or shift the graph. The object also draw outer boundaries
around the canvas and draws the axis lines. Finally, it draws a cursor on the graph and prints the cursor's position
in real coords at the top right corner.
*/
function graphingCanvas(x1,y1,x2,canvasToGraph,contextToGraph,radius,color){
	this.canvas = canvasToGraph; //canvas DOM element
	this.ctx = contextToGraph; //canvas context
	this.coordTransform = [0,0,0,0]; //Stores the top left and bottom right corners of the graphCanvas in real coords.
	y1 *= -1;
	var y2 = this.canvas.height*(x2-x1)/this.canvas.width + y1;
	this.coordTransform[1] = x1;
	this.coordTransform[3] = y1;
	this.coordTransform[0] = this.canvas.width/(x2-x1);
	this.coordTransform[2] = this.canvas.height/(y2-y1);
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.shiftX = 0;
	this.shiftY = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.currentPos = [this.x1,this.y1,this.x2,this.y2];
	this.color = color; //axis lines' color
	this.radius = radius; //axis lines' width
	this.points = []; //Will contain a matrix, each row has points that belong to a particular graph/curve
	this.graphColors = []; //Contains the color of each graph/curve
	this.interpolationMethod = "closest"; //Interpolation method for when the cursor is restricted
	this.cursorFree = true; //Whether cursor is free or restricted to be on the curves

	this.updateTransform = function(){
		this.currentPos[0] = this.x1*this.scaleX+this.shiftX;
		this.currentPos[1] = this.y1*this.scaleY+this.shiftY;
		this.currentPos[2] = this.x2*this.scaleX+this.shiftX;
		this.currentPos[3] = this.y2*this.scaleY+this.shiftY;
		this.coordTransform[1] = this.currentPos[0];
		this.coordTransform[3] = this.currentPos[1];
		this.coordTransform[0] = this.canvas.width/(this.currentPos[2]-this.currentPos[0]);
		this.coordTransform[2] = this.canvas.height/(this.currentPos[3]-this.currentPos[1]);
	}

	this.canToRealCoord = function(x,y){
		var result = [0,0];
		result[0] = (1/this.coordTransform[0])*x + this.coordTransform[1];
		result[1] = (1/this.coordTransform[2])*y + this.coordTransform[3];
		result[1] *= -1;
		return result;
	}

	this.realToCanCoord = function(x,y){
		var result = [0,0];
		y *= -1;
		result[0] = this.coordTransform[0]*(x - this.coordTransform[1]);
		result[1] = this.coordTransform[2]*(y - this.coordTransform[3]);
		return result;
	}

	this.realToCanScale = function(x){
		return this.coordTransform[0]*x;
	}

	this.drawGraphLines = function(){
		this.ctx.beginPath();
		var p1RealPos = this.realToCanCoord(this.currentPos[0],0);
		var p2RealPos = this.realToCanCoord(this.currentPos[2],0);
		this.ctx.moveTo(p1RealPos[0],p1RealPos[1]);
		this.ctx.lineTo(p2RealPos[0],p2RealPos[1]);
		this.ctx.lineWidth = this.radius;
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
		this.ctx.closePath();

		this.ctx.beginPath();
		var p1RealPos = this.realToCanCoord(0,this.currentPos[1]*-1);
		var p2RealPos = this.realToCanCoord(0,this.currentPos[3]*-1);
		this.ctx.moveTo(p1RealPos[0],p1RealPos[1]);
		this.ctx.lineTo(p2RealPos[0],p2RealPos[1]);
		this.ctx.lineWidth = this.radius;
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
		this.ctx.closePath();
	}

	this.graphBorder = function(){
		this.ctx.beginPath();
		this.ctx.rect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.fillStyle = "black";
		this.ctx.fill();
		this.ctx.closePath();
		this.ctx.beginPath();
		this.ctx.rect(this.radius,this.radius,this.canvas.width-2*this.radius,this.canvas.height-2*this.radius);
		this.ctx.fillStyle = "white";
		this.ctx.fill();
		this.ctx.closePath();
	}

	this.drawCursor = function(x,y){
		realCoord = graphCanvas.canToRealCoord(x,y);
		var posText = formatFloat(realCoord[0],2)+" , "+formatFloat(realCoord[1],2);
		this.ctx.beginPath();
		this.ctx.font = "10px Arial";
		this.ctx.fillStyle = "red";
		this.ctx.fillText(posText,this.canvas.width-65,15);
		this.ctx.closePath();
		if(this.cursorFree){
			this.ctx.beginPath();
			this.ctx.arc(x,y,2,0,2*Math.PI);
			this.ctx.fillStyle = "black";
			this.ctx.fill();
			this.ctx.closePath();
		}else{
			if(this.interpolationMethod=="closest"&&this.points.length>0){
				for(var j = 0; j < this.points.length; j++){
					currentError = 9999;
					currentPoint = 0;
					for(var i = 0; i < this.points[j].length; i++){
						if(Math.abs(this.points[j][i][0]-realCoord[0])<currentError){
							currentError = Math.abs(this.points[j][i][0]-realCoord[0]);
							currentPoint = i;
						}else{
							i = this.points[j].length;
						}
					}
					var canCoord = graphCanvas.realToCanCoord(this.points[j][currentPoint][0],this.points[j][currentPoint][1]);
					this.ctx.beginPath();
					this.ctx.arc(canCoord[0],canCoord[1],5,0,2*Math.PI);
					this.ctx.fillStyle = "black";
					this.ctx.fill();
					this.ctx.closePath();
				}
			}
		}
	}
	this.addPoint = function(x,y,index){
		var toAdd = [];
		toAdd.push(x);
		toAdd.push(y);
		while(this.points.length<=index){
			this.points.push([]);
		}
		this.points[index].push(toAdd);
	}

	this.drawGraph = function(index,color,shift){
		var prevPointIndex = 0;
		while(this.points.length<=index){
			this.points.push([]);
		}
		for(var i = 0; i < this.points[index].length; i++){
			var realPos = this.realToCanCoord(this.points[index][i][0],this.points[index][i][1]+shift);
			var p1RealPos = this.realToCanCoord(this.points[index][prevPointIndex][0],this.points[index][prevPointIndex][1]+shift);
			this.ctx.beginPath();
			this.ctx.moveTo(p1RealPos[0],p1RealPos[1]);
			this.ctx.lineTo(realPos[0],realPos[1]);
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
			this.ctx.closePath();
			if(i>0){
				var prevPointIndex = i-1;
			}
		}
	}

}

/*
simulationCanvas is a simnplified version of graphCanvas. It keeps track of transforms between real coords
and the simulationCanvas coords. It also draws outer boundaries and axis lines on the simulation canvas.
*/
function simulationCanvas(x1,y1,x2,canvasToGraph,contextToGraph,radius,color){
	this.canvas = canvasToGraph; //canvas DOM element
	this.ctx = contextToGraph; //canvas context
	this.coordTransform = [0,0,0,0]; //Stores the top left and bottom right corners of the simulationCanvas in real coords.
	y1 *= -1;
	var y2 = this.canvas.height*(x2-x1)/this.canvas.width + y1;
	this.coordTransform[1] = x1;
	this.coordTransform[3] = y1;
	this.coordTransform[0] = this.canvas.width/(x2-x1);
	this.coordTransform[2] = this.canvas.height/(y2-y1);
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.color = color; //axis lines' color
	this.radius = radius; //axis lines' width
	this.xScale = 1;
	this.yScale = 1;
	this.currentPos = [-10,7.5,10,0,1,0]; // Stores [x1,y1,x2,shiftX,scale,shiftY]

	//Update coordTransform using x1,y1,x2,y2
	this.updateTransform = function(){
		this.y1 *= -1;
		this.y2 = canvasHeight*(x2-x1)/canvasWidth + y1;
		this.coordTransform[1] = this.x1;
		this.coordTransform[3] = this.y1;
		this.coordTransform[0] = this.canvas.width/(this.x2-this.x1);
		this.coordTransform[2] = this.canvas.height/(this.y2-this.y1);
	}

	//Tranforms simulationCanvas coords to real coords and returns them as a 2-dimensional vector
	this.canToRealCoord = function(x,y){
		var result = [0,0];
		result[0] = (1/this.coordTransform[0])*x + this.coordTransform[1];
		result[1] = (1/this.coordTransform[2])*y + this.coordTransform[3];
		result[1] *= -1;
		return result;
	}

	//Tranforms real coords to simulationCanvas coords and returns them as a 2-dimensional vector
	this.realToCanCoord = function(x,y){
		var result = [0,0];
		y *= -1;
		result[0] = this.coordTransform[0]*(x - this.coordTransform[1]);
		result[1] = this.coordTransform[2]*(y - this.coordTransform[3]);
		return result;
	}

	//returns the scale of the transformation between real and simulationCanvas coords
	this.realToCanScale = function(x){
		return this.coordTransform[0]*x;
	}

	//Draws the axis lines
	this.drawGraphLines = function(){
		this.ctx.beginPath();
		var p1RealPos = this.realToCanCoord(this.x1,0);
		var p2RealPos = this.realToCanCoord(this.x2,0);
		this.ctx.moveTo(p1RealPos[0],p1RealPos[1]);
		this.ctx.lineTo(p2RealPos[0],p2RealPos[1]);
		this.ctx.lineWidth = this.radius;
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
		this.ctx.closePath();

		this.ctx.beginPath();
		var p1RealPos = this.realToCanCoord(0,this.y1*-1);
		var p2RealPos = this.realToCanCoord(0,this.y2*-1);
		this.ctx.moveTo(p1RealPos[0],p1RealPos[1]);
		this.ctx.lineTo(p2RealPos[0],p2RealPos[1]);
		this.ctx.lineWidth = this.radius;
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
		this.ctx.closePath();
	}

	//Draws a boundary around the canvas
	this.graphBorder = function(){
		this.ctx.beginPath();
		this.ctx.rect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.fillStyle = "black";
		this.ctx.fill();
		this.ctx.closePath();
		this.ctx.beginPath();
		this.ctx.rect(this.radius,this.radius,this.canvas.width-2*this.radius,this.canvas.height-2*this.radius);
		this.ctx.fillStyle = "white";
		this.ctx.fill();
		this.ctx.closePath();
	}
}

//An object that will be converted to a string (JSON.stringify) to save the current scene to be downloaded
function toDownload(sceneObj,graphCanv,settings){
	this.sceneObj = sceneObj;
	this.graphCanv = graphCanv;
	this.settings = settings;
}
