/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var neo4j = window.neo4j.v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "abcde"));

//******************Don't forget to close sessions!!!!!

//Worksheet Graph

var testGraph = cytoscape({
	container: document.getElementById('worksheetGraph'),
	boxSelectionEnabled: true,
	style: cytoscape.stylesheet()
	.selector('node')
	.css({
		'content': 'data(id)',
		'text-valign': 'center',
		'color': 'white',
		'text-outline-width': 2,
		'background-color': 'red',
		'text-outline-color': 'black'
	})
	.selector('edge')
	.css({
		'curve-style': 'bezier',
		'target-arrow-shape': 'triangle',
		'target-arrow-color': 'black',
		'line-color': 'gray',
		'width': 1
	}),
});

var worksheetGraph = {
	graph: testGraph
};

var worksheetCxtMenu = 
{
	menuRadius: 140,
	separatorWidth: 5,
	selector: 'node',
	commands: [
		{
			content: 'Inspect',//TODO: get it working / needs translating
			select: function(ele){
				inspect_node(ele.data('id'));
			}
		},
		{
			content: 'Import neighbours',//TODO: get it working / needs translating
			select: function(ele){
			import_neighbours_into_worksheet(ele.data('id'));
			}
		},
		{
			content: 'Import successors',//TODO: get it working / needs translating
			select: function(ele){
			successors(ele.data('id'));
			}
		},
		{
			content: 'Highlight',
			select: function(ele){
				toggle_node_importance(ele.data("id"));
			}
		},
		{
			content: 'Files read',//TODO: get it working / test
			select: function(ele){
				var id = ele.data('id', function(result) {
					let str = '';
					Array.from(result.names).forEach(function(name) {
						str += `<li>${name}</li>`;  // XXX: requires trusted UI server!
					});
					vex.dialog.alert({
						unsafeMessage: `<h2>Files read:</h2><ul>${str}</ul>`,
					});
				});
			}
		},
		{
			content: 'Commands',//TODO: get it working / test 
			select: function(ele){
				var id = ele.data('id');
				console.log("testA");
				cmd_query(id, function(result) {
				console.log("testB");
					let message = `<h2>Commands run by node ${id}:</h2>`;
					if (result.cmds.length == 0) {
						message += '<p>none</p>';
					} else {
						message += '<ul>';
						for (let command of result.cmds) {
							console.log(command);
							message += `<li><a onclick="command_clicked(${command.dbid})">${command.cmd}</a></li>`;
						}
						message += '</ul>';
					}
					vex.dialog.alert({ unsafeMessage: message });
				});
			}
		},
		{
			content: 'Remove neighbours',
			select: function(ele){
				remove_neighbours_from_worksheet(ele.data("id"));
			}
		},
		{
			content: 'Remove',
			select: function(ele){
				ele.remove();
			}
		},
	]
};

//Worksheet Graph end

//Machine Graph

var machineGraph = cytoscape({
	container: document.getElementById('machineGraph'),
	style: cytoscape.stylesheet()
	.selector('node')
	.css({
		'content': 'data(ips)',
		'text-valign': 'top',
		'color': 'white',
		'text-outline-width': 2,
		'background-color': 'red',
		'text-outline-color': 'black'
	})
	.selector('edge')
	.css({
		'curve-style': 'bezier',
		'target-arrow-shape': 'triangle',
		'target-arrow-color': 'black',
		'line-color': 'gray',
		'width': 1
	})
});

setup_machines();

//Machine Graph end

//inspector Graph


var inspectorGraph = cytoscape({
	container: document.getElementById('inspectorGraph'),
	style: cytoscape.stylesheet()
	.selector('node')
	.css({
		'content': 'data(id)',
		'text-valign': 'center',
		'color': 'white',
		'text-outline-width': 2,
		'background-color': 'red',
		'text-outline-color': 'black'
	})
	.selector('edge')
	.css({
		'curve-style': 'bezier',
		'target-arrow-shape': 'triangle',
		'target-arrow-color': 'black',
		'line-color': 'gray',
		'width': 1
	})
});

var inspector = {
	detail: $('#inspector-detail'),
	neighbours: $('#neighbour-detail'),
	graph: inspectorGraph,
};
inspector.graph.inspectee = null;

