//------------------------------------
// Globals
//------------------------------------

var pathcache = null;
var NOPATH = -1;
var UP = 0;
var LEFT = 1;
var DOWN = 2;
var RIGHT = 3;

//-------------------------------------
// Objects
//-------------------------------------

var PathCache = function(connections, bounds, version) {
	this.bounds = bounds;
	this.connections = connections;
	this.version = version;
	this.destinations = new Array();

	this.HasPathTo = function(destination) {
		return this.destinations.indexOf(destination) != -1;
	}

	this.SourceInPath = function(source, destination) {
		if(this.HasPathTo(destination)) {
			path = this.PathTo(destination);
			return path.indexOf(source) != -1;
		}
		else {
			return false;
		}
	}

	this.NextPosInPath = function(source, destination) {
		if(source == destination) {
			return null;
		}
		else if(this.SourceInPath(source, destination)) {
			path = this.PathTo(destination);
			return path[path.indexOf(source)+1];
		}
		else {
			return null;
		}
	}

	this.AddPathTo = function(destination, path) {
		this.destinations[destination] = path;
	}

	this.PathTo = function(destination) {
		return this.destinations[destination];
	}
}


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

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

function Distance(A, B) {
	// manhattan
	return Math.abs(A[0] - B[0]) + Math.abs(A[1] - B[1]);
}

function Neighbors(p) {
	return [
		[p[0]+1, p[1]  ],
		[p[0]  , p[1]+1],
		[p[0]-1, p[1]  ],
		[p[0]  , p[1]-1],
	];
}

function GetPath(start_pos, end_pos) {
	var openset = new Array();
	var closedset = new Array();
	var costs_from_start = new Array();
	var estimated_path_costs = new Array();
	var final_path_links = new Array();

	costs_from_start[start] = 0;
	estimated_path_costs[start] = Distance(start, destination);

	openset.push(start);

	while(openset.length > 0) {
	}

	return new Array();
}

function GetNextPos(start_pos, end_pos, connections, bounds, version)
{
	// pathcache is global (see top of file)
	if(pathcache == null || pathcache.version < version) {
		// pathcache.version < version means that somebody mined a block
		// and now all of our cached paths are invalidated 
		pathcache = new PathCache(connectiosn, bounds, version);
	}

	var nextpos = null;

	if(start_pos == end_pos) {
		// WELL DUH
		return NOPATH;
	}
	else if(pathcache.SourceInPath(start_pos, end_pos)) {
		// we have a cached path that has both start_pos and end_pos in it
		nextpos = pathcache.NextPosInPath(start_pos, end_pos);
	}
	else
	{
		// compute path and add to pathcache
		path = GetPath(start_pos, end_pos);
		pathcache.AddPathTo(end_pos, path);
		nextpos = pathcache.NextPosInPath(start_pos, end_pos);
	}

	if(nextpos == null) {
		return NOPATH;
	}
	else if(nextpos[1] == start_pos[1]-1) {
		return UP;
	}
	else if(nextpos[0] == start_pos[0]-1) {
		return LEFT;
	}
	else if(nextpos[1] == start_pos[1]+1) {
		return DOWN;
	}
	else if(nextpos[0] == start_pos[0]+1) {
		return RIGHT;
	}
	else {
		// we got a path state that is not directly N/S/E/W of start_pos (should never happen)
		Debug.Log("WOAH WOAH WOAH!!!! Got a bad next pos:" + String(start_pos) + " -> " + String(nextpos));
		return NOPATH;
	}
}