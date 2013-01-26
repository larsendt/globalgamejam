#pragma strict

public var health : float;

function Start () {

}

function Update () {
	if (health <= 0) {
		Destroy(gameObject);
	}
}