inspectorGraph.cxtmenu({
	selector: 'node',
	commands: [
		{
			content: 'Import node',//TODO: get it working
			select: function(ele){
				//console.log(ele.data('id'));
				import_into_worksheet(ele.data('id'));		
		}
		},
		{
			content: 'Import neighbours',//TODO: get it working
			select: function(ele){
				import_neighbours_into_worksheet(ele.data('id'));
		}
		},
		{
			content: 'Inspect',//TODO: get it working
			select: function(ele){
				//console.log(ele);
				inspect_node(ele.data("id"));
		}
		},
		{
			content: 'Import and Inspect',//TODO: get it working
			select: function(ele){
				inspect_and_import(ele.data('id'));
		}
		},
	]
});

layout( inspectorGraph, 'cose');

//inspector Graph end

//run
	insector_query('552408');
//update_nodelist();
//run end

//Functions

function remove_neighbours_from_worksheet(id) {
	let node = worksheetGraph.graph.$id(id);

	// First check to see if this is a compound node.
	let children = node.children();
	if (!children.empty()) {
		children.forEach(function (node) { worksheetGraph.graph.remove(node); });
		node.remove();
		return;
	}

	// Otherwise, remove edge-connected neighbours that aren't highlighted.
	node.connectedEdges().connectedNodes().filter(function(ele) {
	return !ele.hasClass('important');
	}).remove();
}

function toggle_node_importance(id) {//TODO: add important class
	nodes = worksheetGraph.graph.nodes(`node#${id}`);
	nodes.forEach( function(ele){
		if (ele.hasClass('important')) {
			ele.removeClass('important');
		} else {
			ele.addClass('important');
		}
	});
}

//TODO: replace update with js diver
/*********************************************************************************/

function command_clicked(dbid) {
	inspect_and_import(dbid);

	let vexes = vex.getAll();
	for (let i in vexes) {
		vexes[i].close();
	}
}

//
// How to add an edge to the worksheet
//
function add_edge(data, graph) {
	// Have we already imported this edge?
	if (!graph.edges(`#${data.id}`).empty()) {
		return;
	}

	// If the target is explicitly marked as something we read from
	// (e.g., the by-convention read-from pipe), reverse the edge's direction.
	let source = graph.nodes(`[id="${data.source}"]`);
	let target = graph.nodes(`[id="${data.target}"]`);

	if (source.data() && source.data().type == 'process'
		&& target.data() && target.data().end == 'R') {
		let tmp = data.source;
		data.source = data.target;
		data.target = tmp;
	}

	graph.add({
		classes: data.type,
		data: data,
	});
}

//
// Fetch neighbours to a node, based on some user-specified filters.
//
function get_neighbours(id, fn) {
	return get_neighbours_id(id,
							files = $('#inspectFiles').is(':checked'),
							sockets = $('#inspectSockets').is(':checked'),
							pipes = $('#inspectPipes').is(':checked'),
							process_meta = $('#inspectProcessMeta').is(':checked'));

	// return $.getJSON(`neighbours/${id}?${query}`, fn).fail(err);
}

//
// Fetch successors to a node, based on some user-specified filters.
//
function get_successors(id, fn, err = console.log) {
	return successors_query(id,
					max_depth = 100,
					files = $('#inspectFiles').is(':checked'),
					sockets = $('#inspectSockets').is(':checked'),
					pipes = $('#inspectPipes').is(':checked'),
					process_meta = $('#inspectProcessMeta').is(':checked'));

	// return $.getJSON(`successors/${id}?${query}`, fn).fail(err);
}

//
// How to import a node into the worksheet
//
function import_into_worksheet(id, err = console.log) {
	let graph = worksheetGraph.graph;

	// Have we already imported this node?
	if (!graph.getElementById(id).empty()) {
		return $.when(null);
	}

	let position = {
		x: graph.width() / 2,
		y: graph.height() / 2,
	};

	//TODO: make worksheet detail func first then use it here check if it is the right one
	//return $.getJSON(`detail/${id}`, function(result) {
		console.log("test1");
	get_detail_id(id, function(result) {
		console.log("test2");
		let promise = null;

		if ('parent' in result && graph.nodes(`[id="${result.parent}"]`).empty()) {
			promise = import_into_worksheet(result.parent);
		} else {
			promise = $.when(null);
		}

		promise.then(function() {
			add_node(result, graph, position);
		}).then(function() {
			get_neighbours(id, function(result) {
				let elements = graph.elements();
				let node = graph.nodes(`[id="${id}"]`);

				for (let edge of result.edges) {
					let other = null;
					if (edge.source == id) {
						other = elements.nodes(`#${edge.target}`);
					} else if (edge.target == id) {
						other = elements.nodes(`#${edge.source}`);
					}

					if (!other.empty()) {
						add_edge(edge, graph);
					}
				}
			});
		});
		console.log("test3");
	});
		console.log("test4");
}

