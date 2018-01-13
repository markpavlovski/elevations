

// Convert percentage into hexadecimal greyscale color


function Shade(pct) {
	pct = 1 - pct
	var rgbComponent = Math.round(255 * pct)
	var hexComponent
	if (rgbComponent < 16 ){
		hexComponent = "0" + rgbComponent.toString(16)
	} else {
		hexComponent = rgbComponent.toString(16)
	}
	var hex = "#" + hexComponent + hexComponent + hexComponent
	return hex
}

// Get User Inputs
var inputloc = "47.659064, -122.354199";
var scale = 1;
var gridRadius = 3;
var loc = inputloc.split(", ");
var elevationData = data_1_3;
var contourStepSize = 60;


// Defaults
var tileRadius = 10;
var tileLength = 2 * tileRadius + 1;
var resolutionWidth = 0.001265; // Fremont city block length North-South
var gridLength = 2* gridRadius + 1;
var step = resolutionWidth * scale;
var tileSize = tileLength ** 2;
var gridSize = gridLength ** 2;


// Set Up Display
container = document.getElementById('container');
defaultCellSize = Math.round(0.85 * window.innerHeight / tileLength / gridLength);
defaultContainerSize = defaultCellSize * tileLength * gridLength;
container.style.width = defaultContainerSize + "px";

var minElv = Number.MAX_VALUE
var maxElv = -1

var elevationMatrix = [];
var elevationStepMatrix = [];
var elevationStepData = [];
var levelObjects = [];
var masterIndex = 0;
var mappingList = [];
var finalMappingList = [];

var matrixSize = tileLength * gridLength;

function calculateContours(){

	for (var i = 0; i < matrixSize; i++ ){
		elevationMatrix.push([]);
		elevationStepMatrix.push([]);
		levelObjects.push([]);
	}
	for (var i = 0; i < matrixSize; i++){
		for (var j = 0; j< matrixSize; j++){
			elevationMatrix[i][j] = elevationData[matrixSize*i + j].elv;
			elevationStepMatrix[i][j] = Math.max(Math.floor((elevationData[matrixSize*i + j].elv)/contourStepSize),-1)*contourStepSize;
			elevationStepData.push({
				lat: elevationData[matrixSize*i+j].lat,
				lng: elevationData[matrixSize*i+j].lng,
				elv: elevationStepMatrix[i][j],
			});
		}
	}

	for (var i = 0; i < matrixSize; i++){
		// first pass - forward row i
		for (var j = 0; j< matrixSize; j++){
			levelObjects[i][j] = {
				index: 0,
				elv: elevationStepMatrix[i][j]
			};
			if (i === 0){
				if (j > 0 && elevationStepMatrix[i][j] != elevationStepMatrix[i][j-1]){
					levelObjects[i][j].index = levelObjects[i][j-1].index + 1;
				} else if (j > 0){
					levelObjects[i][j].index = levelObjects[i][j-1].index;
				} 
				masterIndex = Math.max(masterIndex,levelObjects[i][j].index);
			} else {
				if (elevationStepMatrix[i][j] === elevationStepMatrix[i-1][j]){
					levelObjects[i][j].index = levelObjects[i-1][j].index;
				} else {
					if (j > 0 && elevationStepMatrix[i][j] != elevationStepMatrix[i][j-1]){
						levelObjects[i][j].index = Math.max(masterIndex + 1, levelObjects[i][j-1].index + 1);
						masterIndex = Math.max(masterIndex + 1, levelObjects[i][j-1].index + 1);
					} else if (j > 0){
						levelObjects[i][j].index = levelObjects[i][j-1].index;
						masterIndex = Math.max(masterIndex, levelObjects[i][j-1].index);

					} else {				
						levelObjects[i][0].index = levelObjects[i-1][matrixSize-1].index + 1;
						masterIndex = Math.max(masterIndex+1, levelObjects[i][0].index);
					}
				}
			}
		}
		// second pass - backward row i
		for (var j =  1; j < matrixSize; j++){
			if (elevationStepMatrix[i][matrixSize - j] === elevationStepMatrix[i][matrixSize - j - 1] && levelObjects[i][matrixSize-j].index != levelObjects[i][matrixSize-j-1].index){
				levelObjects[i][matrixSize-j-1].index = levelObjects[i][matrixSize-j].index;
				// if (levelObjects[i][matrixSize-j-1].index === masterIndex){
				// 	masterIndex--;
				// } 
			}
		}
	}

	// create a mapping list
	// for (var i = 0; i < masterIndex; i++ ){
	// 	mappingList.push([]);
	// }
	

	// create mapping

	for (var j = 0; j< matrixSize; j++){
		for (var i = 1; i < matrixSize; i++){
			// console.log(i + ', ' + j+ ', ' + elevationStepMatrix[matrixSize - i][j]+ ', ' + elevationStepMatrix[matrixSize - i - 1][j]+ ', ' + levelObjects[matrixSize - i - 1][j].index + ', ' + levelObjects[matrixSize - i - 1][j].index)
			if (elevationStepMatrix[matrixSize - i][j] === elevationStepMatrix[matrixSize - i - 1][j] && levelObjects[matrixSize - i][j].index != levelObjects[matrixSize - i - 1][j].index){
				// console.log('sup')
				newmap = [levelObjects[matrixSize - i - 1][j].index, levelObjects[matrixSize - i][j].index];
				mappingList.push(newmap);
			}
		}
	}

	// //filter mapping list
	// for (var i =1; i < mappingList.length; i++){
	// 	finalMappingList.push(mappingList[0]);
	// 	for (var j = 0; j < Math.min(mappingList.length, finalMappingList.length); j++){
	// 		console.log("hi")
	// 		if (mappingList[i][0] != finalMappingList[i][0] && mappingList[i][1] != finalMappingList[i][1]){
	// 			finalMappingList.push(mappingList[i]);
	// 		}
	// 	}
	// }






}
calculateContours();





