import System.Collections.Generic;

function PosToStr(pos : int[]) : String {
	return pos[0].ToString() + "," + pos[1].ToString();
}

// expects "x,y"
function StrToPos(str : String) : int[] {
	var numbers : String[] = str.Split(","[0]);
	return [parseInt(numbers[0]), parseInt(numbers[1])];
}

//-------------------------------------
// Objects
//-------------------------------------

class PathCache {
	// [xmin, xmax, ymin, ymax]
	public var bounds : Array;

	// [[this, neighbor, neighbor, neighbor], [this2, neighbor]]
	// each element is [x, y]
	public var connections;

	// keep track of the "version" of the level 
	// that this PathCache is for
	public var level_version : int;

	// key is destination [x, y]
	public var paths : Dictionary.<String, List.<String> >;

	public var is_valid : boolean = false;

	public function PathCache() {
		this.is_valid = false;
	}

	public function PathCache(bounds : int[], connections, version : int) {
		this.bounds = bounds;
		this.connections = connections;
		this.level_version = version;
		this.paths = new Dictionary.<String, List.<String> >();
		this.is_valid = true;
	}

	public function HasPathTo(destination : int[]) : boolean {
		Debug.Log("HasPathTo");
		Debug.Log(destination);
		Debug.Log(this.paths);
		var retval = this.paths.ContainsKey(PosToStr(destination));
		return retval;
	}

