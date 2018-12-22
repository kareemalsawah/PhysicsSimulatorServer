/*Initalize particles,edges,forces, and scene.
 Note: scene always starts with at least 2 forces simpleGravity, and linearDamping. Their settings can be changed
 from DOM from the settings section.*/
function createObjects(){
	var particles = [];
	particles.push(new ball(-4,0,0,0,[true,true],1,0.4,"red"));
	particles.push(new ball(3,0,0,0,[false,false],1,0.4,"red"));
	var edges = [];
	edges.push(new edge(0,1,0.2,"green"));
	var gravityVector = [];
	gravityVector.push(0.0);
	gravityVector.push(0.0);
	var simpleGravityForce = new SimpleGravity(gravityVector);
	var linearDampingForce = new DragDampingForce(0.0);
	var springForce1 = new SpringForce(0,3,4,0.2);
	forceTypes = [];
	forceTypes.push(simpleGravityForce);
	forceTypes.push(linearDampingForce);
	forceTypes.push(springForce1);
	scene = new Scene(particles,edges,"ImplicitExplicit",forceTypes);


	newObject = [1,"x","P2_X","#ff0000",0];
	objectsGraphed.push(newObject);
	graphing.push(true);
	var index = objectsGraphed.length-1;
	document.getElementById("variables").innerHTML += generateDomElement(index,objectsGraphed[index][2],objectsGraphed[index][3]);
	document.getElementById("hidden0").innerHTML = "Visible";
}