function inspect_and_import(id) {
	import_into_worksheet(id);
	inspect_node(id);
}

//
// Add a node and all of its neighbours to the worksheet.
//
function import_neighbours_into_worksheet(id) {
	// Get all of the node's neighbours:
	get_neighbours(id, function(result) {
		console.log("wwwwww");
		let promise = $.when(null);

		for (let n of result.nodes) {
			promise.then(function() { import_into_worksheet(n.id); });
		}
	});
}

//
// Define what it means to "inspect" a node.
//
function inspect_node(id, err = console.log) {
	// Display the node's details in the inspector "Details" panel.
	var inspectee;

	inspector.detail.empty();
	inspector.neighbours.empty();


	//TODO: replace Driver
	//$.getJSON(`detail/${id}`, function(result) {
	get_detail_id(id, function(result) {
		for (let property in result) {
			inspector.detail.append(`
				<tr>
					<th>${property}</th>
					<td>${result[property]}</td>
				</tr>
			`)
		}
		inspectee = result
	}).then(function() {
		// Display the node's immediate connections in the inspector "Graph" panel.
		get_neighbours(id, function(result) {
			inspector.graph.remove('node');

			add_node(inspectee, inspector.graph);

			for (let n of result.nodes) {
				add_node(n, inspector.graph);

				let meta = graphing.node_metadata(n);
				inspector.neighbours.append(`
					<tr>
						<td><a onclick="import_into_worksheet(${n.id})" style="color: black;"><i class="fa fa-${meta.icon}" aria-hidden="true"></i></a></td>
						<td><a onclick="import_into_worksheet(${n.id})">${meta.label}</a></td>
					</tr>
				`);
			}

			for (let e of result.edges) {
				add_edge(e, inspector.graph);
			}

			let n = inspector.graph.elements().nodes(`[id="${id}"]`);
			if (n.empty()) {
				n = inspector.graph.elements().nodes(`[uuid="${id}"]`);
			}
			inspector.graph.inspectee = n;

			// Only use the (somewhat expensive) dagre algorithm when the number of
			// edges is small enough to be computationally zippy.
			if (result.edges.length < 100) {
				layout(inspector.graph, 'dagre');
			} else {
				layout(inspector.graph, 'cose');
			}

			inspector.graph.zoom({
				level: 1,
				position: inspector.graph.inspectee.position(),
			});
		});
	});
}

//
// Define what it means to show "successors" to a node.
//
function successors(id) {
	let graph = worksheetGraph.graph;

	// Display the node's details in the inspector "Details" panel.
	get_successors(id, function(result) {

		let position = {
			x: graph.width() / 2,
			y: graph.height() / 2,
		};

		for (let n of result.nodes) {
			add_node(n, graph, position);
		}

		let elements = graph.elements();
		for (let e of result.edges) {
			add_edge(e, graph);
		}
		//
		//***** old cxt menus
		//
		//attach_context_menu(graph, '#worksheet', worksheet_context_items);
	});
}

//
// Populate node list.
//
function update_nodelist(err = console.log) {
	// let query = {
	// 	node_type: $('#filterNodeType').val(),
	// 	name: $('#filterName').val(),
	// 	host: $('#filterHost').val(),
	// 	local_ip: $('#filterLocalIp').val(),
	// 	local_port: $('#filterLocalPort').val(),
	// 	remote_ip: $('#filterRemoteIp').val(),
	// 	remote_port: $('#filterRemotePort').val(),
	// };

	//TODO: replace Driver
	//$.getJSON('nodes', query,

	get_nodes(node_type = $('#filterNodeType').val(),
			name = $('#filterName').val(),
			host = $('#filterHost').val(),
			local_ip = $('#filterLocalIp').val(),
			local_port = $('#filterLocalPort').val(),
			remote_ip = $('#filterRemoteIp').val(), 
			remote_port = $('#filterRemotePort').val(),
			limit = '100',
			function(result) {
				console.log("sssssssssss");
				let nodelist = $('#nodelist');
				nodelist.empty();

				let current_uuid = null;
				let colour = 0;

				for (let node of result) {
					let meta = node_metadata(node);

					if (node.uuid != current_uuid) {
						colour += 1;
						current_uuid = node.uuid;
					}

					nodelist.append(`
						<tr class="${rowColour(colour)}">
							<td><a onclick="inspect_node(${node.id})" style="color: black;"><i class="fa fa-${meta.icon}" aria-hidden="true"></i></a></td>
							<td>${meta.timestamp}</td>
							<td><a onclick="inspect_node(${node.id})">${meta.label}</a></td>
						</tr>`);
				}
			});//.fail(err);
}

