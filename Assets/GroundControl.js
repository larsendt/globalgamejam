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
				clone = Instantiate(dirt_object, Vector2(x, -y), Quaternion.identity);
				clone.transform.parent = transform;
				dirt_control_script = clone.transform.GetComponent(DirtControl);

				var golem_percent = (y * 1.0) / (depth * 1.0);
				if (Random.value < golem_percent) {
					dirt_control_script.has_golem = true;
				}
				else {
					dirt_control_script.has_golem = false;
				}

				dirt_control_script.health = (y + 1);
				dirt_control_script.x_coordinate = x;
				dirt_control_script.y_coordinate = y;
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

	Instantiate(dwarf_spawn_object, Vector2(0, 1), Quaternion.identity);
	Instantiate(dwarf_spawn_object, Vector2(width - 1, 1), Quaternion.identity);
}
	// Debug.Log(blocks);

function Update () {

}

function UpdateConnections (x : int, y : int) {
	version++;
	// connections = new Array();
	// for (var x = 0; x < width-1; x++) {
		// for (var y = 0; y < depth-1; y++) {
			// if (blocks[x][y].GetComponent(DirtControl).is_on == false) {
				// Debug.Log("a block is missing");
				if (blocks[x+1][y].GetComponent(DirtControl).is_on == false) {
					connections.push([[x,y], [x+1,y]]);
				}
				if (blocks[x][y+1].GetComponent(DirtControl).is_on == false) {
					connections.push([[x,y], [x,y+1]]);
				}
				if (blocks[x-1][y].GetComponent(DirtControl).is_on == false) {
					connections.push([[x,y], [x-1,y]]);
				}
				if (blocks[x][y-1].GetComponent(DirtControl).is_on == false) {
					connections.push([[x,y], [x,y-1]]);
				}
			// }
		// }
	// }
	for (element in connections) {
		Debug.Log("[ [ " + element[0][0] + " , " + element[0][1] + " ] , [ " + element[1][0] + " , " + element[1][1] + "] ]");
	}

}