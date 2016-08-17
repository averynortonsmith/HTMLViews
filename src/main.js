// start by hiding all elements that have '[data-view-show]'
// to prevent a flash-of-unstyled-content
(function(){
	var elements = document.querySelectorAll('[data-view-show]')
	Array.prototype.forEach.call(elements, function(el, i){
		el.style.display = "none"
	});
}());

// get jQuery (Browserify)
var $ = require("jquery")

$("document").ready(function(){
	HTMLViews.initialize()
})

HTMLViews = {}

// take a 'view string' (the string value of a data-ex-setview attribute, or other view-setting attribute)
HTMLViews.parseViewString = function(fullString){
	if (fullString.indexOf(":") > -1){
		var parentString = fullString.slice(0, fullString.indexOf(":"))
		var viewType = "boolean"
		var variable = undefined
	}
	else if (fullString.indexOf("|") > -1){
		var parentString = fullString.slice(0, fullString.indexOf("|"))
		var viewType = "variable"
		var variable = "mainView"
	}
	else {
		parentString = "body"
		var viewType = "variable"
		var variable = "mainView"
	}
	var viewString = fullString.substring(parentString.replace("body", "").length).replace("|", "").replace(":", "")
	if (viewString.indexOf("=") > -1){
		var newView = viewString.substring(viewString.indexOf("=") + 1)
		variable = viewString.substring(0, viewString.indexOf("="))
	}
	else {
		var newView = viewString.replace("|", "")
	}
	return {"newView": newView, "parentString": parentString, "viewType": viewType, "variable": variable}
}

// figure out which element contains the view-scope for this element
HTMLViews.getViewParent = function(elem, parsedView){
	if (parsedView.parentString.substring(0, 6) == "parent"){
		if (parsedView.parentString == "parent"){
			return elem.parent()
		}
		else {
			// (gets the nth closest ancestor, i.e. parent[2] would be the grandparent)
			return elem.parents().eq(parsedView.parentString.substring(7).slice(0, -1))
		}
	}
	else if (parsedView.parentString == "this"){
		return elem
	}
	else if (parsedView.parentString == "body"){
		return $("body")
	}
	else {
		return $("body")
		// var returnElem
		// elem.each(function(){
		// 	returnElem = eval('(' + parsedView.parentString + ')')
		// })
		// return returnElem
	}
}

// set a view in the appropriate scope, using the data from a parsed view-string
HTMLViews.setView = function(elem, parsedView, toggle){
	var viewParent = HTMLViews.getViewParent(elem, parsedView)
 	if (parsedView.viewType == "variable"){
		var variableViews = viewParent.data("variableViews")
		variableViews[parsedView.variable] = parsedView.newView
		viewParent.data("variableViews", variableViews)
	}
	else {
		if (toggle){
			var booleanViews = viewParent.data("booleanViews")
			if (booleanViews.has(parsedView.newView)){
				booleanViews.delete(parsedView.newView)
			}
			else {
				booleanViews.add(parsedView.newView)
			}
			viewParent.data("booleanViews", booleanViews)
		}
		else {
			var booleanViews = viewParent.data("booleanViews")
			booleanViews.add(parsedView.newView)
			viewParent.data("booleanViews", booleanViews)
		}
	}
}

