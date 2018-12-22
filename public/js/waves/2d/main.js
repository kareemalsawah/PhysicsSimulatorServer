var paused = true;
var numSlitsDom = document.getElementById("numSlits");
var freqDom = document.getElementById("freq");
var numSlits = 1;
var freq = 1.0;
var shiftLines = 5;
var shiftCircles = 0;
var dt = 100;
var shiftPerFrame = 0.3;
var mode = "waveFront"; //grayscale or color or wave-fronts
var minWaveFront = 0.99;
var mainCanvas = document.getElementById("canvas");
var mainCtx = mainCanvas.getContext("2d");

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

function updateVars(){
	numSlits = parseInt(numSlitsDom.value);
	freq = parseFloat(freqDom.value);
	var hiddenDom = document.getElementById("hiddenCanvas");
	hiddenDom.innerHTML = "";
	for(var i = 0; i < numSlits; i++){
		hiddenDom.innerHTML += '<canvas id="canvas'+i+'" width="'+mainCanvasWidth+'" height="'+mainCanvasHeight+'"></canvas>';
	}
	shiftLines = shiftCircles + 5.0/(freq*freq);
	drawScene();
}
updateVars();


function drawCircle(x,y,color,r,canvasCtx){
	if(mode=="grayscale"||mode=="color"){
		canvasCtx.beginPath();
		canvasCtx.arc(x,y, r, 0, 2 * Math.PI);
		canvasCtx.strokeStyle = color;
		canvasCtx.stroke();
		canvasCtx.closePath();
	}else if(mode=="waveFront"){
		canvasCtx.beginPath();
		canvasCtx.arc(x,y, r, 0, 2 * Math.PI);
		canvasCtx.strokeStyle = "white";
		canvasCtx.stroke();
		canvasCtx.closePath();
	}
}



function drawCircles(x,y,canvasCtx,frequency){
			canvasCtx.beginPath();
			canvasCtx.rect(0,0,mainCanvasWidth,mainCanvasHeight);
			canvasCtx.fillStyle = "black";
			canvasCtx.fill();
			canvasCtx.closePath();
			if(mode=="grayscale"||mode=="color"){
				canvasCtx.clearRect(0, 0, mainCanvasWidth, mainCanvasHeight);
				if(numSlits==1){
					canvasCtx.beginPath();
					canvasCtx.rect(0,0,mainCanvasWidth,mainCanvasHeight);
					canvasCtx.fillStyle = "white";
					canvasCtx.fill();
					canvasCtx.closePath();
				}
			}
for(var i = 0; i < canvas.width;i++){
	var toSubs = 1-i/10+shiftCircles;
	var waveHeight = (Math.sin(frequency*toSubs)+1)/2
	if(mode=="grayscale"){
		drawCircle(x,y,heatMapRGBForValue(waveHeight,numSlits),i,canvasCtx);
	}else if(mode=="color"){
		drawCircle(x,y,heatMapColorforValue(waveHeight,numSlits),i,canvasCtx);
	}else if(mode=="waveFront"){
		if(waveHeight>minWaveFront){
			drawCircle(x,y,0,i,canvasCtx);
		}
	}
}
}

function heatMapRGBForValue(value,frac){
	var h = value*255/frac;
	return "rgb(" + h + "," + h + "," + h + ")";
}

function heatMapColorforValue(value,frac){
	var h = (1.0 - value) * 240;
	var l = 50.0/frac;
	return "hsl(" + h + ", 100%, " + l+ "%)";
}

function stepScene(){
	drawScene();
	shiftLines += shiftPerFrame;
	shiftCircles += shiftPerFrame;
}

function drawScene(){
	if(mode=="waveFront"){
			mainCtx.beginPath();
			mainCtx.rect(0,0,mainCanvasWidth,mainCanvasHeight);
			mainCtx.fillStyle = "white";
			mainCtx.fill();
			mainCtx.closePath();
	}
	var positions = getSlitPositions();
	if(numSlits>1){
	for(var i = 0; i < numSlits; i++){
		var canvasDomToAdd = document.getElementById("canvas"+i);
		var ctxToAdd = canvasDomToAdd.getContext("2d");
		drawCircles(canvas.width/2,positions[i],ctxToAdd,freq);
	}

	let dst = new cv.Mat();
	let src1 = cv.imread("canvas0");
	let src2 = cv.imread("canvas1");
	cv.add(src1,src2,dst);
	src1.delete();
	src2.delete();
	for(var i = 2; i < numSlits; i++){
		let srci = cv.imread("canvas"+i);
		cv.add(srci,dst,dst);
		srci.delete();
	}


	mainCtx.clearRect(0, 0, mainCanvasWidth, mainCanvasHeight);
	cv.imshow('canvas', dst);
	dst.delete();
	}else{
	drawCircles(canvas.width/2,positions[0],mainCtx,freq);
	}


	mainCtx.beginPath();
	mainCtx.rect(0,0,mainCanvasWidth/2,mainCanvasHeight);
	mainCtx.fillStyle = "black";
	mainCtx.fill();
	mainCtx.closePath();

	drawLines(mainCtx);


	drawSlits(8,3,mainCtx);
}

function drawLine(x,color,canvasCtx){
	if(mode=="grayscale"||mode=="color"){
		canvasCtx.beginPath();
		canvasCtx.moveTo(x, 0);
		canvasCtx.lineTo(x, mainCanvasHeight);
		canvasCtx.strokeStyle = color;
		canvasCtx.stroke();
		canvasCtx.closePath();
	}else if(mode=="waveFront"){
		canvasCtx.beginPath();
		canvasCtx.moveTo(x, 0);
		canvasCtx.lineTo(x, mainCanvasHeight);
		canvasCtx.strokeStyle = "white";
		canvasCtx.stroke();
		canvasCtx.closePath();
	}
}

function drawLines(canvasCtx){
	for(var i = 0; i < mainCanvasWidth/2; i++){
		var toSubs = 1-i/10+shiftLines;
		var waveHeight = 1-(Math.sin(freq*toSubs)+1)/2;
		if(mode=="grayscale"){
			drawLine(i,heatMapRGBForValue(waveHeight,1),canvasCtx);
		}else if(mode=="color"){
			drawLine(i,heatMapColorforValue(waveHeight,1),canvasCtx);
		}else if(mode=="waveFront"){
			if(waveHeight>minWaveFront){
				drawLine(i,0,canvasCtx);
			}
		}
	}
}

function getSlitPositions(){
	var positions = [];
	for(var i = 0; i < numSlits; i++){
		positions.push(mainCanvasHeight/(numSlits+1)*(i+1));
	}
	return positions;
}

function drawSlits(wallWidth,slitWidth,canvasCtx){
	var positions = getSlitPositions();
	var lastHeight = 0;
	for(var i = 0; i < positions.length; i++){
		var y2 = positions[i]-slitWidth/2;
		drawSlit(lastHeight,y2,wallWidth,canvasCtx);
		lastHeight = y2+slitWidth;
	}
	drawSlit(lastHeight,mainCanvasHeight,wallWidth,canvasCtx);

}

function drawSlit(y1,y2,wallWidth,canvasCtx){
	canvasCtx.beginPath();
	canvasCtx.rect(mainCanvasWidth/2-wallWidth,y1,wallWidth,y2-y1);
	canvasCtx.fillStyle = "black";
	if(mode=="waveFront"){
		canvasCtx.fillStyle = "gray";
	}
	canvasCtx.fill();
	canvasCtx.closePath();
}

function loop(){
	if(!paused){
		stepScene();
	}
	setTimeout(loop,dt);
}
stepScene();
stepScene();
loop();
