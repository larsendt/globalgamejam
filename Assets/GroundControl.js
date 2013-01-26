// #pragma strict

public var width : int;
public var depth : int;

public var dirt_object : GameObject;
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
			clone = Instantiate(indestructible_block_object, Vector2(i, 1), Quaternion.identity);	
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

	Instantiate(dwarf_spawn_object, Vector2(0, 0), Quaternion.identity);
	Instantiate(dwarf_spawn_object, Vector2(width - 1, 0), Quaternion.identity);

	for (q = 0; q < width; q++) {
		blocks[q][0].transform.GetComponent(DirtControl).turn_off();
	}

}



	// for (x = 0; x < width; x++) {
	//  	var script = blocks[x][0].transform.GetComponent(DirtControl);
	//  	script.turn_off();
	// }
	// Debug.Log(blocks);

function Update () {

}

function UpdateConnections (x_coord : int, y_coord : int) {
	version++;


	if ((x_coord != width) && (blocks[x_coord+1][y_coord].GetComponent(DirtControl).is_on == false)) {
		connections.push([[x_coord,y_coord], [x_coord+1,y_coord]]);
	}
	if ((y_coord != depth) && (blocks[x_coord][y_coord+1].GetComponent(DirtControl).is_on == false)) {
		connections.push([[x_coord,y_coord], [x_coord,y_coord+1]]);
	}
	if ((x_coord != 0) && (blocks[x_coord-1][y_coord].GetComponent(DirtControl).is_on == false)) {
		connections.push([[x_coord,y_coord], [x_coord-1,y_coord]]);
	}
	if ((y_coord != 0) && (blocks[x_coord][y_coord-1].GetComponent(DirtControl).is_on == false)) {
		connections.push([[x_coord,y_coord], [x_coord,y_coord-1]]);
	}
	for (element in connections) {
		Debug.Log("[ [ " + element[0][0] + " , " + element[0][1] + " ] , [ " + element[1][0] + " , " + element[1][1] + "] ]");
	}

}