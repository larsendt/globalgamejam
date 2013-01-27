#pragma strict

public var btnTexture1 : Texture;

function Start () {
	PlayerPrefs.SetFloat("Cash", 0);
	PlayerPrefs.SetInt("Miners", 1);
}

function Update () {

}

function OnGUI () {

	var miners : int = PlayerPrefs.GetInt("Miners");

	GUI.Label (Rect (10, 10, 100, 20), "$" + PlayerPrefs.GetFloat("Cash"));

  	if (GUI.Button(Rect(10,30,50,50),btnTexture1)) {
		PlayerPrefs.SetInt("Miners", miners + 1);
	}
  	GUI.Label (Rect(10, 80, 100, 20), "" + miners);
}
        
    // if (GUI.Button(Rect(10,70,50,30),"Click"))
    //     Debug.Log("Clicked the button with text");
