/*Initalize particles,edges,forces, and scene.
 Note: scene always starts with at least 2 forces simpleGravity, and linearDamping. Their settings can be changed
 from DOM from the settings section.*/
function createObjects(){
	var particles = [];
	particles.push(new ball(1,4,0,0,[false,false],1,0.4,"red"));
	particles.push(new ball(2,2,0,0,[false,false],1,0.4,"red"));
	particles.push(new ball(3,0,0,0,[false,false],1,0.4,"red"));
	particles.push(new ball(-4,4,0,0,[true,true],1,0.4,"red"));
	particles.push(new ball(-4,2,0,0,[true,true],1,0.4,"red"));
	particles.push(new ball(-4,0,0,0,[true,true],1,0.4,"red"));
	var edges = [];
	edges.push(new edge(0,3,0.2,"green"));
	edges.push(new edge(1,4,0.2,"green"));
	edges.push(new edge(2,5,0.2,"green"));
	var gravityVector = [];
	gravityVector.push(0.0);
	gravityVector.push(0.0);
	var simpleGravityForce = new SimpleGravity(gravityVector);
	var linearDampingForce = new DragDampingForce(0.0);
	var springForce1 = new SpringForce(0,3,4,0.0);
	var springForce2 = new SpringForce(1,3,4,0.0);
	var springForce3 = new SpringForce(2,3,4,0.0);
	forceTypes = [];
	forceTypes.push(simpleGravityForce);
	forceTypes.push(linearDampingForce);
	forceTypes.push(springForce1);
	forceTypes.push(springForce2);
	forceTypes.push(springForce3);
	scene = new Scene(particles,edges,"ImplicitExplicit",forceTypes);


	newObject = [0,"x","P1_X","#ff0000",0];
	objectsGraphed.push(newObject);
	graphing.push(true);
	var index = objectsGraphed.length-1;
	document.getElementById("variables").innerHTML += generateDomElement(index,objectsGraphed[index][2],objectsGraphed[index][3]);
	newObject = [1,"x","P2_X","#00ff00",0];
	objectsGraphed.push(newObject);
	graphing.push(true);
	var index = objectsGraphed.length-1;
	document.getElementById("variables").innerHTML += generateDomElement(index,objectsGraphed[index][2],objectsGraphed[index][3]);
	newObject = [2,"x","P3_X","#0000ff",0];
	objectsGraphed.push(newObject);
	graphing.push(true);
	var index = objectsGraphed.length-1;
	document.getElementById("variables").innerHTML += generateDomElement(index,objectsGraphed[index][2],objectsGraphed[index][3]);
	document.getElementById("hidden0").innerHTML = "Visible";
	document.getElementById("hidden1").innerHTML = "Visible";
	document.getElementById("hidden2").innerHTML = "Visible";
}