	public function SourceInPath(source : int[], destination : int[]) : boolean {
		if(this.HasPathTo(destination)) {
			var path : List.<String> = this.PathTo(destination);

			if(path.Contains(PosToStr(source))) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}

	public function NextPosInPath(source : int[], destination : int[]) : int[] {
		if(source == destination) {
			return [0];
		}
		else if(this.SourceInPath(source, destination)) {
			var path : List.<String> = this.PathTo(destination);
			return StrToPos(path[path.IndexOf(PosToStr(source)) + 1]);
		}
		else {
			return [0];
		}
	}

	public function AddPathTo(destination : int[], path : List.<String>) {
		this.paths[PosToStr(destination)] = path;
	}

	public function PathTo(destination : int[]) : List.<String> {
		return this.paths[PosToStr(destination)];
	}

	function PosToStr(pos : int[]) : String {
		return pos[0].ToString() + "," + pos[1].ToString();
	}

	// expects "x,y"
	function StrToPos(str : String) : int[] {
		var numbers : String[] = str.Split(","[0]);
		return [parseInt(numbers[0]), parseInt(numbers[1])];
	}
}

//------------------------------------
// Globals
//------------------------------------

var pathcache = new PathCache();
var NOPATH = -1;
var UP = 0;
var LEFT = 1;
var DOWN = 2;
var RIGHT = 3;

//-------------------------------------
// My Functions
//-------------------------------------

function IsValidPos(pos : int []) : boolean {
	return pos.Length == 2;
}

function Distance(A : int[], B : int[]) {
	// manhattan
	return Mathf.Abs(A[0] - B[0]) + Mathf.Abs(A[1] - B[1]);
}

function Neighbors(p : int[], connections) : List.<int[]> {
	var retval = new List.<int[]>();
	for(conn_list in connections) {
		if(conn_list[0] == p) {
			for(var i = 1; i < conn_list.Length; i++) {
				retval.Add(conn_list[i]);
			}
		}
	}
	return retval;
}

function ReconstructPath(path_links : Dictionary.<String, int[]>, start_pos : int[], end_pos : int[]) : List.<String> {
	var retval = new List.<String>();
	var current : int[] = end_pos;

	while(current != start_pos) {
		retval.Insert(0, PosToStr(current));
		if(path_links.ContainsKey(PosToStr(current))) {
			current = path_links[PosToStr(current)];
		}
		else {
			Debug.Log("Path was broken?!?!?!?!?");
			return new List.<String>();
		}
	}

	retval.Insert(0, PosToStr(start_pos));
	return retval;
}

function GetPath(start_pos : int[], end_pos : int[], bounds : int[], connections) : List.<String> {
	var openset = new List.<String>();
	var closedset = new List.<String>();
	var costs = new Dictionary.<String, int>();
	var distances = new Dictionary.<String, int>();
	var path_links = new Dictionary.<String, int[]>();

	costs[PosToStr(start_pos)] = 0;
	distances[PosToStr(start_pos)] = Distance(start_pos, end_pos);
 
	openset.Add(PosToStr(start_pos));

	while(openset.Count > 0) {
		var current = StrToPos(openset[0]);
		for(var item : String in openset) { 
			if(distances[item] < distances[PosToStr(current)]) {
				current = StrToPos(item);
			}
		}

		if(current == end_pos) {
			return ReconstructPath(path_links, start_pos, end_pos);
		}

		openset.Remove(PosToStr(current));
		closedset.Add(PosToStr(current));

		for(neighbor in Neighbors(current, connections)) {
			if(closedset.Contains(PosToStr(neighbor))) {
				continue;
			}

			var tentative_cost = costs[PosToStr(current)] + Distance(current, neighbor);

			if((!openset.Contains(PosToStr(neighbor))) || (tentative_cost < costs[PosToStr(neighbor)])) {
				path_links[PosToStr(neighbor)] = current;
				costs[PosToStr(neighbor)] = tentative_cost;
				distances[PosToStr(neighbor)] = costs[PosToStr(neighbor)] + Distance(neighbor, end_pos);

				if(!openset.Contains(PosToStr(neighbor))) {
					openset.Add(PosToStr(neighbor));
				}
			}
		}

	}

	return new List.<String>();
}

function GetNextMove(start_pos : int[], end_pos : int[], connections, bounds : int[], version : int) : int {
	// pathcache is global (see top of file)
	if(!pathcache.is_valid) {
		Debug.Log("New pathcache");
		pathcache = new PathCache(bounds, connections, version);
	}
	else if(pathcache.level_version < version) {
		// pathcache.version < version means that somebody mined a block
		// and now all of our cached paths are invalidated 
		pathcache = new PathCache(bounds, connections, version);
	}

	var next_pos : int[] = [0];

	if(start_pos == end_pos) {
		// WELL DUH
		Debug.Log("Start == End");
		return NOPATH;
	}
	else if(pathcache.SourceInPath(start_pos, end_pos)) {
		// we have a cached path that has both start_pos and end_pos in it
		next_pos = pathcache.NextPosInPath(start_pos, end_pos);
	}
	else
	{
		// compute path and add to pathcache
		var path : List.<String> = GetPath(start_pos, end_pos, bounds, connections);
		pathcache.AddPathTo(end_pos, path);
		next_pos = pathcache.NextPosInPath(start_pos, end_pos);
	}

	if(!IsValidPos(next_pos)) {
		return NOPATH;
	}
	else if(next_pos[1] == start_pos[1] - 1) {
		return UP;
	}
	else if(next_pos[0] == start_pos[0]-1) {
		return LEFT;
	}
	else if(next_pos[1] == start_pos[1]+1) {
		return DOWN;
	}
	else if(next_pos[0] == start_pos[0]+1) {
		return RIGHT;
	}
	else {
		// we got a path state that is not directly N/S/E/W of start_pos (should never happen)
		Debug.Log("WOAH WOAH WOAH!!!! Got a bad next pos: [" + 
			start_pos[0].ToString() + ", " + start_pos[1].ToString() + 
			"] -> [" + next_pos[0].ToString() + ", " + next_pos[1].ToString() + "]");
		return NOPATH;
	}
}

//-------------------------------------
// Unity Functions
//-------------------------------------

var bounds;
var start;
var end;
var connections;
var done = false;

function Start () {
	connections = [
		[[3, 0], [3, 1]],
		[[3, 1], [2, 1]],
		[[2, 1], [1, 1]],
		[[1, 1], [0, 1]],
		[[0, 1], [0, 2]],
		[[0, 2], [0, 3]],
		[[0, 3], [1, 3]],
		[[1, 3], [2, 3]],
		[[2, 3], [3, 3]],
		[[3, 3], [3, 4]]
	];

	bounds = [0, 10, -2, 50];
	start = [3, 0];
	end = [3, 4];
}

function Update () {
	/*if(done) {
		return;
	}

	var move = GetNextMove(start, end, connections, bounds, 0);
	Debug.Log(PosToStr(start) + " -> " + PosToStr(end));
	if(move == UP) {
		Debug.Log("UP");
		start[1] -= 1;
	}
	else if(move == DOWN) {
		Debug.Log("DOWN");
		start[1] += 1;
	}
	else if(move == LEFT) {
		Debug.Log("LEFT");
		start[0] -= 1;
	}
	else if(move == RIGHT) {
		Debug.Log("RIGHT");
		start[0] += 1;
	}
	else if(move == NOPATH) {
		Debug.Log("NOPATH");
		done = true;
	}
	else {
		Debug.Log("Unknown move:" + move.ToString());
		done = true;
	}*/
}

