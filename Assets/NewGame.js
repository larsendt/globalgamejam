#pragma strict

function Start () {

}

function Update () {

}

function OnGUI () {
	if (GUI.Button(Rect(250,350,200,100), "New Game")) {
		Application.LoadLevel(1);
	}
}