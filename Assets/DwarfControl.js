// #pragma strict

// var NOPATH = -1;
// var UP = 0;
// var LEFT = 1;
// var DOWN = 2;
// var RIGHT = 3;


public var dwarf_move_force : float;

private var dirt_layermask = 1<<10;

private var time_since_changemove : float;
private var current_move : int;


function Start () {

}

function Update () {

}

function Move (direction : int) {
	if (direction == 0) { // up
		rigidbody.AddForce(Vector3.up * dwarf_move_force * Time.deltaTime);
	}
	else if (direction == 1) { // down
		rigidbody.AddForce(-Vector3.up * dwarf_move_force * Time.deltaTime);
		DigDown();
	}
	else if (direction == 2) { // left
		rigidbody.AddForce(-Vector3.right * dwarf_move_force * Time.deltaTime);
		DigLeft();
	}
	else if (direction == 3) { // right
		rigidbody.AddForce(Vector3.right * dwarf_move_force * Time.deltaTime);
		DigRight();
	}
	else if (direction == -1) {
	}
	
}

function DigDown() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, -Vector3.up, hit, 1, dirt_layermask)) {
		    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
		    dirt_control_script.health -= Time.deltaTime;

	}
}

function DigLeft() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, -Vector3.right, hit, 1, dirt_layermask)) {
		    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
		    dirt_control_script.health -= Time.deltaTime;
	}
}

function DigRight() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, Vector3.right, hit, 1, dirt_layermask)) {
		    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
		    dirt_control_script.health -= Time.deltaTime;
	}
}