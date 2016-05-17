/*
 * text editor version 0.1
 * by 2sik
 * Recent Update:
 * mail: ham2sik@gmail.com
 */

"use strict";

/* console fn */
function con() {try {var args=[].join.call(arguments,' , ');console.log(args);}	catch(e){ }}

/* triple click fn */
$.event.special.tripleclick = {
	setup: function(data, namespaces) {
		var elem = this, $elem = jQuery(elem);
		$elem.bind('click', jQuery.event.special.tripleclick.handler);
	},
	teardown: function(namespaces) {
		var elem = this, $elem = jQuery(elem);
		$elem.unbind('click', jQuery.event.special.tripleclick.handler)
	},
	handler: function(event) {
		var elem = this, $elem = jQuery(elem), clicks = $elem.data('clicks') || 0, start = $elem.data('startTimeTC') || 0;
		if ((new Date().getTime() - start)>= 1000) {
			clicks = 0;
		}
		clicks += 1;
		if(clicks === 1) {
			start = new Date().getTime();
		}
		if ( clicks === 3 ) {
			clicks = 0;

			// set event type to "tripleclick"
			event.type = "tripleclick";
			
			// let jQuery handle the triggering of "tripleclick" event handlers
			$elem.trigger('tripleclick');
		}
		$elem.data('clicks', clicks);
		$elem.data('startTimeTC', start);
	}
};

/* tag strip fn */
function strip_tags (input, allowed) {
	allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gim;
	return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	});
}

/* selection fn */
var selectTimer;

function selection($this) {
	try	{
		var newSelection = window.getSelection();

		if (newSelection.toString().trim() !== '') {
			var range=newSelection.getRangeAt(0),
				startNode=range.startContainer.parentNode,
				endNode=range.endContainer.parentNode,
				$toolbarUl=$this.parents('.editWrap').find('.editor_toolbar ul'),
				editWrapTop=$this.parents('.editWrap').offset().top,
				editWrapLeft=$this.parents('.editWrap').offset().left,
				boundary=range.getBoundingClientRect();
				
			/* init */
			$this.parents('.editWrap').find('.editor_toolbar').addClass('on').css({'top':$(document).scrollTop()+boundary.top-editWrapTop-65,'left':(boundary.right+boundary.left)/2-editWrapLeft-223});
			$toolbarUl.find('button').removeClass('on');

			/* node check - loop */
			if (startNode.className=='wysiwyg') {
				startNode=range.startContainer;
			}
			while ((startNode.nodeName!='H1')&&(startNode.nodeName!='H2')&&(startNode.nodeName!='P')) {
				startNode=startNode.parentNode;
			}

			if (endNode.className=='wysiwyg') {
				endNode=range.endContainer;
			}
			while ((endNode.nodeName!='H1')&&(endNode.nodeName!='H2')&&(endNode.nodeName!='P')) {
				endNode=endNode.parentNode;
			}

			/* align, header btn active */
			activeChk($this,startNode, endNode);
		} else {
			$this.parents('.editWrap').find('.editor_toolbar').removeClass('on').removeAttr('style');
		}
	} catch(err) {
		console.log(err);
	}
}

/* btn active fn */
function activeChk($this, startNode, endNode) {
	$this.parents('.editWrap').find('.editor_toolbar ul button').removeClass('on');
	while (startNode!=endNode) {
		/* align */
		var alignValue=startNode.style.textAlign;
		if (alignValue=="") {
			alignValue="left";
		}
		var alignClass="editor_action_"+alignValue;
		$this.parents('.editWrap').find('.editor_toolbar ul .'+alignClass).addClass('on');

		/* header */
		if (startNode.nodeName=='H1') {
			$this.parents('.editWrap').find('.editor_toolbar ul .editor_action_header1').addClass('on');
		} else if (startNode.nodeName=='H2') {
			$this.parents('.editWrap').find('.editor_toolbar ul .editor_action_header2').addClass('on');
		}

		startNode=startNode.nextSibling;
	}

	/* align end */
	alignValue=endNode.style.textAlign;
	if (alignValue=="") {
		alignValue="left";
	}
	var alignClass="editor_action_"+alignValue;
	$this.parents('.editWrap').find('.editor_toolbar ul .'+alignClass).addClass('on');

	/* header end */
	if (endNode.nodeName=='H1') {
		$this.parents('.editWrap').find('.editor_toolbar ul .editor_action_header1').addClass('on');
	} else if (endNode.nodeName=='H2') {
		$this.parents('.editWrap').find('.editor_toolbar ul .editor_action_header2').addClass('on');
	}
}

/* editor textarea fn */
function textareaKeydownHandler() {
	var $this=$(this);

	clearTimeout(selectTimer);
	selectTimer=setTimeout(function() {selection($this);}, 10);
}

