#pragma strict

public var zoom_rate : float;

public var player : GameObject;

function Start () {

}

function Update () {
	var change = Input.GetAxis("Mouse ScrollWheel") * zoom_rate;

	camera.orthographicSize -= change;
	if (camera.orthographicSize < 5) camera.orthographicSize = 5;

	transform.position = Vector3(player.transform.position.x, player.transform.position.y, -20);
}