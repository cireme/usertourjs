$(document).ready(function() {
	$("body")
		.tutorial({
			steps : [ {
				identifier : "#tuto1",
				position : "right",
				title : "Title 1", 
				text : "The text number 1"
			}, {
				identifier : "#tuto2",
				position : "right",
				title : "Title 2", 
				text : "The text number 2"
			}, {
				identifier : "#tuto3",
				position : "top",
				title : "Title 3", 
				text : "The text number 3"
			}, {
				identifier : "#tuto4",
				position : "left",
				title : "Title 4", 
				text : "The text number 4"
			}, {
				identifier : "#tuto5",
				position : "top",
				title : "Title 5", 
				text : "The text number 5"
			}
			],
			intro : {
				launch:true,
				title:"Tutorial Introduction",
				text:"Welcome to the Jquery Tutorial Widget."+ 
				"You are going to see a quick example of what can be down with "+
				"it. First, the Introduction that you're reading right now,"+
				"it is optional. You can choose between skiping the tutorial or launching it"
			}
		})
		.init()
		.tutorial("start");
});