function rowColour(n) {
	switch (n % 6) {
	case 1:
		return 'active';
	case 2:
		return 'info';
	case 3:
		return '';
	case 4:
		return 'warning';
	case 5:
		return 'active';
	case 0:
		return 'success';
	}
}

/*********************************************************************************/

function openPage(pageId){
	$('#machinePage').css('display', 'none');
	$('#notificationPage').css('display', 'none');
	$('#worksheetPage').css('display', 'none');
	$(pageId).css('display', 'block');
}

function refreshGraph(graphId){
	$(graphId).css('height', '99%');
	$(graphId).css('height', '100%');
}

//Functions end

//Parser


function parseNeo4jNode(o){
	var data = {'id': o['identity']['low']};
	var labels = o['labels'];
	if (labels.indexOf('Socket') > -1){//TODO: test socket
		data.type = "socket-version";
		data.names = o['properties']['name'];
		data.creation = o['properties']['timestamp']['low'];
		data.uuid = o['properties']['uuid'];
		data.host = o['properties']['host'];
		data.saw_creation = !o['properties']['anomalous'];
	}
	else if (labels.indexOf('Pipe') > -1){//TODO: test pipe
		data.type = "pipe-endpoint";
		data.creation = o['properties']['timestamp']['low'];
		data.properties = o[properties];
	}
	else if (labels.indexOf('Process') > -1){
		data.type = "process";
		data.properties = o['properties'];
		// data.saw_creation = !o['properties']['anomalous'];
		// data.cmdline = o['properties']['cmdline'];
		// data.host = o['properties']['host'];
		// data.egid = o['properties'][`meta_egid`];
		// data.euid = o['properties'][`meta_euid`];
		// data.gid = o['properties'][`meta_gid`];
		// data.login = o['properties'][`meta_login`];
		// data.ts = o['properties'][`meta_ts`]['low'];
		// data.uid = o['properties'][`meta_uid`];
		// data.pid = o['properties']['pid'];
		// data.uuid = o['properties']['uuid'];
		// data.status = o['properties']['status'];
		// data.timestamp = o['properties']['timestamp'];
		// data.thin = o['properties']['thin'];
	}
	else if (labels.indexOf('Machine') > -1){
		data.type = "machine";
		data.uuid = o['properties']['uuid'];
		data.ips = o['properties']['ips'];
		data.names = o['properties']['name'];
		data.first_seen = o['properties']['timestamp']['low'];
		data.external = o['properties']['external'];
	} 
	else if (labels.indexOf('Meta') > -1){
		data.type = "process-meta";
		data.egid = o['properties'][`meta_egid`];
		data.euid = o['properties'][`meta_euid`];
		data.gid = o['properties'][`meta_gid`];
		data.login = o['properties'][`meta_login`];
		data.ts = o['properties'][`meta_ts`]['low'];
		data.uid = o['properties'][`meta_uid`];
	}
	else if (labels.indexOf('Conn') > -1){//TODO: not many Conns to test with
		data.authority = o['properties'][`authority`];
		data.client = o['properties'][`client`];
		data.client_ip = o['properties'][`client_ip`];
		data.client_port = o['properties'][`client_port`];
		data.confidence = o['properties'][`confidence`];
		data.method = o['properties'][`method`];
		data.server = o['properties'][`server`];
		data.server_ip = o['properties'][`server_ip`];
		data.server_port = o['properties'][`server_port`];
		if(data['type'] != null){
			data['ctype'] = data['type'];
		} 
		else{
			data['ctype'] =  'TCP';
		}
		if (data['ctype'] == 'TCP'){
			data['endpoints'] = [data['client_ip'] + ":" + data['client_port'],
								data['server_ip'] + ":" + data['server_port']];
		}
		else if (data['ctype'] == 'Pipe'){
			data['endpoints'] = ['wrpipe: ' + short_hash(data['wrpipe']),
								'rdpipe: ' + short_hash(data['rdpipe'])];
		}
		data.type= "connection";
	}
	 else{
		data.type = "file-version";
		data.uuid = o['properties']['uuid'];
		data.host = o['properties']['host'];
		data.names = o['properties']['name'];
		data.creation = o['properties']['timestamp'];
		data.saw_creation = !o['properties']['anomalous'];
	}
	// if 'host' in o and o['host'] in self.machines{
	// 	(i, name) = self.machines[o['host']];
	// 	data.update({'hostname': name, 'parent': i});
	// }
	// // Calculate a short, easily-compared hash of something unique
	// // (database ID if we don't have a UUID)
	// unique = o['uuid'] if 'uuid' in o else str(o.id);
	// data['hash'] = short_hash(unique);
	return data;
}

