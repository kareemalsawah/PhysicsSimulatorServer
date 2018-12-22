/*Initalize particles,edges,forces, and scene.
 Note: scene always starts with at least 2 forces simpleGravity, and linearDamping. Their settings can be changed
 from DOM from the settings section.*/
function createObjects(){
	var particles = [];
	particles.push(new ball(0,4,0,0,[true,true],1,0.2,"red"));
	/*particles.push(new ball(-3.46,2,0,0,[false,false],1,0.4,"red"));
	particles.push(new ball(-4.33,1.5,0,0,[false,false],1,0.4,"red"));
	particles.push(new ball(-5.196,1,0,0,[false,false],1,0.4,"red"));
	particles.push(new ball(-6.06,0.5,0,0,[false,false],1,0.4,"red"));
	particles.push(new ball(-6.928,0,0,0,[false,false],1,0.4,"red"));*/
	//4.227,5.07,6.195
	particles.push(new ball(-1.4495,2.5504,0,0,[false,false],1,0.2,"red"));
	particles.push(new ball(-1.64,2.3595,0,0,[false,false],1,0.2,"red"));
	particles.push(new ball(-1.8809,2.11909,0,0,[false,false],1,0.2,"red"));
	particles.push(new ball(-2.1637,1.836,0,0,[false,false],1,0.2,"red"));
	particles.push(new ball(-2.524,1.4756,0,0,[false,false],1,0.2,"red"));
	particles.push(new ball(-2.9889,1.011,0,0,[false,false],1,0.2,"red"));
	particles.push(new ball(-3.585,0.41496,0,0,[false,false],1,0.2,"red"));
	particles.push(new ball(-4.3805,-0.3805,0,0,[false,false],1,0.2,"red"));
	var edges = [];
	edges.push(new edge(0,1,0.2,"green"));
	edges.push(new edge(0,2,0.2,"green"));
	edges.push(new edge(0,3,0.2,"green"));
	edges.push(new edge(0,4,0.2,"green"));
	edges.push(new edge(0,5,0.2,"green"));
	edges.push(new edge(0,6,0.2,"green"));
	edges.push(new edge(0,7,0.2,"green"));
	edges.push(new edge(0,8,0.2,"green"));
	var gravityVector = [];
	gravityVector.push(0.0);
	gravityVector.push(-100.0);
	var simpleGravityForce = new SimpleGravity(gravityVector);
	var linearDampingForce = new DragDampingForce(0.0);
	var springForce1 = new SpringForce(0,20000,2.05,0.0);
	var springForce2 = new SpringForce(1,20000,2.32,0.0);
	var springForce3 = new SpringForce(2,20000,2.66,0.0);
	var springForce4 = new SpringForce(3,20000,3.06,0.0);
	var springForce5 = new SpringForce(4,20000,3.57,0.0);
	var springForce6 = new SpringForce(5,20000,4.227,0.0);
	var springForce7 = new SpringForce(6,20000,5.07,0.0);
	var springForce8 = new SpringForce(7,20000,6.195,0.0);
	forceTypes = [];
	forceTypes.push(simpleGravityForce);
	forceTypes.push(linearDampingForce);
	forceTypes.push(springForce1);
	forceTypes.push(springForce2);
	forceTypes.push(springForce3);
	forceTypes.push(springForce4);
	forceTypes.push(springForce5);
	forceTypes.push(springForce6);
	forceTypes.push(springForce7);
	forceTypes.push(springForce8);
	scene = new Scene(particles,edges,"ImplicitExplicit",forceTypes);


	newObject = [1,"x","P2_X","#ff0000",0];
	objectsGraphed.push(newObject);
	graphing.push(false);
	var index = objectsGraphed.length-1;
	document.getElementById("variables").innerHTML += generateDomElement(index,objectsGraphed[index][2],objectsGraphed[index][3]);
	newObject = [2,"x","P3_X","#00ff00",0];
	objectsGraphed.push(newObject);
	graphing.push(false);
	var index = objectsGraphed.length-1;
	document.getElementById("variables").innerHTML += generateDomElement(index,objectsGraphed[index][2],objectsGraphed[index][3]);
	newObject = [3,"x","P4_X","#0000ff",0];
	objectsGraphed.push(newObject);
	graphing.push(false);
	var index = objectsGraphed.length-1;
	document.getElementById("variables").innerHTML += generateDomElement(index,objectsGraphed[index][2],objectsGraphed[index][3]);
	newObject = [4,"x","P5_X","#ff00ff",0];
	objectsGraphed.push(newObject);
	graphing.push(false);
	var index = objectsGraphed.length-1;
	document.getElementById("variables").innerHTML += generateDomElement(index,objectsGraphed[index][2],objectsGraphed[index][3]);
	newObject = [5,"x","P6_X","#000000",0];
	objectsGraphed.push(newObject);
	graphing.push(false);
	var index = objectsGraphed.length-1;
	document.getElementById("variables").innerHTML += generateDomElement(index,objectsGraphed[index][2],objectsGraphed[index][3]);
}