/* editor toolbar fn */
function textalignHandler(event) {
	event.stopPropagation();
	var newSelection = window.getSelection(),
		range=newSelection.getRangeAt(0),
		startNode=range.startContainer.parentNode,
		endNode=range.endContainer.parentNode,
		$this=$(this),
		name=event.data.name;
		
	if (startNode.className=='wysiwyg') {
		startNode=range.startContainer;
	}
	while ((startNode.nodeName!='H1')&&(startNode.nodeName!='H2')&&(startNode.nodeName!='P')) {
		startNode=startNode.parentNode;
	}

	if (endNode.className=='wysiwyg') {
		endNode=range.endContainer;
	}
	while ((endNode.nodeName!='H1')&&(endNode.nodeName!='H2')&&(endNode.nodeName!='P')) {
		endNode=endNode.parentNode;
	}

	while (startNode!=endNode) {
		startNode.style.textAlign=name;
		startNode=startNode.nextSibling;
	}
	endNode.style.textAlign=name;

	selection($this);
}

function headingsHandler(event) {
	event.stopPropagation();
	var newSelection = window.getSelection(),
		range=newSelection.getRangeAt(0),
		startNode=range.startContainer.parentNode,
		endNode=range.endContainer.parentNode,
		$this=$(this),
		name=event.data.name;

	if (startNode.className=='wysiwyg') {
		startNode=range.startContainer;
	}
	while ((startNode.nodeName!='H1')&&(startNode.nodeName!='H2')&&(startNode.nodeName!='P')) {
		startNode=startNode.parentNode;
	}

	if (endNode.className=='wysiwyg') {
		endNode=range.endContainer;
	}
	while ((endNode.nodeName!='H1')&&(endNode.nodeName!='H2')&&(endNode.nodeName!='P')) {
		endNode=endNode.parentNode;
	}

	if (startNode.nodeName!==name) {
		if (!$('html').hasClass('is-ie')) {
			document.execCommand('formatBlock', false, name);
			selection($this);
		} else {
			startNode.className=name;
			$('.wysiwyg .'+name).replaceWith('<'+name+'>' + $('.wysiwyg .'+name).html() +'</'+name+'>');
			newSelection.removeAllRanges();
		}

	} else {
		if (!$('html').hasClass('is-ie')) {
			document.execCommand('formatBlock', false, 'p');
			selection($this);
		} else {
			startNode.className='p';
			$('.wysiwyg .p').replaceWith('<p>' + $('.wysiwyg .p').html() +'</p>');
			newSelection.removeAllRanges();
		}
	}
}

function textStyleHandler(event) {
	event.stopPropagation();
	var $toolbarUl=$(this).parents('.editor_toolbar').find('ul'),
		name=event.data.name;

	//if (($toolbarUl.hasClass('line'))||($toolbarUl.hasClass('lines'))) {
		document.execCommand(name, false, null);
	//}
}

function clearSelection() {
	if (window.getSelection) {
		window.getSelection().removeAllRanges();
	} else if (document.selection) {
		document.selection.empty();
	}
}

