var neo4j = window.neo4j.v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "abcde"));

function searchMovies(queryString) {
	var session = driver.session();
	return session//Top Gun
		.run(
			'MATCH (movie:Movie)<-[:ACTED_IN | :WROTE]-(actor:Person) \
			WHERE movie.title =~ {title} \
			RETURN actor',
		{title: '(?i).*' + queryString + '.*'}
	)
	.then(result => {
		session.close();
		return result;});
}


var testGraph = cytoscape({
	container: document.getElementById('worksheetGraph'),
	boxSelectionEnabled: true,
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
			content: 'Inspect',//TODO: get it working
			select: function(ele){
				inspect_node(ele.data('id'));
			}
		},
		{
			content: 'Import neighbours',//TODO: get it working
			select: function(ele){
			import_neighbours_into_worksheet(ele.data('id'));
			}
		},
		{
			content: 'Import successors',//TODO: get it working
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
			content: 'Files read',//TODO: get it working
			select: function(ele){
				var id = ele.data('id');
				$.getJSON(`files_read/${id}`, function(result) {
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
			content: 'Commands',//TODO: get it working
			select: function(ele){
				var id = ele.data('id');
				$.getJSON(`cmds/${id}`, function(result) {
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

var cy = cytoscape({
	container: document.getElementById('machineGraph'),
	elements: [
	{ data: { id: 'EN-1020', name: 'Introduction to Programming' } },
	{ data: { id: 'EN-1040', name: 'Mechanisms and Electric Circuits' } },
	{ data: { id: 'EN-3861', name: 'Digital Logic' } },
	{ data: { id: 'EN-3891', name: 'Foundations of Programming' } },
	{ data: { id: 'EN-4862', name: 'Microprocessors' } },
	{ data: { id: 'EN-4892', name: 'Data Structures' } },
	{ data: { id: 'EN-5865', name: 'Digital Systems' } },
	{ data: { id: 'EN-5895', name: 'Software Design' } },
	{ data: { id: 'EN-6861', name: 'Computer Architecture' } },
	{ data: { id: 'EN-6892', name: 'Algorithms: Complexity and Correctness' } },
	{ data: { id: 'EN-7894', name: 'Concurrent Programming' } },
	{ data: { id: 'EN-8894', name: 'Real-time Operating Systems' } },
	{
		data: {
			id: '1020-3891',
			source: 'EN-1020',
			target: 'EN-3891'
		}
	},
	{
		data: {
			id: '1040-3861',
			source: 'EN-1040',
			target: 'EN-3861'
		}
	},
	{
		data: {
			id: '3861-4862',
			source: 'EN-3861',
			target: 'EN-4862'
		}
	},
	{
		data: {
			id: '3891-4892',
			source: 'EN-3891',
			target: 'EN-4892'
		}
	},
	{
		data: {
			id: '3891-5865',
			source: 'EN-3891',
			target: 'EN-5865'
		}
	},
	{
		data: {
			id: '4862-5865',
			source: 'EN-4862',
			target: 'EN-5865'
		}
	},
	{
		data: {
			id: '4892-5895',
			source: 'EN-4892',
			target: 'EN-5895'
		}
	},
	{
		data: {
			id: '5865-6861',
			source: 'EN-5865',
			target: 'EN-6861'
		}
	},
	{
		data: {
			id: '5895-6892',
			source: 'EN-5895',
			target: 'EN-6892'
		}
	},
	{
		data: {
			id: '6861-7894',
			source: 'EN-6861',
			target: 'EN-7894'
		}
	},
	{
		data: {
			id: '6892-7894',
			source: 'EN-6892',
			target: 'EN-7894'
		}
	},
	{
		data: {
			id: '7894-8894',
			source: 'EN-7894',
			target: 'EN-8894'
		}
	}],
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

layout( cy, 'cose');


var inspectorGraph = cytoscape({
	container: document.getElementById('inspectorGraph'),
	elements: [
	{ data: { id: 'EN-1020', name: 'Introduction to Programming' } },
	{ data: { id: 'EN-1040', name: 'Mechanisms and Electric Circuits' } },
	{ data: { id: 'EN-3861', name: 'Digital Logic' } },
	{ data: { id: 'EN-3891', name: 'Foundations of Programming' } },
	{ data: { id: 'EN-4862', name: 'Microprocessors' } },
	{ data: { id: 'EN-4892', name: 'Data Structures' } },
	{ data: { id: 'EN-5865', name: 'Digital Systems' } },
	{ data: { id: 'EN-5895', name: 'Software Design' } },
	{ data: { id: 'EN-6861', name: 'Computer Architecture' } },
	{ data: { id: 'EN-6892', name: 'Algorithms: Complexity and Correctness' } },
	{ data: { id: 'EN-7894', name: 'Concurrent Programming' } },
	{ data: { id: 'EN-8894', name: 'Real-time Operating Systems' } },
	{
		data: {
			id: '1020-3891',
			source: 'EN-1020',
			target: 'EN-3891'
		}
	},
	{
		data: {
			id: '1040-3861',
			source: 'EN-1040',
			target: 'EN-3861'
		}
	},
	{
		data: {
			id: '3861-4862',
			source: 'EN-3861',
			target: 'EN-4862'
		}
	},
	{
		data: {
			id: '3891-4892',
			source: 'EN-3891',
			target: 'EN-4892'
		}
	},
	{
		data: {
			id: '3891-5865',
			source: 'EN-3891',
			target: 'EN-5865'
		}
	},
	{
		data: {
			id: '4862-5865',
			source: 'EN-4862',
			target: 'EN-5865'
		}
	},
	{
		data: {
			id: '4892-5895',
			source: 'EN-4892',
			target: 'EN-5895'
		}
	},
	{
		data: {
			id: '5865-6861',
			source: 'EN-5865',
			target: 'EN-6861'
		}
	},
	{
		data: {
			id: '5895-6892',
			source: 'EN-5895',
			target: 'EN-6892'
		}
	},
	{
		data: {
			id: '6861-7894',
			source: 'EN-6861',
			target: 'EN-7894'
		}
	},
	{
		data: {
			id: '6892-7894',
			source: 'EN-6892',
			target: 'EN-7894'
		}
	},
	{
		data: {
			id: '7894-8894',
			source: 'EN-7894',
			target: 'EN-8894'
		}
	}],
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
				console.log(ele.data('id'));
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
				console.log(ele);
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
function get_neighbours(id, fn, err = console.log) {
	const query =
		`files=${$('#inspectFiles').is(':checked')}` +
		`&sockets=${$('#inspectSockets').is(':checked')}` +
		`&pipes=${$('#inspectPipes').is(':checked')}` +
		`&process_meta=${$('#inspectProcessMeta').is(':checked')}`;

	return $.getJSON(`neighbours/${id}?${query}`, fn).fail(err);
}

//
// Fetch successors to a node, based on some user-specified filters.
//
function get_successors(id, fn, err = console.log) {
	const query =
		`files=${$('#inspectFiles').is(':checked')}` +
		`&sockets=${$('#inspectSockets').is(':checked')}` +
		`&pipes=${$('#inspectPipes').is(':checked')}` +
		`&process_meta=${$('#inspectProcessMeta').is(':checked')}` +
		`&max_depth=100`;

	return $.getJSON(`successors/${id}?${query}`, fn).fail(err);
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

	return $.getJSON(`detail/${id}`, function(result) {
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
		}).fail(err).then(function(){
			attach_context_menu(graph, '#worksheet', worksheet_context_items);
		});
	});
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

	$.getJSON(`detail/${id}`, function(result) {
		for (let property in result) {
			inspector.detail.append(`
				<tr>
					<th>${property}</th>
					<td>${result[property]}</td>
				</tr>
			`)
		}
		inspectee = result
	}).fail(err).then(function() {
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

		attach_context_menu(graph, '#worksheet', worksheet_context_items);
	});
}

//
// Populate node list.
//
function update_nodelist(err = console.log) {
	let query = {
		node_type: $('#filterNodeType').val(),
		name: $('#filterName').val(),
		host: $('#filterHost').val(),
		local_ip: $('#filterLocalIp').val(),
		local_port: $('#filterLocalPort').val(),
		remote_ip: $('#filterRemoteIp').val(),
		remote_port: $('#filterRemotePort').val(),
	};


	$.getJSON('nodes', query, function(result) {
		let nodelist = $('#nodelist');
		nodelist.empty();

		let current_uuid = null;
		let colour = 0;

		for (let node of result) {
			let meta = graphing.node_metadata(node);

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
	}).fail(err);
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
	//$('#worksheetGraph').toggleClass('expandedWorksheet');
};

document.getElementById("loadGraph").onchange = function () {
	load(this.files[0], worksheetGraph);
};

document.getElementById("saveGraph").onclick = function () { 
	save(worksheetGraph.graph);
};

//layout from graphing.js
document.getElementById("reDagre").onclick = function () { 
	searchMovies("Top Gun").then(movies => {console.log(movies)});
	//worksheetGraph.graph.cxtmenu(worksheetCxtMenu);
	//layout( worksheetGraph.graph, 'cose'); //TODO: get cDagre online
};

//layout from graphing.js
document.getElementById("reCose-Bilkent").onclick = function () { 
	layout( worksheetGraph.graph, 'cose'); //TODO: get cose-bilkent online
};

//Button logic ends