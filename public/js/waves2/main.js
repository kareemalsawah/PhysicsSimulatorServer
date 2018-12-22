//Global variables
var graphCanvasDom = document.getElementById("graphCanvas");
var graphCtx = graphCanvasDom.getContext("2d");
var graphCanvas = new graphingCanvas(-1,6.66,19,graphCanvasDom,graphCtx,1,"gray");

var canvasWidth = graphCanvas.x2;
var dtGeneral = 0.02; //dt that is used in scene.stepScene()
var timeControl = 1; //Determines how many times loop will be called (loop will be called every 1000*dtGeneral/timeControl milliseconds)
var inCanvas = false; //Whether mouse cursor is inside the simulation canvas
var paused = false; //Whether the simulation is running or paused (if paused scene.stepScene() will not be called)
var graphingTime = 0;
var graphing = [true,true,true]; //Whether a graph/curve is currently visible or hidden
var objectsGraphed = [["red",3],["blue",-1],["purple",-5]]; //Has information about each graph/curve added to variables (both visible and hidden)
var shiftGraph = 0;
var movingWithTime = false; //Whether the graphCanvas is shifting along the time/x axis (when the graph reaches the center the graph automatically shifts with the curve to allow it to be visible)
var netAddedTime = 0; //net time the simulation ran for
var timerOn = false; //Whether the timer/stopwatch was started
var timerTime = 0; //Time displayed in the timer/stopwatchvar tempTime = 0;
var drawingCursor = true
var dx = 0.01;
var waveInfo = [[1,10.7,20,0],[1,10,20,Math.PI]];
waveInfo = updateVars();

function updateVars(){
  var waveInfoT = [[0,0,0,0],[0,0,0,0]];
  var wave1 = document.getElementById("wave1").value.split(",");
  var wave2 = document.getElementById("wave2").value.split(",");
  for(var i = 0; i < wave1.length; i++){
    waveInfoT[0][i] = parseFloat(wave1[i]);
  }
  for(var i = 0; i < wave2.length; i++){
    waveInfoT[1][i] = parseFloat(wave2[i]);
  }
  return waveInfoT;
}

/*
loop is executed every frame of the simulation.
It handles calling stepScene()
It handles calling all draw functions in graphCanvas and adding points to graphCanvas each frame
It handles the time displayed in the timer/stopwatch
*/
function loop(){
		if(!paused){
			stepScene(dtGeneral);
			netAddedTime += dtGeneral;
			if(timerOn){
				timerTime += dtGeneral;
				updateDomTime();
			}

			for(var z = 0; z < objectsGraphed.length; z++){
				if(graphing[z]){
					graphCanvas.points[z] = getGraphedFunction(z);
				}
			}
		}

		graphCanvas.graphBorder();
		graphCanvas.drawGraphLines();
		if(drawingCursor){
			//graphCanvas.drawCursor(drawingPointPos[0],drawingPointPos[1]);
		}
		for(var i = 0; i < graphing.length; i++){
			if(graphing[i]){
				//graphCanvas.drawGraph(i,objectsGraphed[i][3],objectsGraphed[i][4]);
        graphCanvas.drawGraph(i,objectsGraphed[i][0],objectsGraphed[i][1]);
			}
		}
		setTimeout(loop,1000*dtGeneral/timeControl);
}

function getGraphedFunction(index){
  var points = [];
  if(index<2){
    for(var i = graphCanvas.x1; i < graphCanvas.x2; i+=dx){
      var toAdd = [];
      toAdd.push(i);
      var waveHeight = waveInfo[index][0]*Math.sin(waveInfo[index][1]*i+waveInfo[index][2]*netAddedTime+waveInfo[index][3]);
      toAdd.push(waveHeight);
      points.push(toAdd);
    }
  }else if(index==2){
    for(var i = graphCanvas.x1; i < graphCanvas.x2; i+=dx){
      var toAdd = [];
      toAdd.push(i);
      var waveHeight1 = waveInfo[0][0]*Math.sin(waveInfo[0][1]*i+waveInfo[0][2]*netAddedTime+waveInfo[0][3]);
      var waveHeight2 = waveInfo[1][0]*Math.sin(waveInfo[1][1]*i+waveInfo[1][2]*netAddedTime+waveInfo[1][3]);
      var waveHeight = waveHeight1 + waveHeight2;
      toAdd.push(waveHeight);
      points.push(toAdd);
    }
  }
  return points;
}
function stepScene(){

}





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
