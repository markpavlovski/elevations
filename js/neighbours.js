/*
Goal: Implement https://www.codeproject.com/Articles/336915/Connected-Component-Labeling-Algorithm
use Union Find algorithm: http://www.cs.duke.edu/courses/cps100e/fall09/notes/UnionFind.pdf

This is a simplified problem with only one non-background elevation

*/


// Step 1: Define Helper Classes and Functions;
function randomInt(a,b){
	if ( b === undefined ){
		if ( a === undefined){
			b = 1;
			a = 0;
		} else {
			b = a;
			a = 0;
		}
	}
	return a + Math.floor(Math.random()*(b +1 -a));
}
function conditionalIncludeFactor(prob){
	if (Math.random() < prob){
		return 1;
	} else {
		return 0;
	}
}


class Matrix {
	constructor(rows, columns) {
		if(rows !== undefined && columns === undefined){
			this.rows = rows;
			this.columns = rows;
		} else {
			this.rows = rows;
			this.columns = columns;
		}

		this.data = [];
		for (var i = 0; i< this.rows; i++){
			this.data.push([]);
			for (var j=0; j< this.columns; j++){
				this.data[i].push(null);
			}
		}

		this.size = this.rows + "x" + this.columns;

	}
	setToValue(val){
		for (var i = 0; i < this.rows; i++){
			for (var j = 0; j < this.columns; j++){
				this.data[i][j] = val;
			}
		}
	}
	setToRandom(k,prob){
		if (prob === undefined){
			prob = 1;
		}
		for (var i = 0; i < this.rows; i++){
			for (var j = 0; j < this.columns; j++){
				this.data[i][j] = randomInt(k)*conditionalIncludeFactor(prob);
			}
		}
	}
	setToZero(){
		this.setToValue(0);
	}
	setToMax(){
		this.setToValue(Number.MAX_SAFE_INTEGER);
	}
	getMin(){
		var min = Number.MAX_SAFE_INTEGER;
		for (var i = 0; i < this.rows; i++){
			for (var j = 0; j < this.columns; j++){
				if (this.data[i][j] !== undefined && this.data[i][j] !== null && !isNaN(this.data[i][j])){
					min = Math.min(min, this.data[i][j]);
				}
			}
		}
		if( min === Number.MAX_SAFE_INTEGER ){
			return null;
		} else {
			return min;
		}
	}
	getMax(){
		var max = Number.MIN_SAFE_INTEGER;
		for (var i = 0; i < this.rows; i++){
			for (var j = 0; j < this.columns; j++){
				if (this.data[i][j] !== undefined && this.data[i][j] !== null && !isNaN(this.data[i][j])){
					max = Math.max(max, this.data[i][j]);
				}
			}
		}
		if( max === Number.MIN_SAFE_INTEGER ){
			return null;
		} else {
			return max;
		}
	}
}

