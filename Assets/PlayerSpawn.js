#pragma strict

public var player_prefab : GameObject;

function Start () {

}

function Update () {
	var num_players = GameObject.FindGameObjectsWithTag ("Player").length;
	Debug.Log(num_players);
	if ((num_players == 0) && (Input.GetButtonDown("Jump"))) {
		Debug.Log("spawn player");
		Instantiate(player_prefab, transform.position, Quaternion.identity);
		
	}
}