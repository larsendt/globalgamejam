// #pragma strict

public var width : int;
public var depth : int;

public var dirt_object : GameObject;
public var indestructible_block_object : GameObject;
public var dwarf_spawn_object : GameObject;

public var version : int;
public var blocks : Array;
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
			dirt_control_script.direction = CalcBlockDirection(x, y);
			dirt_control_script.reverse_direction = CalcReverseBlockDirection(x, y);
			blocks[x][y] = clone;

			if ((x == Mathf.Floor(width/2)) && (y == depth-2)) {
				dirt_control_script.has_heart = true;
				dirt_control_script.health = y * 10;
			}	
		}
	}
	// Debug.Log(blocks);


	for (var i = -1; i < width + 1; i++) {
			clone = Instantiate(indestructible_block_object, Vector2(i, 1), Quaternion.identity);	
			clone.transform.parent = transform;	
			Destroy(clone.renderer);
			clone = Instantiate(indestructible_block_object, Vector2(i, -(depth)), Quaternion.identity);	
			clone.transform.parent = transform;	
		}

	for (var j = -1; j < depth + 1; j++) {
		// for (var l = -100; l < 100 + width; l++) {
			// if ((l<=-1) || (l>=width)) {
		clone = Instantiate(indestructible_block_object, Vector2(-1, -j), Quaternion.identity);	
		clone.transform.parent = transform;
		if ((j == -1) || (j == 0)) {
			Destroy(clone.renderer);
		}
		clone = Instantiate(indestructible_block_object, Vector2(width, -j), Quaternion.identity);	
		clone.transform.parent = transform;	
		if ((j == -1) || (j == 0)) {
			Destroy(clone.renderer);
		}
			// }
		// }
	}

	Instantiate(dwarf_spawn_object, Vector2(0, 0), Quaternion.identity);
	Instantiate(dwarf_spawn_object, Vector2(width - 1, 0), Quaternion.identity);

	for (q = 0; q < width; q++) {
		blocks[q][0].transform.GetComponent(DirtControl).turn_off();
	}

}


function Update () {

}

function CalcBlockDirection (x : int, y :int) {
	if ((x == 0) && (((y/2) % 2) != 0)) {
		return 1;
	}
	else if ((x == width - 1) && (((y/2) % 2) != 1)) {
		return 1;
	}
	else if (((y/2) % 2) == 1) {
		return 2;
	}
	else {
		return 3;
	}
}

function CalcReverseBlockDirection (x: int, y : int) {
	if ((y % 2) == 1) {
		return 0;
	}
	else if ((x == 0) && (((y / 2) % 2) != 1)) {
		return 0;
	}
	else if ((x == width - 1) && (((y / 2) % 2) != 0)) {
		return 0;
	}
	else if (((y / 2) % 2) == 0) {
		return 2;
	}
	else {
		return 3;
	}
}


function ReturnDirection(x :int, y:int){
	return blocks[x][y].direction;
}

// function UpdateConnections (x_coord : int, y_coord : int) {
// 	version++;


// 	if ((x_coord != width) && (blocks[x_coord+1][y_coord].GetComponent(DirtControl).is_on == false)) {
// 		connections.push([[x_coord,y_coord], [x_coord+1,y_coord]]);
// 	}
// 	if ((y_coord != depth) && (blocks[x_coord][y_coord+1].GetComponent(DirtControl).is_on == false)) {
// 		connections.push([[x_coord,y_coord], [x_coord,y_coord+1]]);
// 	}
// 	if ((x_coord != 0) && (blocks[x_coord-1][y_coord].GetComponent(DirtControl).is_on == false)) {
// 		connections.push([[x_coord,y_coord], [x_coord-1,y_coord]]);
// 	}
// 	if ((y_coord != 0) && (blocks[x_coord][y_coord-1].GetComponent(DirtControl).is_on == false)) {
// 		connections.push([[x_coord,y_coord], [x_coord,y_coord-1]]);
// 	}
// 	for (element in connections) {
// 		Debug.Log("[ [ " + element[0][0] + " , " + element[0][1] + " ] , [ " + element[1][0] + " , " + element[1][1] + "] ]");
// 	}

// }

// function isRowClear (row : int) {

// }

// function isBlockOn (x : int, y : int) {

// }

// function GetNextBlock () {
// 	for (y = 0; y < depth; y++) {
// 		if (isRowClear(y)) {
// 			continue;
// 		}
// 		var index : int = y % 2;
// 		var dir = (index * 2) + 1;
// 		if (dir == -1) {
// 			for (var i = width; i >= 0; i--) {
// 				if (!isBlockOn(i, y)) {
// 					continue;
// 				}
// 				return [i, y];
// 			}
// 		}
// 		else {
// 			for (var i = 0; i < width; i++) {
// 				if (!isBlockOn(i, y)) {
// 					continue;
// 				}
// 				return [i, y];
// 			}
// 		}
// 	}
// }