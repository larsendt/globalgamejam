#pragma strict

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

	public function PathCache(bounds : Array, connections, version : int) {
		this.bounds = bounds;
		this.connections = connections;
		this.level_version = version;
		this.paths = new Dictionary.<String, List.<String> >();
	}

	public function HasPathTo(destination : int[]) : boolean {
		var retval = this.paths.ContainsKey(PosToStr(destination));
		return retval;
	}

	public function SourceInPath(source : int[], destination : int[]) : boolean {
		if(this.HasPathTo(destination)) {
			var path : List.<String> = this.PathTo(destination);

			for(item in path) {
				Debug.Log("Item: " + item);
			}

			if(path.Contains(PosToStr(source))) {
				Debug.Log("SourceInPath: source was in path");
				return true;
			}
			else {
				Debug.Log("SourceInPath: source was NOT in path " + PosToStr(source));
				return false;
			}
		}
		else {
			Debug.Log("SourceInPath: no path to destination " + PosToStr(destination));
			return false;
		}
	}

	public function NextPosInPath(source : int[], destination : int[]) : int[] {
		if(source == destination) {
			Debug.Log("NextPosInPath: Source == Destination");
			return [0];
		}
		else if(this.SourceInPath(source, destination)) {
			var path : List.<String> = this.PathTo(destination);
			return StrToPos(path[path.IndexOf(PosToStr(source)) + 1]);
		}
		else {
			Debug.Log("NextPosInPath: source not in path or no path to destination");
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

var pathcache : PathCache;
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

function Neighbors(p : int[], bounds : int[]) : List.<int[]> {
	var retval = new List.<int[]>();
	if(p[0] < bounds[1]) {
		retval.Add([p[0]+1, p[1]  ]);
	}

	if(p[0] > bounds[0]) {
		retval.Add([p[0]-1, p[1]  ]);
	}

	if(p[1] < bounds[3]) {
		retval.Add([p[0]  , p[1]+1]);
	}

	if(p[1] > bounds[2]) {
		retval.Add([p[0]  , p[1]-1]);
	}
	return retval;	
}

function ReconstructPath(path_links : Dictionary.<String, int[]>, start_pos : int[], end_pos : int[]) : List.<String> {
	var retval = new List.<String>();
	var current : int[] = path_links[PosToStr(end_pos)];

	while(true) {
		retval.Insert(0, PosToStr(current));
		if(path_links.ContainsKey(PosToStr(current))) {
			current = path_links[PosToStr(current)];
		}
		else {
			Debug.Log("Path was broken?!?!?!?!?");
			return new List.<String>();
		}

		if(current == start_pos) {
			return retval;
		}
	}

	Debug.Log("Could not reconstruct path?!?!?!?");
	return new List.<String>();
}

function GetPath(start_pos : int[], end_pos : int[], bounds : int[]) : List.<String> {
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
		Debug.Log("current: " + PosToStr(current));
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

		for(neighbor in Neighbors(current, bounds)) {
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

function GetNextMove(start_pos : int[], end_pos : int[], connections : Array, bounds : int[], version : int) : int {
	var pathcache = new PathCache(connections, bounds, version);
	// pathcache is global (see top of file)
	if(pathcache == null || pathcache.level_version < version) {
		// pathcache.version < version means that somebody mined a block
		// and now all of our cached paths are invalidated 
		pathcache = new PathCache(connections, bounds, version);
	}

	var next_pos : int[] = [0];

	if(start_pos == end_pos) {
		// WELL DUH
		return NOPATH;
	}
	else if(pathcache.SourceInPath(start_pos, end_pos)) {
		// we have a cached path that has both start_pos and end_pos in it
		next_pos = pathcache.NextPosInPath(start_pos, end_pos);
	}
	else
	{
		// compute path and add to pathcache
		var path : List.<String> = GetPath(start_pos, end_pos, bounds);
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

function Start () {
	var connections = [
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

	var bounds = [0, 4, 0, 4];
	var start = [3, 0];
	var end = [3, 4];

	while(true) {
		var move = GetNextMove(start, end, connections, bounds, 0);
		if(move == UP) {
			Debug.Log("UP");
		}
		else if(move == DOWN) {
			Debug.Log("DOWN");
		}
		else if(move == LEFT) {
			Debug.Log("LEFT");
		}
		else if(move == RIGHT) {
			Debug.Log("RIGHT");
		}
		else if(move == NOPATH) {
			Debug.Log("NOPATH");
			break;
		}
		else {
			Debug.Log("Unknown move:" + move.ToString());
			break;
		}
	}
}

function Update () {
}