/* editor init fn */
function editorInit() {
	$('body').append('<div class="anchorPreview"></div>');
	/* select fn */
	$(document).on('mouseup', '.wysiwyg', textareaKeydownHandler);
	$(document).on('keyup', '.wysiwyg', textareaKeydownHandler);
	$(document).on('keydown', '.wysiwyg', function() {
		$('.editor_toolbar').removeClass('on').removeAttr('style');
	});
	$(document).on('click', document, function(event) {
		//con('shit');
		$('.editor_toolbar').removeClass('on').removeAttr('style');
	});
	$(document).on('click', '.editor_toolbar', function(event) {
		event.stopPropagation();
	});
	$(document).on('mouseover', '.wysiwyg a', function() {
		var targetTop=$(this).offset().top,
			urlValue=$(this).attr('href');
/*		var range=newSelection.getRangeAt(0),
			startNode=range.startContainer.parentNode,
			endNode=range.endContainer.parentNode,
			$toolbarUl=$this.parents('.editWrap').find('.editor_toolbar ul'),
			editWrapTop=$this.parents('.editWrap').offset().top,
			editWrapLeft=$this.parents('.editWrap').offset().left,
			boundary=range.getBoundingClientRect();
	
		
		var urlValue=$(this).attr('href');
		con(urlValue);
*/
		$('.anchorPreview').css({'top':targetTop,'left':0}).html(urlValue);


	});



	/* toolbar fn */
	$(document).on('click', '.editor_action_left', {name:''}, textalignHandler);
	$(document).on('click', '.editor_action_center', {name:'center'}, textalignHandler);
	$(document).on('click', '.editor_action_right', {name:'right'}, textalignHandler);

	$(document).on('click', '.editor_action_header1', {name:'H1'}, headingsHandler);
	$(document).on('click', '.editor_action_header2', {name:'H2'}, headingsHandler);

	$(document).on('click', '.editor_action_bold', {name:'bold'}, textStyleHandler);
	$(document).on('click', '.editor_action_italic', {name:'italic'}, textStyleHandler);
	$(document).on('click', '.editor_action_underline', {name:'underline'}, textStyleHandler);

	/* url fn */
	var urlSelection,
		urlRange;
	$(document).on('click', '.editor_action_anchor', function(event) {
		event.stopPropagation();
		//if (($(this).parents('.editor_toolbar').find('ul').hasClass('line'))||($(this).parents('.editor_toolbar').find('ul').hasClass('lines'))) {
			urlSelection=window.getSelection();
			urlRange=urlSelection.getRangeAt(0);
			if ($(this).hasClass('on')) {
				document.execCommand('unlink', false, null);
			} else {
				$(this).parents('.editor_toolbar').find('.editor_toolbar_form_anchor').show().find('.anchor_input').val("").focus();
			}
		//}
	});
	$(document).on('click', '.anchor_save', function(event) {
		event.stopPropagation();
		//var urlValue='mailto:';
		
		var urlValue=$(this).parent().find('.anchor_input').val();
		//con(urlValue);

		/* set */
		urlSelection.removeAllRanges();
		urlSelection.addRange(urlRange);

		document.execCommand('CreateLink', false, urlValue);
		$(this).parent().hide();
		$('.editor_toolbar').removeClass('on').removeAttr('style');
		clearSelection();
	});
	$(document).on('click', '.anchor_close', function(event) {
		event.stopPropagation();
		$(this).parent().hide();
		$('.editor_toolbar').removeClass('on').removeAttr('style');
	});


	/* editer */
	$(document).on('keypress', '.wysiwyg', function(event) {
		if ((event.shiftKey)&&(event.keyCode=='13')) {
			//document.execCommand('insertHTML', false, '<br><br>');
			//document.execCommand('formatBlock', false, 'p');
			event.preventDefault();
		} else if (event.keyCode=='13') {
			var newSelection = window.getSelection(),
				range=newSelection.getRangeAt(0),
				startNode=range.startContainer.parentNode;

			if (!$('html').hasClass('is-ie')) {
				if (startNode.nodeName=='DIV') {
					document.execCommand('formatBlock', false, 'p');
				} else {
					document.execCommand('formatBlock', false, startNode.nodeName);
				}
			}
		}

	});

	$(document).on('click', '.wysiwyg', function(event) {
		event.stopPropagation();
		if ($(this).text()=='') {
			$(this).html('<p></p>');
		}
	});

	$(document).on('paste', '.wysiwyg', function(event) {
		var pastedData;
		if (!$('html').hasClass('is-ie')) {
			event.preventDefault();
			pastedData=event.originalEvent.clipboardData.getData('text/html');
			pastedData=strip_tags(pastedData, '<h1><h2><p><b><i><u>');
			document.execCommand('insertHTML', false, pastedData);
			$(this).find('*').removeAttr('style').removeAttr('class');
		} else {
			event.preventDefault();
			pastedData=window.clipboardData.getData('Text');
			//con(pastedData);
			if (window.getSelection) {
				window.getSelection().getRangeAt(0).insertNode( document.createTextNode(pastedData) );
			}
		}
	});

}

function chromeInit() {
	$(document).on('keyup', '.wysiwyg', function(event) {
		if ((event.keyCode=='8')||(event.keyCode=='46')) {
			$(this).find('span').removeAttr('style');
			//var data=$(this).html();
			//data=strip_tags(data, '<h1><h2><p><b><i><u><a>');
			//$(this).html(data);
			/*
			pastedData=e.originalEvent.clipboardData.getData('text/html');
			pastedData=strip_tags(pastedData, '<h1><h2><p><b><i><u>');
			document.execCommand('insertHTML', false, pastedData);
			$(this).find('*').removeAttr('style').removeAttr('class');
			*/
		}
	});
}


$(function() {
	/* init */
	editorInit();

	/* ie check */
	var ua = navigator.userAgent.toLowerCase();
	if ( ua.indexOf( 'msie' ) != -1 || ua.indexOf( 'trident' ) != -1 ) {
		var version = 11;
		ua = /msie ([0-9]{1,}[\.0-9]{0,})/.exec( ua );
		if( ua ) {
			version = parseInt( ua[ 1 ] );
		}
		var classNames='is-ie';
		classNames += ' ie' + version;
		document.getElementsByTagName('html' )[ 0 ].className+=classNames;
	} else if ( ua.indexOf( 'chrome' ) != -1 ) {
		var classNames='is-chrome';
		document.getElementsByTagName('html' )[ 0 ].className+=classNames;
		chromeInit();
	} else if ( ua.indexOf( 'firefox' ) != -1 ) {
		var classNames='is-firefox';
		document.getElementsByTagName('html' )[ 0 ].className+=classNames;
	}

});


