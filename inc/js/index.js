$("document").ready(function(){
	HTMLViews.initialize()
})

HTMLViews = {}

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

HTMLViews.getViewParent = function(elem, parsedView){
	if (parsedView.parentString == "parent"){
		return elem.parent()
	}
	else if (parsedView.parentString == "this"){
		return elem
	}
	else if (parsedView.parentString == "body"){
		return $("body")
	}
	else {
		return $("body")
	}
}

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

HTMLViews.initialize = function(){
	HTMLViews.viewParents = []
	$('[data-view-setview]').each(function(){
		var parsedView = HTMLViews.parseViewString($(this).data("view-setview"))
		viewParent = HTMLViews.getViewParent($(this), parsedView)
		viewParent.data("variableViews", {}).data("booleanViews", new Set())
		HTMLViews.viewParents.push(viewParent)
	})

	$('[data-view-hoverview]').each(function(){
		var parsedView = HTMLViews.parseViewString($(this).data("view-hoverview"))
		viewParent = HTMLViews.getViewParent($(this), parsedView)
		viewParent.data("variableViews", {}).data("booleanViews", new Set())
		HTMLViews.viewParents.push(viewParent)
	})

	$('[data-view-toggleview]').each(function(){
		var parsedView = HTMLViews.parseViewString($(this).data("view-toggleview"))
		viewParent = HTMLViews.getViewParent($(this), parsedView)
		viewParent.data("variableViews", {}).data("booleanViews", new Set())
		HTMLViews.viewParents.push(viewParent)
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
}

HTMLViews.showViews = function(){
	for(var elem in HTMLViews.viewParents){
		console.log(HTMLViews.viewParents[elem].getPath())
		console.log("variableViews:")
		console.log(HTMLViews.viewParents[elem].data("variableViews"))
		console.log("booleanViews:")
		console.log(HTMLViews.viewParents[elem].data("booleanViews"))
	}
}

HTMLViews.render = function(){
	$('[data-view-show]').each(function(){
		var parsedView = HTMLViews.parseViewString($(this).data("view-show"))
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
		if (visible){
			$(this).show()
		}
		else {
			$(this).hide()
		}
	})
}

//source: http://stackoverflow.com/questions/2068272/getting-a-jquery-selector-for-an-element
jQuery.fn.getPath = function () {
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


// // old code
// View.initialize = function(){
// 	


// 	$('[data-view-toggleview]').each(function(){
// 		$(this).click(function(e){
// 			e.stopPropagation()
// 			newView = $(this).data("view-toggleview")
// 			viewParent = $(this).closest("[data-view-local]")
// 			if (viewParent.length == 0){
// 				viewParent = $("body")
// 			}
// 			if(newView.charAt(0) == ":"){
// 				if(viewParent.data("subViews").has(newView)){
// 					viewParent.data("subViews").delete(newView)
// 				}
// 				else {
// 					viewParent.data("subViews").add(newView)
// 				}
// 			}
// 			View.render()
// 		})
// 	})

// 	$('[data-view-hoverview]').each(function(){
// 		$(this).hover(function(e){
// 			e.stopPropagation()
// 			newView = $(this).data("view-hoverview")
// 			viewParent = $(this).closest("[data-view-local]")
// 			if (viewParent.length == 0){
// 				viewParent = $("body")
// 			}
// 			if(newView.charAt(0) == ":"){
// 				if(viewParent.data("subViews").has(newView)){
// 					viewParent.data("subViews").delete(newView)
// 				}
// 				else {
// 					viewParent.data("subViews").add(newView)
// 				}
// 			}
// 			View.render()
// 		})
// 	})
// 	View.render()
// }

// View.render = function(){
// 	$('[data-view-view]').each(function(){
// 		viewParent = $(this).closest("[data-view-local]")
// 		if (viewParent.length == 0){
// 			viewParent = $("body")
// 		}
// 		console.log(Array.from(viewParent.data("subViews")).indexOf($(this).data("view-view")) > -1)
// 		if (viewParent.data("mainView") == $(this).data("view-view")){
// 			$(this).show()
// 		}
// 		else if (Array.from(viewParent.data("subViews")).indexOf($(this).data("view-view")) > -1){
// 			$(this).show()
// 		}
// 		else {
// 			$(this).hide()
// 		}
// 	})
// 	$('[data-view-setview], [data-view-toggleview]').each(function(){
// 		viewParent = $(this).closest("[data-view-local]")
// 		if (viewParent.length == 0){
// 			viewParent = $("body")
// 		}
// 		if (viewParent.mainView == $(this).data("view-setview")){
// 			$(this).addClass("viewActive")
// 		}
// 		else if (Array.from(viewParent.data("subViews")).indexOf($(this).data("view-setview")) > -1 || Array.from(viewParent.data("subViews")).indexOf($(this).data("view-toggleview")) > -1){
// 			$(this).addClass("viewActive")
// 		}
// 		else {
// 			$(this).removeClass("viewActive")
// 		}
// 	})
// }

// View.initialize()

// $.fn.nextOrFirst = function(selector){
//     var next = this.next(selector);
//     return (next.length) ? next : this.siblings().first();
// }

// $.fn.prevOrLast = function(selector){
//     var prev = this.prev(selector);
//     return (prev.length) ? prev : this.siblings().last();
// }

// function escape(target) {
// 	return target.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1');      
// }

// function export_string(s){
// 	var link = document.createElement('a');
// 	link.setAttribute('href', 'data:text/plain,' + JSON.stringify(s));
// 	link.setAttribute('download', 'export.txt');
// 	document.getElementsByTagName("body")[0].appendChild(link).click().remove();
// }