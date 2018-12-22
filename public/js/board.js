var canvasBoard = document.getElementById("boardCanvas");
var boardCtx = canvasBoard.getContext("2d");
var boardWidth = canvasBoard.clientWidth;
var boardHeight = canvasBoard.clientHeight;

function drawBackground(){
  boardCtx.beginPath();
  boardCtx.rect(0,0,canvasBoard.width,canvasBoard.height);
  boardCtx.fillStyle = "black";
  boardCtx.fill();
  boardCtx.closePath();
}


var inCanvasBoard = false;
var drawing = false;
var pointsBoard = [[]];
var dtBoard = 50;

function loopBoard(){
boardCtx.clearRect(0, 0, boardWidth, boardHeight);
  for(var i = 0; i < pointsBoard.length; i++){
    drawPointsFromBoardArr(pointsBoard[i]);
  }
  setTimeout(loopBoard,dtBoard);
}
loopBoard();
function drawPointsFromBoardArr(arr){
for(var i = 0; i < arr.length; i++){
  drawPoint(arr[i][0],arr[i][1]);
}
if(arr.length>1){
  var firstPoint = arr[0];
  for(var i = 1; i < arr.length; i++){
    drawBoardLine(firstPoint,arr[i]);
    firstPoint = arr[i];
  }
}
}

function undo(){
  if(pointsBoard.length>1){
    pointsBoard.splice(pointsBoard.length-2,1);
  }
}

function drawPoint(x,y){
boardCtx.beginPath();
boardCtx.arc(x,y, 3, 0, 2 * Math.PI);
boardCtx.fillStyle = "red";
boardCtx.fill();
boardCtx.closePath();
}

function drawBoardLine(arr1,arr2){
boardCtx.beginPath();
boardCtx.moveTo(arr1[0],arr1[1]);
boardCtx.lineTo(arr2[0],arr2[1]);
boardCtx.lineWidth = 6;
boardCtx.strokeStyle = "red";
boardCtx.stroke();
boardCtx.closePath();
}
//Events
canvasBoard.addEventListener("mousemove",function(evt){
  var rect = canvasBoard.getBoundingClientRect();
  var mouseX = evt.clientX - rect.left;
  var mouseY = evt.clientY - rect.top;
  if(inCanvasBoard&&drawing&&boardOn){
    var newPoint = [mouseX,mouseY];
    pointsBoard[pointsBoard.length-1].push(newPoint);
  }

});


canvasBoard.addEventListener("touchmove",function(evt){
  var rect = canvasBoard.getBoundingClientRect();
  var mouseX = evt.clientX - rect.left;
  var mouseY = evt.clientY - rect.top;
  if(inCanvasBoard&&drawing&&boardOn){
    var newPoint = [mouseX,mouseY];
    pointsBoard[pointsBoard.length-1].push(newPoint);
  }

});

canvasBoard.addEventListener("mouseover",function(){
  inCanvasBoard = true;
});

canvasBoard.addEventListener("mouseout",function(){
  inCanvasBoard = false;
});

document.addEventListener("mousedown",function(evt){
  drawing = true;
  if(inCanvasBoard&&boardOn){
    var rect = canvasBoard.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;
    var newPoint = [mouseX,mouseY];
    pointsBoard[pointsBoard.length-1].push(newPoint);
  }

});

document.addEventListener("mouseup",function(){
  drawing = false;
  if(pointsBoard[pointsBoard.length-1].length>0){
    pointsBoard.push([]);
  }
});


document.addEventListener("touchstart",function(evt){
  drawing = true;
  if(inCanvasBoard&&boardOn){
    var rect = canvasBoard.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;
    var newPoint = [mouseX,mouseY];
    pointsBoard[pointsBoard.length-1].push(newPoint);
  }

});

document.addEventListener("touchend",function(){
  drawing = false;
  if(pointsBoard[pointsBoard.length-1].length>0){
    pointsBoard.push([]);
  }
});


var boardOn = false;
function boardSwitch(){
  if(boardOn){
    document.getElementById("boardMode").style = "display:none;";
    document.getElementById("undoBtn").style = "display:none;";
  	document.getElementById("boardA").classList.remove("active");
    boardOn = false;
  } else{
    document.getElementById("boardMode").style = "display:block;";
    document.getElementById("undoBtn").style = "display:block;";
  	document.getElementById("boardA").classList.add("active");
    boardOn = true;
    boardWidth = canvasBoard.clientWidth;
    boardHeight = canvasBoard.clientHeight;
  }
}
