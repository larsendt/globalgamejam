#pragma strict

public var dwarf_move_force : float;
private var bad_guy_layermask = (1 << 9);

function Start () {

}

function Update () {
	var horizontal_input = Input.GetAxis("Horizontal");
	var vertical_input = Input.GetAxis("Vertical");
	rigidbody.AddForce(Vector2(horizontal_input * dwarf_move_force, vertical_input * dwarf_move_force));
	
	if (Input.GetButtonDown("Jump")) {
		Strike();
	}
}

function Strike() {
	Debug.Log("striking");
	var hit : RaycastHit;
	var dist = 2;
    if (	Physics.Raycast(transform.position, transform.position.right, hit, dist, bad_guy_layermask) ||
    		Physics.Raycast(transform.position, -transform.position.right, hit, dist, bad_guy_layermask) ||
    		Physics.Raycast(transform.position, transform.position.up, hit, dist, bad_guy_layermask) ||
    		Physics.Raycast(transform.position, -transform.position.up, hit, dist, bad_guy_layermask)
    		) {
        // var distanceToGround = hit.distance;

    	Debug.Log("hit golem");
		var golem_control_script : GolemControl = hit.collider.gameObject.GetComponent(GolemControl);
		golem_control_script.health -= 1;
      	    
	    
	    // Debug.Log(dirt_control_script.health);
	    // dirt_control_script.health -= Time.deltaTime;
	}
}