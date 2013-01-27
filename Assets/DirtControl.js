#pragma strict

public var is_on : boolean;

public var health : float;

public var has_golem : boolean;
public var has_heart : boolean;

public var heart_prefab : GameObject;

public var golem_material : Material;
public var golem_prefab : GameObject;

public var x_coordinate : int;
public var y_coordinate : int;

public var direction : int;
public var reverse_direction : int;

public var fade_quad : GameObject;




function Start () {
	is_on = true;
	if (has_golem) {
		// renderer.material = golem_material; 
	}
	if (has_heart) {
		var heart = Instantiate(heart_prefab, transform.position, Quaternion.identity);
	}
}

function Update () {
	if ((health <= 0) && is_on) {
		turn_off();
	}
	
}

function turn_off () {
	collider.isTrigger = true;
	Destroy(renderer);
	is_on = false;
	if (has_golem) {
		Instantiate(golem_prefab, transform.position, Quaternion.identity);
	}
	if (has_heart) {
		End_Game();
	}

	PlayerPrefs.SetFloat("Cash", PlayerPrefs.GetFloat("Cash") + y_coordinate);
}

function turn_on () {
	is_on = true;
}

function OnTriggerStay (other : Collider) {
	// Debug.Log("entered collider");
	// Debug.Log(other.gameObject.tag);
	if (other.gameObject.tag == "Dwarf") {
		other.gameObject.GetComponent(DwarfControl).Move(direction);
		// Debug.Log("sending to dorf");
	}
	if (other.gameObject.tag == "Golem") {
		other.gameObject.GetComponent(GolemControl).Move(reverse_direction);
	}
}

function End_Game() {
	Application.LoadLevel(2);
}