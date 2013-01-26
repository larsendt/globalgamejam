// #pragma strict

public var width : int;
public var depth : int;

public var dirt_object : GameObject;
public var dirt_golem_object : GameObject;
public var indestructible_block_object : GameObject;
public var dwarf_spawn_object : GameObject;

public var version : int;
public var blocks;
public var connections;

function Start () {
	version = 0;
	connections = new Array();
	blocks = new Array(width);



	for (var x = 0; x < width; x++) {
		blocks[x] = new Array(depth);
		for (var y = 0; y < depth; y++) {

			//golem
			var golem_percent = (y * 1.0) / (depth * 1.0);
			// Debug.Log(golem_percent);
			if (Random.value < golem_percent) {
				clone = Instantiate(dirt_golem_object, Vector2(x, -y), Quaternion.identity);
				clone.transform.parent = transform;
				var dirtgolem_control_script = clone.transform.GetComponent(DirtGolemControl);
				
				dirtgolem_control_script.health = (y + 1);
			}
			else {
				clone = Instantiate(dirt_object, Vector2(x, -y), Quaternion.identity);
				clone.transform.parent = transform;
				dirt_control_script = clone.transform.GetComponent(DirtControl);

				dirt_control_script.health = (y + 1);
			}
			blocks[x][y] = clone;
		}
	}

	for (var i = -1; i < width + 1; i++) {
			clone = Instantiate(indestructible_block_object, Vector2(i, 2), Quaternion.identity);	
			clone.transform.parent = transform;	
			clone = Instantiate(indestructible_block_object, Vector2(i, -(depth)), Quaternion.identity);	
			clone.transform.parent = transform;	
		}

	for (var j = -1; j < depth + 1; j++) {
			clone = Instantiate(indestructible_block_object, Vector2(-1, -j), Quaternion.identity);	
			clone.transform.parent = transform;	
			clone = Instantiate(indestructible_block_object, Vector2(width, -j), Quaternion.identity);	
			clone.transform.parent = transform;	
	}
}
	

	// Debug.Log(blocks);

function Update () {

}

function UpdateConnections () {
	version++;
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < depth; y++) {
			if (blocks[x][y].GetComponent(DirtControl).is_on == false) {
				// Debug.Log("a block is missing");
				if (blocks[x+1][y].GetComponent(DirtControl).is_on == false) {
					connections.push([[x,y], [x+1,y]]);
				}
				if (blocks[x][y+1].GetComponent(DirtControl).is_on == false) {
					connections.push([[x,y], [x,y+1]]);
				}
			}
		}
	}
	// for (element in connections) {
	// 	Debug.Log("[ [ " + element[0][0] + " , " + element[0][1] + " ] , [ " + element[1][0] + " , " + element[1][1] + "] ]");
	// }

}