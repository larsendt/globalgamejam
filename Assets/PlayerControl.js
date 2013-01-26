#pragma strict

public var dwarf_move_force : float;

function Start () {

}

function Update () {
	var horizontal_input = Input.GetAxis("Horizontal");
	var vertical_input = Input.GetAxis("Vertical");
	rigidbody.AddForce(Vector2(horizontal_input * dwarf_move_force, vertical_input * dwarf_move_force));
	if (vertical_input == -1) {
		DigDown();
	}
	else if (horizontal_input == 1) {
		transform.eulerAngles.y = 0;
		DigRight();
	}
	else if (horizontal_input == -1) {
		transform.eulerAngles.y = 180;
		DigLeft();
	}
	else if (Input.GetButtonDown("Jump")) {
		Strike();
	}
	Debug.DrawRay(transform.position, transform.position.right * 1);
}

function Strike() {
	Debug.Log("striking");
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, transform.position.right, hit, 1)) {
        // var distanceToGround = hit.distance;
        Debug.Log(hit.collider);

        if (hit.collider.gameObject.tag == "Golem") {
        	Debug.Log("hit golem");
			var golem_control_script : GolemControl = hit.collider.gameObject.GetComponent(GolemControl);
			golem_control_script.health -= 1;
        }
	    
	    
	    // Debug.Log(dirt_control_script.health);
	    // dirt_control_script.health -= Time.deltaTime;
	}
}

function DigDown() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, -Vector3.up, hit, 0.5)) {
	    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
	    dirt_control_script.health -= Time.deltaTime;
	}
}

function DigLeft() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, -Vector3.right, hit, 0.5)) {    
	    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
	    dirt_control_script.health -= Time.deltaTime;
	}
}

function DigRight() {
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, Vector3.right, hit, 0.5)) {	    
	    var dirt_control_script : DirtControl = hit.collider.gameObject.GetComponent(DirtControl);
	    dirt_control_script.health -= Time.deltaTime;
	}
}