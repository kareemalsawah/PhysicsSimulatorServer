//Force Object
/*
Each force is represented as an object. All forces have the following functions:
	addE(...,E): adds the potential energy as a result of the force to E and returns it
	addGradE(...,gradE): adds the gradient of the potential energy (force is negative the gradient) to gradE and returns it
	addHessX(...,HessX): adds the hessian of the potential energy with respect to X(similar to 2nd derivative but for gradients) to the matrix HessX and returns it
	addHessV(...,HessV): adds the hessian of the potential energy with respect to V to HessV and returns it
Exceptions:
	SimpleGravity and GravitationalForce don't have addHessX and addHessV because their hessians are zero
	In DragDampingForce addE actually reduces the energy because it is a damping force
	In SpringForce subtractE(...,E) subtracts the energy reduced due to the effect of spring damping
All forces have a variable "type" that specifies the type of each force
*/

function SimpleGravity(gravity){
	this.gravity = gravity; //A 2-dimensional vector that specifies the acceleration due to gravity
	this.type = "SimpleGravity";

	this.addGradE = function(x,v,m,gradE){
		for(var i = 0; i < x.length; i+=2){
	       gradE[i] += this.gravity[0]*m[i];
	       gradE[i+1] += this.gravity[1]*m[i+1];
	    }
	    return gradE;
	}

	this.addE = function(x,v,m,E){
		for(var i = 0; i < x.length/2; i++){
	        E -= x[2*i]*this.gravity[0]*m[2*i];
	        E -= x[2*i+1]*this.gravity[1]*m[2*i+1];
    	}
    	return E;
	}
}

function DragDampingForce(beta){
	this.beta = beta; //A scalar that represents the damping coefficient
	this.type = "DragDampingForce";

	this.addE = function(x,v,m,E){
		for(var i = 0; i < x.length; i+=2){
			var speed = vecNorm([v[2*i],v[2*i+1]]);
			E -= this.beta*speed*speed/m[2*i];
		}
		return E;
	}

	this.addGradE = function(x,v,m,gradE){
		for(var i = 0; i < x.length; i++){
			gradE[i] -= this.beta*v[i];
		}
		return gradE;
	}

	this.addHessX = function(x,v,m,HessX){

		return HessX;
	}

	this.addHessV = function(x,v,m,HessV){

		return HessV;
	}
	
}

