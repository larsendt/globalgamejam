#pragma strict

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
	current_move = 2;
}

function Update () {
	if (time_since_changemove > 2) {
		current_move = Mathf.Floor(Random.Range(1, 4));
		time_since_changemove = 0;
	}
	else {
		time_since_changemove += Time.deltaTime;
	}
	Move(current_move);
	// Debug.Log(current_move);
}

function Move (direction : int) {
	if (direction == 0) { // up
		// Debug.Log("up");
		rigidbody.AddForce(Vector3.up * dwarf_move_force * Time.deltaTime);
		//do animation
	}
	else if (direction == 1) { // left
		// Debug.Log("left");
		rigidbody.AddForce(-Vector3.right * dwarf_move_force * Time.deltaTime);
		DigLeft();
	}
	else if (direction == 2) { // down
		// Debug.Log("down");
		rigidbody.AddForce(-Vector3.up * dwarf_move_force * Time.deltaTime);
		DigDown();
	}
	else if (direction == 3) { // right
		// Debug.Log("right");
		rigidbody.AddForce(Vector3.right * dwarf_move_force * Time.deltaTime);
		DigRight();
	}
	// else if (direction == -1) {
	// 	Move(Mathf.Floor(Random.Range(0, 4)));
	// }		
}

function DigDown() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, -Vector3.up, hit, 1, dirt_layermask)) {
    	// if (hit.collider.gameObject.tag == "Dirt") {
		    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
		    dirt_control_script.health -= Time.deltaTime;
		    if (dirt_control_script.health <= 0) {
				dirt_control_script.turn_off();
			}
		    // Debug.Log("hit dirt");
		// }
	}
	Debug.DrawRay(transform.position, -Vector3.up);
}

function DigLeft() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, -Vector3.right, hit, 1, dirt_layermask)) {
    	// if (hit.collider.gameObject.tag == "Dirt") {
		    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
		    dirt_control_script.health -= Time.deltaTime;
		    if (dirt_control_script.health <= 0) {
				dirt_control_script.turn_off();
			}
		// }
	}
}

function DigRight() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, Vector3.right, hit, 1, dirt_layermask)) {
    	// if (hit.collider.gameObject.tag == "Dirt") {
		    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
		    dirt_control_script.health -= Time.deltaTime;
		    if (dirt_control_script.health <= 0) {
				dirt_control_script.turn_off();
			}
		// }
	}
}