function parseNeo4jEdge(o){
	var id = o['identity']['low'];
	var type_map = {'PROC_PARENT': 'parent'};
	type_map.PROC_OBJ = 'io';
	type_map.META_PREV = 'proc-metadata';
	type_map.PROC_OBJ_PREV = 'proc-change';
	type_map.GLOB_OBJ_PREV = 'file-change';
	type_map.COMM = 'comm';
	var state;
	var src;
	var dst;
	if (o['properties']['state'] != null){
		state = o['properties']['state'];
	} else{
		state = null;
	}
	if (state != null){
		if (state == "NONE"){
			state = null;
		}
		else if (state == "RaW"){
			state = ['READ', 'WRITE'];
		}
		else if ((state.indexOf('CLIENT') > -1) || (state.indexOf('SERVER') > -1)){
			state = [state, 'READ', 'WRITE'];
		}
		else if (state == "BIN"){
			state = [state, 'READ'];
		}
		else{
			state = [state];
		}
	}
	if (state != null && (state.indexOf('WRITE') <= -1)){
		src = o.start;
		dst = o.end;
	}
	if (o['type'] == 'COMM'){
		src = o['start']['low'];
		dst = o['end']['low'];
	}
	else{
		src = o.end;
		dst = o.start;
	}

	return {'source': src,
				'target': dst,
				'id': id,
				'type': type_map[o['type']],
				'state': state};
}

//Parser end

//Queries


function insector_query(id){
	var session = driver.session();
	session.run(`MATCH (p:Process) WHERE id(p) = ${id} RETURN p`)
	.then(result => {return result.records.forEach(function (record) 
		{
			var nodeData = parseNeo4jNode(record.get('p'));
			add_node(nodeData, inspectorGraph);
			add_node(nodeData, testGraph);
		});
		session.close();
	});
}

function cmd_query(id){
	var session = driver.session();
	cmds = session.run(`MATCH (n:Process)<-[:PROC_PARENT]-(c:Process) 
						WHERE id(n) = ${id} 
						RETURN c ORDER BY c.timestamp`)
	.then(result => {return result.records
		console.log(result.records) });//.get('c')

	session.close();
}

function file_read_query(id){
	var session = driver.session();
	nodes = session.run(`MATCH (n:Process)<-[e:PROC_OBJ]-(c:File)
						WHERE id(n) = ${id} AND e.state in ['BIN', 'READ', 'RaW']
						RETURN c.name AS g_name`)
	.then(result => {return result.records
		console.log(result.records) });
	if (files.length <= -1){
		flask.abort(404)
	}
}

function setup_machines() {
	var session = driver.session();
	session.run("MATCH (m:Machine) RETURN m")
	.then(result => {result.records.forEach(function (record) 
		{
			//console.log(record.get('m'));
			var nodeData = parseNeo4jNode(record.get('m'));
			add_node(nodeData, machineGraph);
		});
	});
	session.run("MATCH (:Machine)-[e]->(:Machine) RETURN DISTINCT e")
	.then(result => {result.records.forEach(function (record) 
		{
			//console.log(record.get('e'));
			var temp = record.get('e');
			machineGraph.add([
				{ group: "edges", data: {
					id: temp['identity']['low'],
					source: temp['start']['low'], 
					target: temp['end']['low']}}
			])
		});
		session.close();
	});
	layout( machineGraph, 'cose');
}

