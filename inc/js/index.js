$("document").ready(function(){

})

View = {}

View.initialize = function(){
	$('body').data("mainView", undefined).data("subViews", new Set())

	$('[data-view-local]').each(function(){
		$(this).data("mainView", undefined).data("subViews", new Set())
	})

	$('[data-view-setview]').each(function(){
		viewParent = $(this).data("view-setview").indexOf(":")
		if (viewParent.length == 0){
			viewParent = $("body")
		}
	})

	$('[data-view-setview]').each(function(){
		$(this).click(function(e){
			e.stopPropagation()
			newView = $(this).data("view-setview")
			viewParent = $(this).closest("[data-view-local]")
			if (viewParent.length == 0){
				viewParent = $("body")
			}
			if(newView.charAt(0) == ":"){
				viewParent.data("subViews").add(newView)
			}
			else {
				viewParent.data("mainView", newView)
			}
			View.render()
			console.log(newView)
		})
	})


	$('[data-view-toggleview]').each(function(){
		$(this).click(function(e){
			e.stopPropagation()
			newView = $(this).data("view-toggleview")
			viewParent = $(this).closest("[data-view-local]")
			if (viewParent.length == 0){
				viewParent = $("body")
			}
			if(newView.charAt(0) == ":"){
				if(viewParent.data("subViews").has(newView)){
					viewParent.data("subViews").delete(newView)
				}
				else {
					viewParent.data("subViews").add(newView)
				}
			}
			View.render()
		})
	})

	$('[data-view-hoverview]').each(function(){
		$(this).hover(function(e){
			e.stopPropagation()
			newView = $(this).data("view-hoverview")
			viewParent = $(this).closest("[data-view-local]")
			if (viewParent.length == 0){
				viewParent = $("body")
			}
			if(newView.charAt(0) == ":"){
				if(viewParent.data("subViews").has(newView)){
					viewParent.data("subViews").delete(newView)
				}
				else {
					viewParent.data("subViews").add(newView)
				}
			}
			View.render()
		})
	})
	View.render()
}

View.render = function(){
	$('[data-view-view]').each(function(){
		viewParent = $(this).closest("[data-view-local]")
		if (viewParent.length == 0){
			viewParent = $("body")
		}
		console.log(Array.from(viewParent.data("subViews")).indexOf($(this).data("view-view")) > -1)
		if (viewParent.data("mainView") == $(this).data("view-view")){
			$(this).show()
		}
		else if (Array.from(viewParent.data("subViews")).indexOf($(this).data("view-view")) > -1){
			$(this).show()
		}
		else {
			$(this).hide()
		}
	})
	$('[data-view-setview], [data-view-toggleview]').each(function(){
		viewParent = $(this).closest("[data-view-local]")
		if (viewParent.length == 0){
			viewParent = $("body")
		}
		if (viewParent.mainView == $(this).data("view-setview")){
			$(this).addClass("viewActive")
		}
		else if (Array.from(viewParent.data("subViews")).indexOf($(this).data("view-setview")) > -1 || Array.from(viewParent.data("subViews")).indexOf($(this).data("view-toggleview")) > -1){
			$(this).addClass("viewActive")
		}
		else {
			$(this).removeClass("viewActive")
		}
	})
}

View.initialize()

$.fn.nextOrFirst = function(selector){
    var next = this.next(selector);
    return (next.length) ? next : this.siblings().first();
}

$.fn.prevOrLast = function(selector){
    var prev = this.prev(selector);
    return (prev.length) ? prev : this.siblings().last();
}

function escape(target) {
	return target.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1');      
}

function export_string(s){
	var link = document.createElement('a');
	link.setAttribute('href', 'data:text/plain,' + JSON.stringify(s));
	link.setAttribute('download', 'export.txt');
	document.getElementsByTagName("body")[0].appendChild(link).click().remove();
}