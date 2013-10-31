README
======================

# What is usertour.js

It's a jQuery widget for web applications that want to offer a step by step tour to their users.


[You can try it here if you want](http://www.emeric-stophe.fr/tutorial-jquery/)


## Requirements

jQuery dependency


## How to use it

### Setting the widget in your project

1. Download the `usertour.js`, the `usertour.css` and add it to your project

2. Create a config file use to set your different steps, 'tourcongig.js' as done in the example

###### Set class or id on the part of your web app that you want to show

```html
<h2 id="tuto1"> First I want to show this special title to the user</h2>

<div id="tuto2">
	Then I want to show this element to the user
</div>
```

###### Set your steps in the config file 

For example 

```javascript
$(document).ready(function() {
	$("body") /* Apply it on the body */
		.tutorial({
			steps : [ {
				identifier : "#tuto1",
				position : "right",
				title : "The title ", 
				text : "You can see here a wonderful h2 title"
			}, {
				identifier : "#tuto2",
				position : "right",
				title : "A bit of text", 
				text : "And here you can highlight a text :)"
			} ]
		})
		.init() /* Call the widget init method */
		.tutorial("start"); /* And launch it */ 
});
```

Here is a simple example of a tour of two steps


## Define Options

Different options can be set to the tour or to the different steps. They all have default values to work on first launch. You can change the container, the id of the tool-tip, the border-color of the highlight or even the button text :

```javascript
id:".tutorial-tooltip",
steps : [],
intro : {
	launch : false,
	text : "test",
	title : "titre",
	acceptText : "Launch",
	refuseText : "Close"
},
elementContainer : "body",
currentStep : 0,
prevHref : "",
prevRedirectBtn : "",
completeHref : "",
completeBtnText : "Continue",
exitBtnText : "Exit",
nextBtnText : "Next",
prevBtnText : "Previous",
endBtnText : "The end", 
borderColor : "004ECC",
borderSize: 1,
last: false
```