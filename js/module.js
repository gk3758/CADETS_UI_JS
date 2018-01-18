var testGraph = cytoscape({
	container: document.getElementById('worksheetGraph'),
	boxSelectionEnabled: true,
});

var worksheetGraph = {
	graph: testGraph
};

//worksheetGraph.graph.cxtmenu(
var worksheetCxtMenu = 
{
	menuRadius: 140,
	separatorWidth: 5,
	selector: 'node',
	commands: [
		{
			content: 'Inspect',
			select: function(ele){
			}//inspect_node
		},
		{
			content: 'Import neighbours',
			select: function(ele){
			}//import_neighbours_into_worksheet
		},
		{
			content: 'Import successors',
			select: function(ele){
			}//import_neighbours_into_worksheet
		},
		{
			content: 'Highlight',
			select: function(ele){
			}//toggle_node_importance
		},
		{
			content: 'Files read',
			select: function(ele){
				// $.getJSON(`files_read/${id}`, function(result) {
				// 	let str = '';
				// 	Array.from(result.names).forEach(function(name) {
				// 		str += `<li>${name}</li>`;  // XXX: requires trusted UI server!
				// 	});
				// 	vex.dialog.alert({
				// 		unsafeMessage: `<h2>Files read:</h2><ul>${str}</ul>`,
				// 	});
				// });
			}
		},
		{
			content: 'Commands',
			select: function(ele){
				// $.getJSON(`cmds/${id}`, function(result) {
				// 	let message = `<h2>Commands run by node ${id}:</h2>`;
				// 	if (result.cmds.length == 0) {
				// 		message += '<p>none</p>';
				// 	} else {
				// 		message += '<ul>';
				// 		for (let command of result.cmds) {
				// 			console.log(command);
				// 			message += `<li><a onclick="command_clicked(${command.dbid})">${command.cmd}</a></li>`;
				//   		}
				//   		message += '</ul>';
				// 	}
				// 	vex.dialog.alert({ unsafeMessage: message });
				// });
			}
		},
		{
			content: 'Remove neighbours',
			select: function(ele){
			}//remove_neighbours_from_worksheet
		},
		{
			content: 'Remove',
			select: function(ele){
			}//remove_from_worksheet
		},
						
	]
};

//worksheetGraph.graph.cxtmenu = worksheetCxtMenu;

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

var cy2 = cytoscape({
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

cy2.cxtmenu({
	selector: 'node',
	commands: [
		{
			content: 'Import node',
			select: function(ele){
		}//import_into_worksheet
		},
		{
			content: 'Import neighbours',
			select: function(ele){
		}//import_neighbours_into_worksheet
		},
		{
			content: 'Inspect',
			select: function(ele){
		}//inspect_node
		},
		{
			content: 'Import and Inspect',
			select: function(ele){
		}//inspect_and_import
		},
	]
});

//Button logic

document.getElementById("machinesPageBtn").onclick = function () {
	$('#machinePage').css('display', 'block');
	$('#notificationPage').css('display', 'none');
	$('#worksheetPage').css('display', 'none');

	//TODO: turn in to function
	$('#machineGraph').css('height', '99%');
	$('#machineGraph').css('height', '100%');
};

document.getElementById("notificationsPageBtn").onclick = function () {
	$('#machinePage').css('display', 'none');
	$('#notificationPage').css('display', 'block');
	$('#worksheetPage').css('display', 'none');
};

document.getElementById("WorksheetPageBtn").onclick = function () {
	$('#machinePage').css('display', 'none');
	$('#notificationPage').css('display', 'none');
	$('#worksheetPage').css('display', 'block');
	//TODO: turn in to function
	$('#worksheetGraph').css('height', '99%');
	$('#worksheetGraph').css('height', '100%');
	$('#inspectorGraph').css('height', '99%');
	$('#inspectorGraph').css('height', '100%');
	layout( cy2, 'cose');
};

document.getElementById("hideAnalysisWorksheet").onclick = function () { 
	$('#analysisWorksheet').toggleClass('hide');
	$('#worksheet').toggleClass('expandedWorksheet');
	$('#worksheetGraph').toggleClass('expandedWorksheet');
};

document.getElementById("loadGraph").onchange = function () {
	load(this.files[0], worksheetGraph);
};

document.getElementById("saveGraph").onclick = function () { 
	save(worksheetGraph.graph);
};

//layout from graphing.js
document.getElementById("reDagre").onclick = function () { 
	worksheetGraph.graph.cxtmenu(worksheetCxtMenu);
	//layout( worksheetGraph.graph, 'cose'); //TODO: get cDagre online
};

//layout from graphing.js
document.getElementById("reCose-Bilkent").onclick = function () { 
	layout( worksheetGraph.graph, 'cose'); //TODO: get cose-bilkent online
};