function SpringForce(edgeIndex,k,l0,dampingBeta){
	this.edgeIndex = edgeIndex; //Integer to represent the edge that the SpringForce acts on
	this.k = k; //Spring constant K
	this.l0 = l0; //Resting length of the spring
	this.dampingBeta = dampingBeta; //Damping Coefficient
	this.type = "SpringForce";

	this.addE = function(x,v,m,E,edge,particle1,particle2){
		var currentLength = Math.sqrt(Math.pow(x[2*edge.p1]-x[2*edge.p2],2)+Math.pow(x[2*edge.p1+1]-x[2*edge.p2+1],2));
		E += 0.5*this.k*(currentLength-this.l0)*(currentLength-this.l0);
		return E;
	}

	this.subtractE = function(x,v,m,E,edge,particle1,particle2){	
		var diff1 = x[2*edge.p1]-x[2*edge.p2];
		var diff2 = x[2*edge.p1+1]-x[2*edge.p2+1];
		var currentLength = Math.sqrt(diff1*diff1+diff2*diff2);
		var n = [];
		n[0] = diff1/currentLength;
		n[1] = diff2/currentLength;
		var diffV1 = v[2*edge.p1] - v[2*edge.p2];
		var diffV2 = v[2*edge.p1+1] - v[2*edge.p2+1];
		var magDamp = this.dampingBeta*diffV1*n[0]+this.dampingBeta*diffV2*n[1];
		var magDampSquared = (magDamp*magDamp)/2;
		E -= magDampSquared/m[2*edge.p1]+magDampSquared/m[2*edge.p2];
		return E;
	}
	this.addGradE = function(x,v,m,gradE,edge,particle1,particle2){
		var diff1 = x[2*edge.p1]-x[2*edge.p2];
		var diff2 = x[2*edge.p1+1]-x[2*edge.p2+1];
		var currentLength = Math.sqrt(diff1*diff1+diff2*diff2);
		var magF = this.k*(currentLength-this.l0);
		var n = [];
		n[0] = diff1/currentLength;
		n[1] = diff2/currentLength;
		var diffV1 = v[2*edge.p1] - v[2*edge.p2];
		var diffV2 = v[2*edge.p1+1] - v[2*edge.p2+1];
		var magDamp = this.dampingBeta*diffV1*n[0]+this.dampingBeta*diffV2*n[1];
		gradE[2*edge.p1] -= n[0]*magF + n[0]*magDamp;
		gradE[2*edge.p1+1] -= n[1]*magF + n[1]*magDamp;
		gradE[2*edge.p2] += n[0]*magF + n[0]*magDamp;
		gradE[2*edge.p2+1] += n[1]*magF + n[1]*magDamp;
		return gradE;
	}

	this.addHessX = function(x,v,m,HessX,edge,particle1,particle2){
		var Id = IdMatrix(2);
		var n = [0,0];
		var q1X = [0,0];
		var q2X = [0,0];
		q1X[0] = x[2*edge.p1];
		q1X[1] = x[2*edge.p1+1];
		q2X[0] = x[2*edge.p2];
		q2X[1] = x[2*edge.p2+1];

		var l = dist(q1X[0],q1X[1],q2X[0],q2X[1]);
		n[0] = (q1X[0]-q2X[0])/l;
		n[1] = (q1X[1]-q2X[1])/l;

		var nnT = multiplyMatrices(vecToMat(n),transposeMat(vecToMat(n)));
		var K = addMatrices(Id,multiplyMatrices(scalarMat(-1,2,2),nnT));
		K = multiplyMatrices(scalarMat((l-l0)/l,2,2),K);
		K = addMatrices(nnT,K);
		K = multiplyMatrices(scalarMat(-1*this.k,2,2),K);
		HessX[edge.p1*2][edge.p1*2] -= K[0][0];
		HessX[edge.p1*2+1][edge.p1*2] -= K[1][0];
		HessX[edge.p1*2][edge.p1*2+1] -= K[0][1];
		HessX[edge.p1*2+1][edge.p1*2+1] -= K[1][1];

		HessX[edge.p1*2][edge.p2*2] -= -1*K[0][0];
		HessX[edge.p1*2+1][edge.p2*2] -= -1*K[1][0];
		HessX[edge.p1*2][edge.p2*2+1] -= -1*K[0][1];
		HessX[edge.p1*2+1][edge.p2*2+1] -= -1*K[1][1];

		HessX[edge.p2*2][edge.p1*2] -= -1*K[0][0];
		HessX[edge.p2*2+1][edge.p1*2] -= -1*K[1][0];
		HessX[edge.p2*2][edge.p1*2+1] -= -1*K[0][1];
		HessX[edge.p2*2+1][edge.p1*2+1] -= -1*K[1][1];

		HessX[edge.p2*2][edge.p2*2] -= K[0][0];
		HessX[edge.p2*2+1][edge.p2*2] -= K[1][0];
		HessX[edge.p2*2][edge.p2*2+1] -= K[0][1];
		HessX[edge.p2*2+1][edge.p2*2+1] -= K[1][1];


		K[0][0] = 0;
		K[0][1] = 0;
		K[1][0] = 0;
		K[1][1] = 0;

		var q1V = [0,0];
		var q2V = [0,0];
		q1V[0] = v[edge.p1*2];
		q1V[1] = v[edge.p1*2+1];
		q2V[0] = v[edge.p2*2];
		q2V[1] = v[edge.p2*2+1];
		var vDiff = [0,0];
		vDiff[0] = q1V[0]-q2V[0];
		vDiff[1] = q1V[1]-q2V[1];
		var temp = multiplyMatrices(transposeMat(vecToMat(n)),vecToMat(vDiff))[0][0];
		var Id2 = IdMatrix(2);
		Id2[0][0] = temp;
		Id2[1][1] = temp;
		K = addMatrices(Id,multiplyMatrices(scalarMat(-1,2,2),nnT));
		K = multiplyMatrices(addMatrices(Id2,multiplyMatrices(vecToMat(n),transposeMat(vecToMat(vDiff)))),K);
		K = multiplyMatrices(scalarMat(-1*this.dampingBeta/l,2,2),K);

		HessX[edge.p1*2][edge.p1*2] -= K[0][0];
		HessX[edge.p1*2+1][edge.p1*2] -= K[1][0];
		HessX[edge.p1*2][edge.p1*2+1] -= K[0][1];
		HessX[edge.p1*2+1][edge.p1*2+1] -= K[1][1];
		  
		HessX[edge.p1*2][edge.p2*2] -= -1*K[0][0];
		HessX[edge.p1*2+1][edge.p2*2] -= -1*K[1][0];
		HessX[edge.p1*2][edge.p2*2+1] -= -1*K[0][1];
		HessX[edge.p1*2+1][edge.p2*2+1] -= -1*K[1][1];

		HessX[edge.p2*2][edge.p1*2] -= -1*K[0][0];
		HessX[edge.p2*2+1][edge.p1*2] -= -1*K[1][0];
		HessX[edge.p2*2][edge.p1*2+1] -= -1*K[0][1];
		HessX[edge.p2*2+1][edge.p1*2+1] -= -1*K[1][1];
		  
		HessX[edge.p2*2][edge.p2*2] -= K[0][0];
		HessX[edge.p2*2+1][edge.p2*2] -= K[1][0];
		HessX[edge.p2*2][edge.p2*2+1] -= K[0][1];
		HessX[edge.p2*2+1][edge.p2*2+1] -= K[1][1];
		return HessX;
	}

	this.addHessV = function(x,v,m,HessV,edge,particle1,particle2){
		var n = [0,0];
		var q1X = [0,0];
		var q2X = [0,0];
		q1X[0] = x[2*edge.p1];
		q1X[1] = x[2*edge.p1+1];
		q2X[0] = x[2*edge.p2];
		q2X[1] = x[2*edge.p2+1];

		var l = dist(q1X[0],q1X[1],q2X[0],q2X[1]);
		n[0] = (q1X[0]-q2X[0])/l;
		n[1] = (q1X[1]-q2X[1])/l;

		var nnT = multiplyMatrices(vecToMat(n),transposeMat(vecToMat(n)));
		var K = multiplyMatrices(scalarMat(this.dampingBeta,2,2),nnT);

		HessV[edge.p1*2][edge.p1*2] -= -1*K[0][0];
		HessV[edge.p1*2+1][edge.p1*2] -= -1*K[1][0];
		HessV[edge.p1*2][edge.p1*2+1] -= -1*K[0][1];
		HessV[edge.p1*2+1][edge.p1*2+1] -= -1*K[1][1];
		
		HessV[edge.p1*2][edge.p2*2] -= K[0][0];
		HessV[edge.p1*2+1][edge.p2*2] -= K[1][0];
		HessV[edge.p1*2][edge.p2*2+1] -= K[0][1];
		HessV[edge.p1*2+1][edge.p2*2+1] -= K[1][1];

		HessV[edge.p2*2][edge.p1*2] -= K[0][0];
		HessV[edge.p2*2+1][edge.p1*2] -= K[1][0];
		HessV[edge.p2*2][edge.p1*2+1] -= K[0][1];
		HessV[edge.p2*2+1][edge.p1*2+1] -= K[1][1];
		
		HessV[edge.p2*2][edge.p2*2] -= -1*K[0][0];
		HessV[edge.p2*2+1][edge.p2*2] -= -1*K[1][0];
		HessV[edge.p2*2][edge.p2*2+1] -= -1*K[0][1];
		HessV[edge.p2*2+1][edge.p2*2+1] -= -1*K[1][1];

		return HessV;
	}
}