//the int one
function get_neighbours_id(id, files=true, sockets=true, pipes=true, process_meta=true){
	var session = driver.session();
	var neighbours;
	var root_node;
	var m_links;
	var m_nodes;
	var m_qry;
	var neighbour_nodes = [];
	var neighbour_edges = [];
	var matchers = ["Machine", "Process", "Conn"];
	if (files){
		matchers = matchers.concat('File');
	}
	if (sockets){
		matchers = matchers.concat('Socket');
	}
	if (pipes){
		matchers = matchers.concat('Pipe');
	}
	if (files && sockets && pipes){
		matchers = matchers.concat('Global');
	}
	if (process_meta){
		matchers = matchers.concat('Meta');
	}
	return session.run(`MATCH (s)-[e]-(d)
				WHERE id(s) = ${id}
				AND NOT
				(
					"Machine" in labels(s)
					AND
					"Machine" in labels(d)
				)
				AND
				(
					NOT d:Pipe
					OR
					d.fds <> []
				)	
				AND
				any(lab in labels(d) WHERE lab IN ${JSON.stringify(matchers)})
				RETURN s, e, d`)

	.then(result => {
		neighbours = result.records;
		if (neighbours.length){
			root_node = neighbours[0].get('s');
			neighbour_nodes = neighbour_nodes.concat(parseNeo4jNode(root_node));
		}
		if (sockets){
			session.run(`MATCH (skt:Socket), (mch:Machine)
						WHERE 
						mch.external
						AND 
						id(skt)=${id}
						AND 
						split(skt.name[0], ":")[0] in mch.ips
						RETURN skt, mch
						UNION
						MATCH (skt:Socket), (mch:Machine)
						WHERE 
						mch.external
						AND 
						id(mch)=${id}
						AND
						split(skt.name[0], ":")[0] in mch.ips
						RETURN skt, mch`)
			.then(result => {
				m_qry = result;
				for(row in m_qry){
					m_links.id = (row['skt'].id + row['mch'].id);
					m_links.source = row['skt'].id;
					m_links.target = row['mch'].id;
					m_links.type = 'comm';
					m_links.state = null; 
					if(row['mch'] == null){
						m_nodes = row['skt'];
					}
					else{
						m_nodes = row['mch'];
					}
					neighbour_nodes = neighbour_nodes.concat(parseNeo4jNode(m_nodes));
					neighbour_edges = neighbour_edges.concat(parseNeo4jEdge(m_links));
				}
			});
		}
		for(row in neighbours){//maybe cause issues where it is not inside then
			neighbour_nodes = neighbour_nodes.concat(parseNeo4jNode(neighbours[row].get('d')));
			neighbour_edges = neighbour_edges.concat(parseNeo4jEdge(neighbours[row].get('e')));
		}
		session.close();
		return ({nodes: neighbour_nodes,
				edges: neighbour_edges});
	});
}

// //the string one
// function get_neighbours_uuid(uuid, files=True, sockets=True, pipes=True, process_meta=True){
// 	var matchers = ['Machine', 'Process', 'Conn'];
// 	if (files){
// 		matchers.add('File');
// 	}
// 	if (sockets){
// 		matchers.add('Socket');
// 	}
// 	if (pipes){
// 		matchers.add('Pipe');
// 	}
// 	if (files && sockets && pipes){
// 		matchers.add('Global');
// 	}
// 	if (process_meta){
// 		matchers.add('Meta');
// 	}

// 	var session = driver.session();
// 	var res = session.run(`MATCH (s)-[e]-(d)
// 						WHERE
// 						exists(s.uuid)
// 						AND 
// 						(
// 							NOT d:Pipe
// 							OR
// 							d.fds <> []
// 						)
// 						AND
// 						s.uuid=${uuid}
// 						AND
// 						any(lab in labels(d) WHERE lab IN ${list(matchers)})
// 						RETURN s, e, d`);

// 	if(res.length){
// 		var root_node = res[0]['s'];
// 	}
// 	else{
// 		var root_node = set();
// 	}
// 	//var root_node = {res[0]['s']} if len(res) else set();
// 	// return flask.jsonify({'nodes': {row['d'] for row in res} | root_node,
// 	// 					  'edges': {row['e'] for row in res}});
// }

