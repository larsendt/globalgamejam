#pragma strict

public var health : float;

public var dwarf_move_force : float;

function Start () {

}

function Update () {
	if (health <= 0) {
		Destroy(gameObject);
	}
}

function Move (direction : int) {
	if (direction == 0) { // up
		rigidbody.AddForce(Vector3.up * dwarf_move_force * Time.deltaTime);
	}
	else if (direction == 1) { // down
		rigidbody.AddForce(-Vector3.up * dwarf_move_force * Time.deltaTime);
	}
	else if (direction == 2) { // left
		rigidbody.AddForce(-Vector3.right * dwarf_move_force * Time.deltaTime);
	}
	else if (direction == 3) { // right
		rigidbody.AddForce(Vector3.right * dwarf_move_force * Time.deltaTime);
	}
	else if (direction == -1) {
	}
}

function OnCollisionEnter(collision : Collision) {
	if (collision.gameObject.tag == "Dwarf") {
		Destroy(collision.gameObject);
	}
}