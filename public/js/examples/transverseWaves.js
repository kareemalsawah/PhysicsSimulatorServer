/*Initalize particles,edges,forces, and scene.
 Note: scene always starts with at least 2 forces simpleGravity, and linearDamping. Their settings can be changed
 from DOM from the settings section.*/
function createObjects(){
	externalLoopOn = true;
	var particles = [];
	var edges = [];
	var gravityVector = [];
	gravityVector.push(0.0);
	gravityVector.push(0.0);
	var simpleGravityForce = new SimpleGravity(gravityVector);
	var linearDampingForce = new DragDampingForce(0.0);

	forceTypes = [];
	forceTypes.push(simpleGravityForce);
	forceTypes.push(linearDampingForce);

	scene = new Scene(particles,edges,"ImplicitSymplectic",forceTypes);

	var ropeTest = new simpleRopeTension([-9,0],[9,0],[0,0],[0,0],[[true,false],[true,true]],0.01,0.1,"red","green",1000,20,0.0,[true,false],0.7);
	scene.forceTypes[2].k = 1000000;
	scene.particles[0].mass = 100000;
	//scene.particles[20].pos = [9,0];
	scene.startEnergy = scene.computeEnergy();
	scene.integrationMethod = "ImplicitEuler";
	dtGeneral = 0.0005;
}

var particleMove = true;
setTimeout(updateParticleMove,1000);
function updateParticleMove(){
	particleMove = true;
}
function externalLoop(){
	if(particleMove){
		scene.particles[0].pos = [scene.particles[0].pos[0],2*Math.sin(122.5*tempTime)];
	}else{
		scene.particles[0].fixed = [true,true];
	}
	console.log(scene.integrationMethod);
}

function setEnergy(){
	scene.startEnergy = 1000;
}
