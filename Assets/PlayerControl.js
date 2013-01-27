#pragma strict

public var dwarf_move_force : float;
public var health : float;
public var starting_health : float;
private var bad_guy_layermask = (1 << 9);
private var animation_component : Animation;

function Start () {
	animation_component = transform.GetChild(0).animation;
	health = starting_health;
	// Debug.Log(animation_component);
}

function Update () {
	Debug.Log(health);
	if (health < starting_health) {
		health += Time.deltaTime * .5;
	}
	if (health > starting_health) {
		health = starting_health;
	}
	if (health <= 0) {
		Destroy(gameObject);
	}
	var horizontal_input = Input.GetAxis("Horizontal");
	var vertical_input = Input.GetAxis("Vertical");
	rigidbody.AddForce(Vector2(horizontal_input * dwarf_move_force * Time.deltaTime, vertical_input * dwarf_move_force * Time.deltaTime));
	if ((horizontal_input == 1) || (horizontal_input == -1)) {
		animation_component.CrossFade("running");
	}
	else {
		animation_component.CrossFade("idle");
	}

	if (horizontal_input == -1) {
		transform.localScale.x = -1;
	}

	if (horizontal_input == 1) {
		transform.localScale.x = 1;
	}
	
	if (Input.GetButtonDown("Jump")) {
		Strike();
	}
}

function Strike() {
	animation_component.Play("slash");
	// Debug.Log("striking");
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