function successors_query(dbid, max_depth='4', files=true, sockets=true, pipes=true, process_meta=true){
	max_depth = int(max_depth);
	matchers = set();
	if (files){
		matchers.add('File');
	}
	if (sockets){
		matchers.add('Socket');
	}
	if (pipes){
		matchers.add('Pipe');
	}
	if (files && sockets && pipes){
		matchers.add('Global');
	}
	matchers = list(matchers);
	if (!files && !sockets && !pipes){
		matchers = null;
	}
	console.log(matchers);
	var session = driver.session();
	source = session.run(`MATCH (n) WHERE id(n)=${dbid} RETURN n`);
	if (source == null){
		console.log(404);
	}

	source = source['n'];
	process = [(max_depth, source)];
	nodes = [];
	while (process.length){
		cur_depth, cur = process.pop(0);
		nodes.append(cur);
		var neighbours = null;
		if (cur.labels.indexOf('Global') > -1){
			neighbours = session.run(`MATCH (cur:Global)-[e]->(n:Process)
									WHERE
									id(cur)=${cur.id}
									AND
									e.state in ['BIN', 'READ', 'RaW', 'CLIENT', 'SERVER']
									RETURN n, e
									UNION
									MATCH (cur:Global)<-[e]-(n:Global)
									WHERE
									id(cur)=${cur.id}
									AND
									(
										NOT n:Pipe
										OR
										n.fds <> []
									)
									AND
									NOT ${matchers} is Null
									AND
									any(lab in labels(n) WHERE lab IN ${matchers})
									RETURN n, e
									UNION
									MATCH (cur:Global)-[e]-(n:Conn)
									WHERE id(cur)=${cur.id}
									RETURN n, e`);
		}
		else if (cur.labels.indexOf('Process') > -1){
			neighbours = session.run(`MATCH (cur:Process)<-[e]-(n:Global)
									WHERE
									id(cur)=${cur.id}
									AND
									e.state in ['WRITE', 'RaW', 'CLIENT', 'SERVER']
									AND
									(
										NOT n:Pipe
										OR
										n.fds <> []
									)
									AND
									NOT ${matchers} is Null
									AND
									any(lab in labels(n) WHERE lab IN ${matchers})
									RETURN n, e
									UNION
									MATCH (cur:Process)<-[e]-(n:Process)
									WHERE id(cur)=${cur.id}
									RETURN n, e`);
		}
		else if (cur.labels.indexOf('Conn') > -1){
			neighbours = session.run(`MATCH (cur:Conn)-[e]-(n:Global)
									WHERE
									id(cur)=${cur.id}
									AND
									(
										NOT n:Pipe
										OR
										n.fds <> []
									)
									AND
									NOT ${matchers} is Null
									AND
									any(lab in labels(n) WHERE lab IN ${matchers})
									RETURN n, e`);
		}
		if (neighbours == null){
			continue;
		}
		for (row in neighbours){//TODO: translate
			// if row['n'] in nodes or row['n'] in [n for d, n in process if d < (cur_depth - 1)]{
			// 	continue;
			// }
			if (cur_depth > 0){
				process.append((cur_depth - 1, row['n']));
			}
		}
	}
	var edata = session.run(`MATCH (a)-[e]-(b) WHERE id(a) IN ${ids} AND id(b) IN ${ids} RETURN DISTINCT e`);
	//TODO: swap this out
	//{'ids': [n.id for n in nodes]}).data()

	var edges = [];
	for(row in edata){
		edges.push([row['e']]);
	}

	return flask.jsonify({'nodes': nodes,
						  'edges': edges});
}

function get_detail_id(id){
	var session = driver.session();
	return session.run(`MATCH (n) WHERE id(n)=${id} RETURN n`)
	.then(result => {
		if (result == null){
			console.log(404);
		}
		session.close();
		return(parseNeo4jNode(result.records[0].get('n')));
	});
	//return flask.jsonify(query['n'])
}

// function get_detail_uuid(**kwargs){
// 	var session = driver.session();
// 	query = session.run(
// 			`MATCH (n) WHERE exists(n.uuid) AND n.uuid=${uuid} RETURN n`);
// 			//kwargs).single()
// 	if (query == null){
// 		console.log(404);
// 	}
// 	return flask.jsonify(query['n'])
// }