// set the default view variables for elements which define view scopes
// set click / hover / toggle bindings for view-setting elements
HTMLViews.initialize = function(){
	HTMLViews.viewParents = []
	$('[data-view-setview], [data-view-hoverview], [data-view-toggleview]').each(function(){
		if ($(this).data("view-setview")){
			var parsedView = HTMLViews.parseViewString($(this).data("view-setview"))
		}
		else if ($(this).data("view-hoverview")){
			var parsedView = HTMLViews.parseViewString($(this).data("view-hoverview"))
		}
		else {
			var parsedView = HTMLViews.parseViewString($(this).data("view-toggleview"))
		}
		viewParent = HTMLViews.getViewParent($(this), parsedView)
		viewParent.data("variableViews", {}).data("booleanViews", new Set())
		HTMLViews.viewParents.push(viewParent)
		$(this).css({"cursor": "pointer"})
	})

	$('[data-view-setview]').each(function(){
		$(this).click(function(e){
			e.stopPropagation()

			HTMLViews.setView($(this), HTMLViews.parseViewString($(this).data("view-setview")), false)
			HTMLViews.render()
		})
	})

	$('[data-view-hoverview]').each(function(){
		$(this).hover(function(e){
			e.stopPropagation()

			HTMLViews.setView($(this), HTMLViews.parseViewString($(this).data("view-hoverview")), true)
			HTMLViews.render()
		})
	})

	$('[data-view-toggleview]').each(function(){
		$(this).click(function(e){
			e.stopPropagation()

			HTMLViews.setView($(this), HTMLViews.parseViewString($(this).data("view-toggleview")), true)
			HTMLViews.render()
		})
	})

	HTMLViews.render()
	$('[data-view-default]').click()
}

// for debuggin, prints out a list of the view states of the page
HTMLViews.showViews = function(){
	for(var elem in HTMLViews.viewParents){
		console.log(HTMLViews.viewParents[elem].getPath())
		console.log("variableViews:")
		console.log(HTMLViews.viewParents[elem].data("variableViews"))
		console.log("booleanViews:")
		console.log(HTMLViews.viewParents[elem].data("booleanViews"))
	}
}

// show / hide all of the elements on a page, based on the current view states
HTMLViews.render = function(){
	$('[data-view-on]').each(function(){
		var parsedView = HTMLViews.parseViewString($(this).data("view-on"))
		var viewParent = HTMLViews.getViewParent($(this), parsedView)
		var visible = false
		if (parsedView.viewType == "variable"){
			if (viewParent.data("variableViews")[parsedView.variable] == parsedView.newView){
				visible = true
			}
		}
		else {
			if (viewParent.data("booleanViews").has(parsedView.newView)){
				visible = true
			}
		}
		var fadeSpeed = $(this).data("view-fade") ? $(this).data("view-fade") : 0
		if (visible){
			$(this).stop().fadeIn(fadeSpeed)
		}
		else {
			$(this).stop().fadeOut(fadeSpeed)
		}
	})
	$('[data-view-setview], [data-view-hoverview], [data-view-toggleview]').each(function(){
		if ($(this).data("view-setview")){
			var parsedView = HTMLViews.parseViewString($(this).data("view-setview"))
		}
		else if ($(this).data("view-hoverview")){
			var parsedView = HTMLViews.parseViewString($(this).data("view-hoverview"))
		}
		else {
			var parsedView = HTMLViews.parseViewString($(this).data("view-toggleview"))
		}
		viewParent = HTMLViews.getViewParent($(this), parsedView)
		if (parsedView.viewType == "variable"){
			if (viewParent.data("variableViews")[parsedView.variable] == parsedView.newView){
				$(this).addClass("viewActive")
			}
			else {
				$(this).removeClass("viewActive")
			}
		}
		else {
			if (viewParent.data("booleanViews").has(parsedView.newView)){
				$(this).addClass("viewActive")
			}
			else {
				$(this).removeClass("viewActive")
			}
		}
	})

}

//source: http://stackoverflow.com/questions/2068272/getting-a-jquery-selector-for-an-element
$.fn.getPath = function () {
    if (this.length != 1) throw 'Requires one element.';

    var path, node = this;
    while (node.length) {
        var realNode = node[0], name = realNode.localName;
        if (!name) break;
        name = name.toLowerCase();

        var parent = node.parent();

        var siblings = parent.children(name);
        if (siblings.length > 1) { 
            name += ':eq(' + siblings.index(realNode) + ')';
        }

        path = name + (path ? '>' + path : '');
        node = parent;
    }

    return path;
};