/**
 * Created by epawlos on 2017-02-06.
 */

var canvasElement = document.getElementById("canvas");
var context = canvasElement.getContext('2d');
var isGameStarted = false;
var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
var intervalInput = document.getElementById("interval");

var DrawingMode = {
    DRAW: 'draw',
    ERASE: 'erase'
}
var activeMode = DrawingMode.DRAW;
var mousePressed = false;

var gameOfLifeBoard = [];

context.strokeStyle = 'black';
takenCell = 'black';
freeCell = 'white';
context.lineWidth=0.5;

cellSize = 10;
canvasWidth = canvasElement.width;
canvasHeight = canvasElement.height;
widthCellsCount = canvasWidth / cellSize;
heightCellsCount = canvasHeight / cellSize;

startButton.disabled = false;
stopButton.disabled = true;

initializeBoard();
var gameLoopInterval = setInterval(gameLoop, parseInt(intervalInput.value));

function startGame() {
    isGameStarted = true;
    startButton.disabled = true;
    stopButton.disabled = false;
}

function stopGame() {
    isGameStarted = false;
    startButton.disabled = false;
    stopButton.disabled = true;
}

function resetBoard() {
    initializeBoard();
    drawNet();
}

function gameLoop() {
    if (isGameStarted) {
        recalculateBoard();
    }
    drawNet();
}

canvasElement.addEventListener('click', function (event) {
    var mousePos = getCanvasMousePosition(canvasElement,event);
    var boardIndex = calculateCellIndex(mousePos.x, mousePos.y);

    switch (activeMode){
        case DrawingMode.DRAW:
            gameOfLifeBoard[boardIndex.x][boardIndex.y] = 1;
            break;
        case DrawingMode.ERASE:
            gameOfLifeBoard[boardIndex.x][boardIndex.y] = 0;
            break;
    }

    drawNet();
})

canvasElement.addEventListener('mousemove', function (event) {
    if(mousePressed) {
        var mousePos = getCanvasMousePosition(canvasElement,event);
        var boardIndex = calculateCellIndex(mousePos.x, mousePos.y);

        switch (activeMode){
            case DrawingMode.DRAW:
                gameOfLifeBoard[boardIndex.x][boardIndex.y] = 1;
                break;
            case DrawingMode.ERASE:
                gameOfLifeBoard[boardIndex.x][boardIndex.y] = 0;
                break;
        }

        drawNet();
    }
});

canvasElement.addEventListener('mousedown', function () {
    mousePressed = true;
});

canvasElement.addEventListener('mouseup', function () {
    mousePressed = false;
});

function enableDrawing() {
    activeMode = DrawingMode.DRAW;
}

function enableErasing() {
    activeMode = DrawingMode.ERASE;
}

function setGameInterval() {
    var newInterval = parseInt(intervalInput.value);
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, newInterval);
}

function drawNet(){
    var yPosition = 0;
    var xPosition = 0;

    gameOfLifeBoard.forEach(drawCell);

    while(yPosition < canvasHeight) {
       context.beginPath();
        context.moveTo(0, yPosition);
        context.lineTo(canvasWidth, yPosition);

        context.stroke();
        yPosition += cellSize;
    }

    while (xPosition < canvasWidth){
        context.beginPath();
        context.moveTo(xPosition, 0);
        context.lineTo(xPosition, canvasHeight);
        context.stroke();
        xPosition += cellSize;
    }

}

function drawCell(column, columnIndex) {
    column.forEach(function(cellValue, rowIndex) {
        if(cellValue == 0) {
            context.fillStyle = freeCell;
            context.fillRect(columnIndex * cellSize ,rowIndex *cellSize, cellSize,cellSize);
        }

        if(cellValue == 1) {
            context.fillStyle = takenCell;
            context.fillRect(columnIndex * cellSize ,rowIndex * cellSize, cellSize,cellSize);
        }
    })
}

function initializeBoard() {
    gameOfLifeBoard = [];
    for (var i = 0; i<heightCellsCount; i++) {
        var row = [];
        for (var j = 0; j<widthCellsCount; j++){
            row.push(0);
        }
        gameOfLifeBoard.push(row)
    }
}

function recalculateBoard() {
    var temporaryBoard = [];

    gameOfLifeBoard.forEach(function (column, columnIndex) {
        temporaryBoard.push([]);
        column.forEach(function (row, rowIndex) {
            var count = getNeighboursCount(columnIndex,rowIndex);

             if(gameOfLifeBoard[columnIndex][rowIndex] == 0){
                 if (count == 3){
                     temporaryBoard[columnIndex].push(1);
                 } else {
                     temporaryBoard[columnIndex].push(0);
                 }
             } else {
                 if((count == 3) || (count == 2)) {
                     temporaryBoard[columnIndex].push(1);
                 } else {
                     temporaryBoard[columnIndex].push(0);
                 }
             }

        })
    })

    gameOfLifeBoard = temporaryBoard;
}

function getNeighboursCount(xPos,yPos) {
    var neighbours = 0;
    for(var i = -1; i < 2; i++) {
        for(var j = -1; j <2 ;j++) {
            if((xPos + i >= 0) && (xPos + i < widthCellsCount)&& (yPos + j >= 0)&& (yPos + j < heightCellsCount)) {
                if (!((xPos + i == xPos) && (yPos + j == yPos))) {
                    neighbours += gameOfLifeBoard[xPos + i][yPos + j];
                }
            }
        }
    }
    return neighbours;
}

function getCanvasMousePosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function calculateCellIndex(posX, posY) {
    var xIndex;
    var yIndex;

    xIndex = Math.floor(posX / cellSize);
    yIndex = Math.floor(posY / cellSize);

    return{
        x: xIndex,
        y: yIndex
    }
}

