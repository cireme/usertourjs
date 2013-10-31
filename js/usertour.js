(function ($) {
	
	$.widget('nt.tutorial', {
		
		widgetEventPrefix:"tutorial",
		
		options: {
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
		},
	 
		_create: function () {
			this._setOptions({
				'steps': this.options.steps,
				'elementContainer': this.element,
				'currentStep': this.options.currentStep,
				'completeHref': this.options.completeHref,
				'completeBtnText': this.options.completeBtnText,
				'exitBtnText': this.options.exitBtnText,
				'nextBtnText': this.options.nextBtnText,
				'prevBtnText': this.options.prevBtnText,
				'endBtnText': this.options.endBtnText,
				'borderColor': this.options.borderColor
			});
		},
		
		_destroy: function () {
			exitPressed(this);
		},
		// start tutorial
		start: function (step) {
			// set the starting step			
			this._setOption('currentStep', (typeof step !== "undefined") ? step : 0);
			
			createOverlay(this);
			
			var intro = this.options.intro;
			
			// check for intro launch
			if(intro.launch) {
				this.intro();
			} else {
				this.show();
			}
		},
		// the introduction step
		intro: function() {
			showIntro(this);
		},
		// the introduction accept
		intro_accept: function() {
			closeIntro(false);
			this.show();
		},
		// the introduction refuse
		intro_refuse: function() {
			this._trigger("beforeclose");
			closeIntro(true);
		},
		// set the current step
		setStep: function (step, index) {			
			this.options.steps[index] = step;
		},
		// remove the given step
		removeStep: function (index) {			
			this.options.steps.splice(index, 1);

		},
		// get the current step
		getCurrentStep: function() {
			return this.options.currentStep;
		},
		// go to next step
		next: function () {
			this._trigger("beforenext");
			nextPressed(this);
			
			if(this.options.steps.length!=(this.options.currentStep)) {
				this.show();
				this._trigger("afternext");
			} else {
				this._trigger("end");
			}
		},
		// go to previous step
		prev: function () {
			this._trigger("beforeprev");
			previousPressed(this);
			this.show();
			this._trigger("afterprev");
		},
		// show step
		show: function() {
			this._trigger("beforeshow");
			var widget = this;
			setTimeout(function() {showStep(widget);},500);
			this._trigger("aftershow");
		},
		// exit tutorial
		exit: function () {
			this._trigger("exit");
			exitPressed(this);
		}
		
	});
	
	/**
	 * Show the tutorial introduction step
	 */
	function showIntro(widget) {
		$(widget.options.elementContainer).append([
			'<div id="tutorial-intro" class="window">',
				'<div id="intro-title">',
					widget.options.intro.title,
				'</div>',
				'<div id="intro-text">',
					widget.options.intro.text,
				'</div>',
				'<div id="intro-btn">',
					'<button id="intro-accept" class="btn">',
						widget.options.intro.acceptText,
					'</button>',
					'<button id="intro-refuse" class="btn">',
						widget.options.intro.refuseText,
					'</button>',
				'</div>',
			'</div>'
		].join(''));
		
		$("#tutorial-intro").css({
			'z-index' : '6000'
		}).center().show();
		
		$(window).resize(function() {
			$("#tutorial-intro").center();
		});
		
		$("#overlay").css("opacity", "0.1");
		delegateIntroEvent(widget);
	}
	
	/**
	 * Close the intro box 
	 */
	function closeIntro(closeOverlay) {
		$("#tutorial-intro").remove();
		if(closeOverlay) {
			$("#overlay").remove();
		}
		$('html,body').animate({
	    	scrollTop: 0
	    },'slow');
	}
	
	/**
	* Show the current step tooltip
	*/
	function showStep(widget){
		
		var currentStep = widget.options.currentStep;
		var step = widget.options.steps[currentStep];

		// add title
		$(step.identifier).attr('title', '#');
		
		// add tutorial tooltip
		$(widget.options.elementContainer).append(
			[
				'<div class="tutorial-tooltip">',
				createTooltipContent(step, widget),
				'</div>'
			].join('')
		);
		
		var x=$(step.identifier).offset().left;
		var y=$(step.identifier).offset().top;
		var height = $(step.identifier).innerHeight();
		var width = $(step.identifier).innerWidth();
		
		addBorderedDiv(y, x, height, width, widget);
		
		handlePosition(widget);
		
		addArrow(widget);
			
		$(window).resize(function() {
			handlePosition(widget);
		});
		
		delegateEvents(widget);
		
		$('html,body').animate({
	    	scrollTop: $(widget.options.id).offset().top
	    },'slow');	
	}
	
	/**
	 * Create the tooltip content
	 */
	function createTooltipContent(step, widget) {
		// create div to add in tooltip
		return [
			'<div class="tutorial-title">',
				escapeHTML(step.title),
			'</div>',
			'<div class="tutorial-description">',
				escapeHTML(step.text),
			'</div>',
			createBtnContainer(widget)
		].join('');
	}
	
	/**
	*	Create the overlay
	*/
	function createOverlay(widget) {
		var container = widget.options.elementContainer;		
		var elementHeight = (container=="body") ? '100%' : container.height();
		var elementWidth = (container=="body") ? '100%' : container.width();
		var step = widget.options.steps[widget.options.currentStep];

		$(container).append("<div id='overlay'></div>");

		$("#overlay")
			.height(elementHeight)
			.width(elementWidth)
			.css({
				'position' : 'fixed',
				'top' : 0,
				'left' : 0,
				'z-index' : 5000,
				'background-color' : '#fff',
				'opacity' : 0
		});
		
		$(window).resize(function() {
			$('#overlay')
				.height($(container).height())
				.width($(container).width())
				.position({
					of: $(container)
				});
		});
	}
	
	
	/**
	 * Create the button container element
	 */
	function createBtnContainer(widget) {		
		return [
			'<div class="tutorial-btn-container">',
				createExitBtn(widget),
				createPreviousBtn(widget),
				createNextBtn(widget),
			'</div>'
		].join('');
	}
	
	/**
	* Create the next button
	*/
	function createNextBtn(widget) {
		var btnText;
		
		if(widget.options.steps.length-1 == widget.options.currentStep) {
			if(widget.options.completeHref!="") {
				btnText = widget.options.completeBtnText;
			} else {
				btnText = widget.options.endBtnText;
			}
		} else {
			btnText = widget.options.nextBtnText;
		}
		
		return [
				'<button class="tutorial-next">',
					escapeHTML(btnText),
				'</button>'
		].join('');
	}
	
	/**
	* Create the previous button
	*/
	function createPreviousBtn(widget) {
	
		if(widget.options.currentStep==0) {
			
			if(widget.options.prevHref!="") {
				return [
					'<button class="tutorial-previous">',
						escapeHTML(widget.options.prevRedirectBtn),
					'</button>'
				].join('');
			}				
			
			return;
		}
		
		return [
			'<button class="tutorial-previous">',
				escapeHTML(widget.options.prevBtnText),
			'</button>'
		].join('');
	}
	
	/**
	* Create the previous button
	*/
	function createExitBtn(widget) {
		
		if(widget.options.currentStep==widget.options.steps.length-1 
			&& widget.options.completeHref=="") {
			return;
		}
	
		return [
				'<button class="tutorial-exit">',
					escapeHTML(widget.options.exitBtnText),
				'</button>'
		].join('');
	}
	
	/**
	* When tutorial is done
	*/
	function onComplete(widget) {
		if(widget.options.last) {
			widget._trigger("complete");
		}
		
		if(widget.options.completeHref!= undefined && widget.options.completeHref!="") {
			document.location.href = widget.options.completeHref;
			return false;
		}
		
		$("#overlay").remove();
		hideCurrentStep(widget);
		removeBorderedDiv();
		$('html,body').animate({
	    	scrollTop: 0
	    },'slow');
	}
	
	/**
	* Hide the current step tooltip
	*/
	function hideCurrentStep(widget) {
		$(widget.options.id).remove();
		undelegateEvents(widget);
	}
	
	/**
	* Handle next pressed
	*/
	function nextPressed(widget) {
		if(widget.options.steps.length-1 == widget.options.currentStep) {
			onComplete(widget);
			widget.options.currentStep++;
			return false;
		}
		
		hideCurrentStep(widget);
		removeBorderedDiv();
		
		widget.options.currentStep++;
	}
	
	/**
	* Handle previous pressed
	*/
	function previousPressed(widget) {
		
		if(widget.options.currentStep==0 && widget.options.prevHref!="") {
			document.location.href = widget.options.prevHref;
			return false;
		}
		
		hideCurrentStep(widget);
		removeBorderedDiv();
		
		widget.options.currentStep--;
	}
	
	/**
	* Handle exit pressed
	*/
	function exitPressed(widget) {
		$("#overlay").remove();
		hideCurrentStep(widget);
		removeBorderedDiv();
		if(widget.options.exitHref!=undefined && widget.options.exitHref!="") {
			document.location.href = widget.options.exitHref;
		}
		$('html,body').animate({
	    	scrollTop: 0
	    },'slow');
		return false;
	}
	
	/**
	 * Add surrounding div with colored border
	 */
	function addBorderedDiv(top, left, height, width, widget) {
		var currentStep = widget.options.currentStep;
		var step = widget.options.steps[currentStep];
		var borderSize = widget.options.borderSize;
		var x=$(step.identifier).offset().left;
		var y=$(step.identifier).offset().top;
	
		var $divBordered = $("<div/>")
			.attr('id', 'bordered-tutorial')
			.css({
				'height':height,
				'width':width,
				"border":borderSize+"px solid #"+widget.options.borderColor,
				'z-index' : 5010,
				'position' : 'absolute',
				'top' : y,
				'left' : x
			});
		
		$("body").append($divBordered);
		
		$(window).resize(function() {
			$divBordered
				.height($(step.identifier).height())
				.width($(step.identifier).width())
				.position({
					of: $(step.identifier)
				});
			
		});
	}
	
	function removeBorderedDiv() {
		$("#bordered-tutorial").remove();
	}
	
	/**
	* Add arrow to tutorial tooltip
	*/
	function addArrow(widget) {
		// get current step
		var step = widget.options.steps[widget.options.currentStep];
		
		$arrow = $("<div/>").addClass('arrow');
		
		if(step.position == "top") {
			$arrow.addClass('b');
			$(widget.options.id).append($arrow);
		}
		if(step.position == "bottom") {
			$arrow.addClass('t');
			$(widget.options.id).append($arrow);
		}
		if(step.position == "left") {
			$arrow.addClass('r');
			$(widget.options.id).append($arrow);
		}
		if(step.position == "right") {
			$arrow.addClass('l');
			$(widget.options.id).append($arrow);
		}
	}
	
	/**
	* Handle tutorial position
	*/
	function handlePosition(widget) {
		var currentStep = widget.options.currentStep;
		var step = widget.options.steps[currentStep];
		var x=$(step.identifier).offset().left;
		var y=$(step.identifier).offset().top;
		var height = $(step.identifier).innerHeight();
		var width = $(step.identifier).innerWidth();
		
		var xPos = 0;
		var yPos = 0;
		var borderDiff = widget.options.borderSize-1;
		
		// get tooltip sizes
		var tooltipHeight = $(widget.options.id).height();
		var tooltipWidth = $(widget.options.id).width();
		
		// get current step
		var step = widget.options.steps[widget.options.currentStep];
		
		if(step.position == "top") {
			yPos = (y-(tooltipHeight+28+borderDiff));
			xPos = x;
		}
		if(step.position == "bottom") {
			yPos = (y+height+10+borderDiff);
			xPos = x;
		}
		if(step.position == "left") {
			yPos = y;
			xPos = (x-(tooltipWidth+borderDiff+28));
		}
		if(step.position == "right") {
			yPos = y;
			xPos = (x+width+10+borderDiff);
		}
		
		// change tooltip position and increment tooltip id for next shown
		$(widget.options.id)
			.css({left:xPos,top:yPos});
	}
	
	/**
	 * Delegate Intro events 
	 */
	function delegateIntroEvent(widget) {
		// delegate intro accept click
		$(widget.options.elementContainer).delegate('#intro-accept', 'click', function () {
			widget.intro_accept();
		});
		// delegate intro refuse click
		$(widget.options.elementContainer).delegate('#intro-refuse', 'click', function () {
			widget.intro_refuse();
		});
	}
	
	/**
	 * Undelegate Intro events 
	 */
	function undelegateIntroEvents(widget) {
		$(widget.options.elementContainer).undelegate('#intro-accept', 'click');
		$(widget.options.elementContainer).undelegate('#intro-refuse', 'click');
	}
	
	/**
	*	Delegate widget events
	*/
	function delegateEvents(widget) {
		
		// delegate next click
		$(widget.options.elementContainer).delegate('.tutorial-next', 'click', function () {
			widget.next();
		});
		
		// delegate previous click
		if(widget.options.currentStep!=0 || widget.options.prevHref!="") {
			$(widget.options.elementContainer).delegate('.tutorial-previous', 'click', function () {
				widget.prev();
			});
		}
		
		// delegate exit click
		$(widget.options.elementContainer).delegate('.tutorial-exit', 'click', function () {
			widget.exit();
		});
		
		// delegate keydown
		$(document).delegate("body", "keydown", function(e) {			
			// pressed enter or right
			if(e.keyCode == 39 || e.keyCode == 13){
				e.preventDefault();
				widget.next();
				return false;
			}
			// pressed esc
			if(e.keyCode == 27){
				e.preventDefault();
				widget.exit();
				return false;
			}
			if(widget.options.currentStep!=0 || widget.options.prevHref!="") {
				// pressed left
				if(e.keyCode == 37){
					e.preventDefault();
					widget.prev();
					return false;
				}
			}
		});
	}
	
	/**
	*	Undelegate all widget events
	*/
	function undelegateEvents(widget) {
		$(widget.options.elementContainer).undelegate('.tutorial-next', 'click');
		$(widget.options.elementContainer).undelegate('.tutorial-previous', 'click');
		$(widget.options.elementContainer).undelegate('.tutorial-exit', 'click');
		$(document).undelegate("body", "keydown");
		$(window).off("resize");
	}
	
	var escape = document.createElement('textarea');
	function escapeHTML(html) {
		escape.innerHTML = html;
		return escape.innerHTML;
	}
	
	$.fn.center = function () {
	    this.css("position","absolute");
	    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
	                                                $(window).scrollTop()) + "px");
	    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
	                                                $(window).scrollLeft()) + "px");
	    return this;
	};
	
})( jQuery );