function get_nodes(node_type=null, 
				name=null, 
				host=null, 
				local_ip=null, 
				local_port=null, 
				remote_ip=null, 
				remote_port=null, 
				limit='100'){
	var lab;
	var node_labels = {'pipe-endpoint': 'Pipe',
					'socket-version': 'Socket',
					'process': 'Process',
					'machine': 'Machine',
					'process-meta': 'Meta',
					'connection': 'Conn',
					'file-version': 'Global'};
	if  (!(node_type in node_labels)){
		lab = "Null";
	}
	else{
		lab = node_labels[node_type];
	}
	if (local_ip == null || local_ip == ""){
		local_ip = ".*?";
	}
	if (local_port == null || local_port == ""){
		local_port = ".*?";
	}
	if (remote_ip == null || remote_ip == ""){
		remote_ip = ".*?";
	}
	if (remote_port == null || remote_port == ""){
		remote_port = ".*?";
	}
	var nodes = [];
	var session = driver.session();
	session.run(`MATCH (n)
				WHERE 
					${JSON.stringify(lab)} is Null
					OR
					${JSON.stringify(lab)} in labels(n)
				WITH n
				WHERE
					${JSON.stringify(name)} is Null
					OR
					${JSON.stringify(name)} = ''
					OR
					any(name in n.name WHERE name CONTAINS ${JSON.stringify(name)})
					OR
					n.cmdline CONTAINS ${JSON.stringify(name)}
				WITH n
				WHERE
					${JSON.stringify(host)} is Null
					OR
					${JSON.stringify(host)} = ''
					OR
					(
						exists(n.host)
						AND
						n.host = ${JSON.stringify(host)}
					)
					OR
					n.uuid = ${JSON.stringify(host)}
				WITH n
				MATCH (m:Machine)
				WHERE
					(
						n:Conn
						AND
						(
							n.client_ip=~${JSON.stringify(local_ip)}
							OR
							n.server_ip=~${JSON.stringify(local_ip)}
							OR
							(
								n.type = 'Pipe'
								AND
								${JSON.stringify(local_ip)} = '.*?'
							)
						)
						AND
						(
							n.client_port=~${JSON.stringify(local_port)}
							OR
							n.server_port=~${JSON.stringify(local_port)}
							OR
							(
								n.type = 'Pipe'
								AND
								${JSON.stringify(local_port)} = '.*?'
							)
						)
						AND
						(
							n.server_ip=~${JSON.stringify(remote_ip)}
							OR
							n.client_ip=~${JSON.stringify(remote_ip)}
							OR
							(
								n.type = 'Pipe'
								AND
								${JSON.stringify(remote_ip)} = '.*?'
							)
						)
						AND
						(
							n.server_port=~${JSON.stringify(remote_port)}
							OR
							n.client_port=~${JSON.stringify(remote_port)}
							OR
							(
								n.type = 'Pipe'
								AND
								${JSON.stringify(remote_port)} = '.*?'
							)
						)
					)
					OR
					(
						NOT n:Conn
						AND
						(
							NOT n:Socket
							OR
							(
								n:Socket
								AND
								any(name in n.name
								WHERE name =~ (${JSON.stringify(remote_ip)}+':?'+${JSON.stringify(remote_port)}))
								AND
								(
									${JSON.stringify(local_ip)} = ".*?"
									OR
									(
										m.uuid = n.host
										AND
										any(l_ip in m.ips
										WHERE l_ip = ${JSON.stringify(local_ip)})
									)
								)
							)
						)
					)
				RETURN DISTINCT n
				LIMIT ${limit}`)
	 .then(result => {
		session.close();
	 	result.records.forEach(function (record) 
		{
			nodes = nodes.concat(parseNeo4jNode(record.get('n')));
		});
		console.log(nodes);
		return nodes;
	 });
		//flask.jsonify([row['n'] for row in query.data()])
}

//Queries end

//Button logic

document.getElementById("machinesPageBtn").onclick = function () {
	openPage('#machinePage');
	refreshGraph('#machineGraph');
};

document.getElementById("notificationsPageBtn").onclick = function () {
	openPage('#notificationPage');
};

document.getElementById("WorksheetPageBtn").onclick = function () {
	openPage('#worksheetPage');
	refreshGraph('#worksheetGraph');
	refreshGraph('#inspectorGraph');
};

document.getElementById("hideAnalysisWorksheet").onclick = function () { 
	$('#analysisWorksheet').toggleClass('hide');
	$('#worksheet').toggleClass('expandedWorksheet');
};

document.getElementById("loadGraph").onchange = function () {
	load(this.files[0], worksheetGraph);
};

document.getElementById("saveGraph").onclick = function () { 
	//worksheetGraph.graph.cxtmenu(worksheetCxtMenu);
	//save(worksheetGraph.graph);
	update_nodelist();
};

//layout from graphing.js
document.getElementById("reDagre").onclick = function () {
	worksheetGraph.graph.cxtmenu(worksheetCxtMenu);
	//layout( worksheetGraph.graph, 'cose'); //TODO: get cDagre online
};

//layout from graphing.js
document.getElementById("reCose-Bilkent").onclick = function () { 
	layout( worksheetGraph.graph, 'cose'); //TODO: get cose-bilkent online
	layout( machineGraph, 'cose');
};

//Button logic ends
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })
/******/ ]);