#pragma strict

private var is_on : boolean;

public var health : float;

function Start () {
	is_on = true;
}

function Update () {
	if ((health <= 0) && (is_on == true)) {
		Destroy(collider);
		Destroy(renderer);
		turn_off();
	}
}

function turn_off () {
	is_on = false;
	// Debug.Log("turning off");
	var ground_control_script : GroundControl = transform.parent.GetComponent(GroundControl);
	// Debug.Log(ground_control_script);
	ground_control_script.UpdateConnections();
}

function turn_on () {
	is_on = true;
}

