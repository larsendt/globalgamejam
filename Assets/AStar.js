#pragma strict

import System.Collections.Generic;

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
	public var paths : Dictionary.<int[], List.<int[]> >;

	public function PathCache(bounds : Array, connections, version : int) {
		this.bounds = bounds;
		this.connections = connections;
		this.level_version = version;
	}

	public function HasPathTo(destination : int[]) : boolean {
		return this.paths.ContainsKey(destination) != -1;
	}

	public function SourceInPath(source : int[], destination : int[]) : boolean {
		if(this.HasPathTo(destination)) {
			var path : List.<int[]> = this.PathTo(destination);
			return path.IndexOf(source) != -1;
		}
		else {
			return false;
		}
	}

	public function NextPosInPath(source : int[], destination : int[]) : Array {
		if(source == destination) {
			return null;
		}
		else if(this.SourceInPath(source, destination)) {
			var path : List.<int[]> = this.PathTo(destination);
			return path[path.IndexOf(source) + 1];
		}
		else {
			return null;
		}
	}

	public function AddPathTo(destination : int[], path : List.<int[]>) {
		this.paths[destination] = path;
	}

	public function PathTo(destination : int[]) : List.<int[]> {
		return this.paths[destination];
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
// Unity Functions
//-------------------------------------


function Start () {

}

function Update () {
	Debug.Log("Blah");
}


//-------------------------------------
// My Functions
//-------------------------------------

function Distance(A : int[], B : int[]) {
	// manhattan
	return Mathf.Abs(A[0] - B[0]) + Mathf.Abs(A[1] - B[1]);
}

function Neighbors(p : int[]) : List.<int[]> {
	var retval = new List.<int[]>();
	retval.Add([p[0]+1, p[1]  ]);
	retval.Add([p[0]-1, p[1]  ]);
	retval.Add([p[0]  , p[1]+1]);
	retval.Add([p[0]  , p[1]-1]);
	return retval;	
}

function ReconstructPath(path_links : Dictionary.<int[], int[]>, start_pos : int[], end_pos : int[]) : List.<int[]> {
	var retval = new List.<int[]>();
	var current = path_links[end_pos];

	while(true) {
		retval.Insert(0, current);
		if(path_links.ContainsKey(current)) {
			current = path_links[current];
		}
		else {
			Debug.Log("Path was broken?!?!?!?!?");
			return new List.<int[]>();
		}

		if(current == start_pos) {
			return retval;
		}
	}

	Debug.Log("Could not reconstruct path?!?!?!?");
	return new List.<int[]>();
}

function GetPath(start_pos : int[], end_pos : int[]) : List.<int[]> {
	var openset = new List.<int[]>();
	var closedset = new List.<int[]>();
	var costs = new Dictionary.<int[], int>();
	var distances = new Dictionary.<int[], int>();
	var path_links = new Dictionary.<int[], int[]>();

	costs[start_pos] = 0;
	distances[start_pos] = Distance(start_pos, end_pos);
 
	openset.Add(start_pos);

	while(openset.Count > 0) {
		var current = openset[0];
		for(item in openset) { 
			if(distances[item] < distances[current]) {
				current = item;
			}
		}

		if(current == end_pos) {
			return ReconstructPath(path_links, start_pos, end_pos);
		}

		openset.Remove(current);
		closedset.Add(current);

		for(neighbor in Neighbors(current)) {
			if(closedset.Contains(neighbor)) {
				continue;
			}

			var tentative_cost = costs[current] + Distance(current, neighbor);

			if((!openset.Contains(neighbor)) || (tentative_cost < costs[neighbor])) {
				path_links[neighbor] = current;
				costs[neighbor] = tentative_cost;
				distances[neighbor] = costs[neighbor] + Distance(neighbor, end_pos);

				if(!openset.Contains(neighbor)) {
					openset.Add(neighbor);
				}
			}
		}

	}

	return new List.<int[]>();
}

function GetNextPos(start_pos : int[], end_pos : int[], connections : Array, bounds : Array, version : int) : int {
	var pathcache = new PathCache(connections, bounds, version);
	// pathcache is global (see top of file)
	if(pathcache == null || pathcache.level_version < version) {
		// pathcache.version < version means that somebody mined a block
		// and now all of our cached paths are invalidated 
		pathcache = new PathCache(connections, bounds, version);
	}

	var next_pos : int[] = null;

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
		var path : List.<int[]> = GetPath(start_pos, end_pos);
		pathcache.AddPathTo(end_pos, path);
		next_pos = pathcache.NextPosInPath(start_pos, end_pos);
	}

	if(next_pos == null) {
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