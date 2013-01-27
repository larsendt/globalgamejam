#pragma strict

public var health : float;

public var dwarf_move_force : float;

private var animation_component : Animation;


function Start () {
	animation_component = transform.GetChild(0).animation;

}

function Update () {
	if (health <= 0) {
		Destroy(gameObject);
	}

}

function Move (direction : int) {
	
	if (direction == 0) { // up
		rigidbody.AddForce(Vector3.up * dwarf_move_force * Time.deltaTime);
		// animation_component.Play("walking");
	}
	else if (direction == 1) { // down
		rigidbody.AddForce(-Vector3.up * dwarf_move_force * Time.deltaTime);
		// animation_component.Play("walking");
	}
	else if (direction == 2) { // left
		rigidbody.AddForce(-Vector3.right * dwarf_move_force * Time.deltaTime);
		animation_component.CrossFade("walking");
	}
	else if (direction == 3) { // right
		rigidbody.AddForce(Vector3.right * dwarf_move_force * Time.deltaTime);
		animation_component.CrossFade("walking");
	}
	else if (direction == -1) {
	}
}

function OnCollisionStay(collision : Collision) {
	if (collision.gameObject.tag == "Dwarf") {
		Destroy(collision.gameObject);
	}
	if (collision.gameObject.tag == "Player") {
		collision.gameObject.transform.GetComponent(PlayerControl).health -= Time.deltaTime * 2;
		collision.gameObject.transform.GetComponent(PlayerControl).Play_Ouch();
		yield WaitForSeconds (1);
	}
}