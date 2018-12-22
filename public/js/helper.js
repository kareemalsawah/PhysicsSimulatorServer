//Helper functions

//Returns the euclidean distance between two points (x1,y1) and (x2,y2)
function dist(x1,y1,x2,y2){
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

//Multiplies two matrices m1 and m2 (assumes their shapes are compatible) and returns the result
function multiplyMatrices(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

//returns an nxm matrix with all elements = num
function scalarMat(num,n,m){
	var result = [];
	for(var i = 0; i < m; i++){
		var toAdd = [];
		for(var j = 0; j < n; j++){
			if(i==j){
				toAdd.push(num);
			}else{
				toAdd.push(0);
			}
		}
		result.push(toAdd);
	}
	return result;
}

//returns and Identity matrix with shape size x size
function IdMatrix(size){
	var result = [];
	for(var i = 0; i < size; i++){
		var toAdd = [];
		for(var j = 0; j < size; j++){
			if(i==j){
				toAdd.push(1);
			}else{
				toAdd.push(0);
			}
		}
		result.push(toAdd);
	}
	return result;
}

//returns the l2 norm of a vector
function vecNorm(vec){
	var sum = 0;
	for(var i = 0; i < vec.length; i++){
		sum += vec[i]*vec[i];
	}
	return Math.sqrt(sum);
}

//Adds two matrices m1 and m2 (assumes their shapes are equal) and returns the result
function addMatrices(m1,m2){
	var result = [];
	for(var i = 0; i < m1.length; i++){
		var toAdd = [];
		for(var j = 0; j < m1[i].length; j++){
			toAdd.push(m1[i][j]+m2[i][j]);
		}
		result.push(toAdd);
	}
	return result;
}

//returns the transpose of the matrix m
function transposeMat(m){
	var result = [];
	for(var i = 0; i < m[0].length; i++){
		var toAdd = [];
		for(var j = 0; j < m.length; j++){
			toAdd.push(m[j][i]);
		}
		result.push(toAdd);
	}
	return result;
}

//returns the sum of 2 vectors
function addVecs(vec1,vec2){
	var result = [];
	for(var i = 0; i < vec1.length; i++){
		result.push(vec1[i]+vec2[i]);
	}
	return result;
}

//Multiplies each elements in a vector by a scalar and returns the result
function multiplyVecs(scal,vec){
	var result = [];
	for(var i = 0; i < vec.length; i++){
		result.push(vec[i]*scal);
	}
	return result;
}

//Converts 1-dimensional vector into a column vector (nx1 matrix) and returns the matrix
function vecToMat(vec){
	var result = [];
	for(var i = 0; i < vec.length; i++){
		var toAdd = [];
		toAdd.push(vec[i]);
		result.push(toAdd);
	}
	return result;
}

//Assumes mat is a column vector, converts it into a row vector (1-dimensional vector), and returns it
function matToVec(mat){
	var result = [];
	for(var i = 0; i < mat.length; i++){
		result.push(mat[i][0]);
	}
	return result;
}

//Formats a float to a number of decimalPoints and returns it
function formatFloat(num,decimalPoints){
	num *= Math.pow(10,decimalPoints);
	num = Math.round(num);
	num /= Math.pow(10,decimalPoints);
	return num;
}