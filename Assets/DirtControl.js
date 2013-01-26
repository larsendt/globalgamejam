#pragma strict

private var is_on : boolean;

public var health : float;

public var has_golem : boolean;

public var golem_material : Material;

public var x_coordinate : int;
public var y_coordinate : int;

function Start () {
	is_on = true;
	if (has_golem) {
		renderer.material = golem_material; 
	}
}

function Update () {
	
}

function turn_off () {
	Destroy(collider);
	Destroy(renderer);
	is_on = false;
	// Debug.Log("turning off");
	var ground_control_script : GroundControl = transform.parent.GetComponent(GroundControl);
	// Debug.Log(ground_control_script);
	ground_control_script.UpdateConnections(x_coordinate, y_coordinate);
}

function turn_on () {
	is_on = true;
}

