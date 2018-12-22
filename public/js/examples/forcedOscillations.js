
/*Initalize particles,edges,forces, and scene.
 Note: scene always starts with at least 2 forces simpleGravity, and linearDamping. Their settings can be changed
 from DOM from the settings section.*/
function createObjects(){
	var particles = [];
	var w = 2.218;
	var mBig = 1000000;
	var kBig = mBig*w*w/2;
	var rad = 1;
	var vStart = rad*w;
	particles.push(new ball(2,0,0,0,[false,true],1,0.4,"red"));
	particles.push(new ball(-2,0,0,0,[false,true],1,0.4,"red"));
	particles.push(new ball(-6,0,0,vStart,[false,false],mBig/2,0.4,"red"));
	particles.push(new ball(-7,0,0,0,[true,true],mBig/2,0.4,"red"));
	var edges = [];
	edges.push(new edge(0,1,0.2,"green"));
	edges.push(new edge(1,2,0.2,"green"));
	edges.push(new edge(2,3,0.2,"green"));
	var gravityVector = [];
	gravityVector.push(0.0);
	gravityVector.push(0.0);
	var simpleGravityForce = new SimpleGravity(gravityVector);
	var linearDampingForce = new DragDampingForce(0.0);
	var springForce = new SpringForce(0,5,6,0.4);
	var springForce2 = new SpringForce(1,300,4,0.0);
	var springForce3 = new SpringForce(2,3000*mBig,rad,0.0);
	forceTypes = [];
	forceTypes.push(simpleGravityForce);
	forceTypes.push(linearDampingForce);
	forceTypes.push(springForce);
	forceTypes.push(springForce2);
	forceTypes.push(springForce3);
	scene = new Scene(particles,edges,"ImplicitExplicit",forceTypes);

	newObject = [0,"x","P1_X","#ff0000",-2.9];
	objectsGraphed.push(newObject);
	graphing.push(true);
	var index = objectsGraphed.length-1;
	document.getElementById("variables").innerHTML += generateDomElement(index,objectsGraphed[index][2],objectsGraphed[index][3]);
	document.getElementById("hidden0").innerHTML = "Visible";
}



rangeShifters(1,5,"minSpecial","maxSpecial","special");
document.getElementById("special").oninput = function(){
	var w = parseFloat(this.value);
	var rad = 1;
	var vStart = rad*w;
	var currentV = scene.particles[2].velocity;
	var currentSpeed = vecNorm(currentV);
	var multiplier = w/currentSpeed;
	scene.particles[2].velocity[0] *= multiplier;
	scene.particles[2].velocity[1] *= multiplier;
	scene.startEnergy = scene.computeEnergy();
}
