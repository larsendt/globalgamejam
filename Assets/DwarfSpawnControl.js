#pragma strict

public var dwarf_root : GameObject;
public var dwarf_prefab : GameObject;
// private var dwarf_root_control_script : DwarfRootControl;

public var time_between_spawns : float;
private var time_since_spawn : float;

function Start () {
	
	time_since_spawn = Random.value;
}

function Update () {
	var dwarf_root_control_script : DwarfRootControl = dwarf_root.transform.GetComponent(DwarfRootControl);

	if (	(time_since_spawn > time_between_spawns) && 
			(GameObject.FindGameObjectsWithTag("Dwarf").length < PlayerPrefs.GetInt("Miners"))
			) {
		var dwarf = Instantiate(dwarf_prefab, transform.position, Quaternion.identity);
		time_since_spawn = 0;
	}
	else {
		time_since_spawn += Time.deltaTime;
	}
}