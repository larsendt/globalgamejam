// #pragma strict

public var width : int;
public var depth : int;

public var dirt_object : GameObject;

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
			var clone = Instantiate(dirt_object, Vector2(x, -y), Quaternion.identity);
			clone.transform.parent = transform;
			blocks[x][y] = clone;
		}
	}

	// Debug.Log(blocks);
}

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