function GravitationalForce(p1,p2,G){
	this.p1 = p1; //First particle the force acts on
	this.p2 = p2; //Second particle the force acts on
	this.G = G; //Gravitational constant

	this.addE = function(x,v,m,E){
		var dist = Math.sqrt(Math.pow((x[2*this.p1]-x[2*this.p2]),2)+Math.pow((x[2*this.p1+1]-x[2*this.p2+1]),2));
		E -= this.G*m[2*i]*m[2*j]/dist;
		return E;
	}

	this.addGradE = function(x,v,m,gradE){
		var dist = Math.sqrt(Math.pow((x[2*this.p1]-x[2*this.p2]),2)+Math.pow((x[2*this.p1+1]-x[2*this.p2+1]),2));
		var magF= this.G*m[2*this.p1]*m[2*this.p2]/Math.pow(dist,2);
		var n = [];
		var diff1 = x[2*this.p1]-x[2*this.p2];
		var diff2 = x[2*this.p1+1]-x[2*this.p2+1];
		n[0] = diff1/dist;
		n[1] = diff2/dist;
		gradE[2*this.p1] -= n[0]*magF;
		gradE[2*this.p1+1] += n[1]*magF;
		gradE[2*this.p2] += n[0]*magF;
		gradE[2*this.p2+1] -= n[1]*magF;
		return gradE;
	}
}