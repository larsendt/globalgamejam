#pragma strict

public var width : int;

public var player : GameObject;

function Start () {
	camera.orthographicSize = (width / 3) - 1;
}

function Update () {
	transform.position = player.transform.position;
	transform.position.x = (width / 2.0);
	transform.position.z = -20;
}