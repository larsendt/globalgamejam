// #pragma strict

// var NOPATH = -1;
// var UP = 0;
// var LEFT = 1;
// var DOWN = 2;
// var RIGHT = 3;

static var num_sounds : float;

public var dwarf_move_force : float;

private var dirt_layermask = 1<<10;

private var time_since_changemove : float;
private var current_move : int;
private var animation_component : Animation;



function Start () {
	animation_component = transform.GetChild(0).animation;
}

function Update () {

}

function Move (direction : int) {
	// Debug.Log(direction);
	if (direction == 0) { // up
		rigidbody.AddForce(Vector3.up * dwarf_move_force * Time.deltaTime);
	}
	else if (direction == 1) { // down
		rigidbody.AddForce(-Vector3.up * dwarf_move_force * Time.deltaTime);
		DigDown();
	}
	else if (direction == 2) { // left
		rigidbody.AddForce(-Vector3.right * dwarf_move_force * Time.deltaTime);
		transform.localScale.x = -1;

		DigLeft();
	}
	else if (direction == 3) { // right
		rigidbody.AddForce(Vector3.right * dwarf_move_force * Time.deltaTime);
		transform.localScale.x = 1;

		DigRight();
	}
	else if (direction == -1) {
	}
	
}

function DigDown() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, -Vector3.up, hit, .6, dirt_layermask)) {
	    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
	    dirt_control_script.health -= Time.deltaTime;

	    if (dirt_control_script.is_on) {
	    	animation_component.Play("swing2");
	    }
	}
	else {
		animation_component.Play("walking");
	}


}

function DigLeft() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, -Vector3.right, hit, .6, dirt_layermask)) {
	    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
	    dirt_control_script.health -= Time.deltaTime;
	    if (dirt_control_script.is_on) {
	    	animation_component.Play("swing2");
	    }
	}
	else {
		animation_component.Play("walking");
	}


}

function DigRight() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, Vector3.right, hit, .6, dirt_layermask)) {
	    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
	    dirt_control_script.health -= Time.deltaTime;

	    if (dirt_control_script.is_on) {
	    	animation_component.Play("swing2");
	    }
	}
	else {
		animation_component.Play("walking");
	}



}