function visualizeResults(elevationDataArray){

	tableHTMLString = ""
	tableHTMLStringNoElv = ""
	tableHTMLStringLevelIndex = ""
	groupIndex = ""
	for (var i = 0; i < elevationDataArray.length; i++){
		tableHTMLString += "<div class='cell' id='cell" + i +"''>"+Math.max(Math.round(elevationDataArray[i].elv),-1)+"</div>";
		groupIndex =  levelObjects[Math.floor((i-i%matrixSize)/matrixSize)][i % matrixSize].index;
		if (groupIndex < 10){
			groupIndex = "0"+groupIndex;
		}
		tableHTMLStringLevelIndex += "<div class='cell' id='cell" + i +"''> "+groupIndex+"</div>";
		tableHTMLStringNoElv += "<div class='cell' id='cell" + i +"''> "+"</div>";

		if (elevationDataArray[i].elv < minElv){ minElv = elevationDataArray[i].elv} 
		if (elevationDataArray[i].elv > maxElv){ maxElv = elevationDataArray[i].elv} 
	}
	container.innerHTML = tableHTMLStringLevelIndex;

	var activeCell;
	for (var i = 0; i < elevationDataArray.length; i++){
		cellColor = Shade( (elevationDataArray[i].elv - minElv) / (maxElv - minElv))
		activeCell = document.getElementById('cell' + i);
		activeCell.style.background = cellColor
		activeCell.style.width = defaultCellSize + "px"
		activeCell.style.height = defaultCellSize + "px"
		activeCell.style.lineheight = defaultCellSize + "px"
	}


	document.getElementById('cell'+Math.floor((elevationDataArray.length)/2)).style.color = '#ccffff';

	// Load THREEJS model
	//loadScene()
}
visualizeResults(elevationStepData);

document.getElementById('scaleDown').addEventListener('click', scaleTableDown, false);
document.getElementById('scaleUp').addEventListener('click', scaleTableUp, false);




var currentCellSize = defaultCellSize;
var currentContainerSize = defaultContainerSize;


function scaleTableDown(event) {
	var activeCell;
	var scale = 0.8;

	currentCellSize = scale * currentCellSize;
	currentContainerSize = scale * currentContainerSize;

	for (var i = 0; i < elevationData.length; i++){
		activeCell = document.getElementById('cell' + i);
		activeCell.style.width = currentCellSize + 'px'
		activeCell.style.height = currentCellSize + 'px'
		activeCell.style.lineheight = currentCellSize + 'px'
	}
	container.style.width = currentContainerSize + 'px'
}
function scaleTableUp(event) {
	var activeCell;
	var scale = 1/0.8;

	currentCellSize = scale * currentCellSize;
	currentContainerSize = scale * currentContainerSize;

	for (var i = 0; i < elevationData.length; i++){
		activeCell = document.getElementById('cell' + i);
		activeCell.style.width = currentCellSize + 'px'
		activeCell.style.height = currentCellSize + 'px'
		activeCell.style.lineheight = currentCellSize + 'px'
	}
	container.style.width = currentContainerSize + 'px'
}