class SingleLabelMatrix extends Matrix {
	constructor(maxtrix){
		super(matrix.rows, matrix.columns);
		this.inputData = matrix.data;
		this.buffer = new Matrix(3);
		this.parents = [];
	}
	setBuffer(k,l){
		this.buffer.setToValue(null);
		for (var i = 0; i < 3; i++){
			for (var j = 0; j < 3; j++){
				if ( k-1+i >= 0 && k-1+i <= this.rows -1  && l-1+j >= 0 && l-1+j <= this.columns -1 && this.inputData[k-1+i][l-1+j] === 1){
					this.buffer.data[i][j] = this.parents[this.data[k-1+i][l-1+j]];
				}
			}
		}
	}
	isValidLocation(i,j){
		if ( i < 0 || j < 0 || i >= this.rows || j >= this.columns ){
			return false;
		} else if ( this.data[i][j] === null || this.data[i][j] === undefined ){
			return false;
		} else if ( this.inputData[i][j] !== 1){
			return false;
		} else {
			return true;
		}
	}
	setLabels(){
		// Step 1 - Assign Initial Labels
		for (var i = 0; i < this.rows; i++){
			for (var j = 0; j < this.columns; j++){
				if (this.inputData[i][j] === 1){
					this.setBuffer(i,j);
					if (this.buffer.getMin() === null){
						this.data[i][j] = this.parents.length;
						this.parents.push(this.parents.length);
					} else {
						this.data[i][j] = this.parents[this.buffer.getMin()];
						this.parents[this.data[i][j]] = this.parents[this.buffer.getMin()];
						for (var m = 0; m < 3; m++){
							for (var n = 0; n < 3; n++){
								if ( this.isValidLocation(i-1+m, j-1+n) ){
									this.parents[this.parents[this.data[i-1+m][j-1+n]]] = this.parents[this.buffer.getMin()];
								}
							}
						}
					}
				}
			}
		}
		// Step 2 - Reassign Parents
		for (var i=0; i < this.parents.length; i++){
			while (this.parents[this.parents[i]] !== this.parents[i]){
				this.parents[i] = this.parents[this.parents[i]];
			}
		}
		// Step 3 - Relabel Parents
		var uniqueParents = [];
		for (var i=0; i < this.parents.length; i++){
			if(uniqueParents.indexOf(this.parents[i]) === -1){
				uniqueParents.push(this.parents[i])
			}
		}
		for (var i=0; i < this.parents.length; i++){
			this.parents[i] = uniqueParents.indexOf(this.parents[i])
		}
	}
	relabelMatrix(){
		for (var i = 0; i < this.rows; i++){
			for (var j = 0; j < this.columns; j++){
				if (this.data[i][j] === null){
					this.data[i][j] = "x";
				} else {
					this.data[i][j] = this.parents[this.data[i][j]];
				}
			}
		}
	}
	// getLabels method consolidates all steps into one and generates final labeled matrix.
	getLabels(){
		this.setLabels();
		//this.relabelParents();
		this.relabelMatrix();
		var outputMatrix = new Matrix(this.rows,this.columns);
		outputMatrix.data = this.data;
		return outputMatrix;
	}

}



class ShadedTable {
	constructor(matrix, labelMatrix, cellSize, targetDivId) {
		this.matrix = matrix;
		this.labelMatrix = labelMatrix;
		this.rows = matrix.rows;
		this.columns = matrix.columns;
		this.cellSize = cellSize;
		this.targetDivId = targetDivId;
		this.colorMatrix = new Matrix(matrix.rows,matrix.columns);
		this.HTMLString = "";
	}
	assignColor(){
		var max = this.labelMatrix.getMax();
		console.log(max)
		var min = this.labelMatrix.getMin();
		console.log(min)
		for (var i =0; i< this.rows; i++){
			for (var j =0; j< this.columns; j++){
				if (typeof this.labelMatrix.data[i][j] === 'number'){
					this.colorMatrix.data[i][j] = 230 - Math.floor(this.labelMatrix.data[i][j]/(max-min)*200);
				} else {
					this.colorMatrix.data[i][j] = 255
				}
			}
		}
	}
	render(){
		this.assignColor();

		for (var i =0; i< this.rows; i++){
			for (var j =0; j< this.columns; j++){
				this.HTMLString += "<div class='cell' id = 'cell' style='width: "+ this.cellSize + "px; height: "+ this.cellSize + "px; background: RGB("+ this.colorMatrix.data[i][j] + ", " + this.colorMatrix.data[i][j] + ", " + this.colorMatrix.data[i][j] + ");'>"+this.labelMatrix.data[i][j]+"</div>"
			}
		}

		var targetDiv = document.getElementById(this.targetDivId);
		targetDiv.style.width = this.columns * this.cellSize;
		targetDiv.innerHTML = this.HTMLString;
	}
}


var matrix = new Matrix(30,50);
matrix.setToRandom(1,.9)

var labeled = new SingleLabelMatrix(matrix);
var labelMatrix = labeled.getLabels();
var displayMatrix = new ShadedTable(matrix,labelMatrix, 25, "display");
displayMatrix.render();
