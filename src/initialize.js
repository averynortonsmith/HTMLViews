(function(){
	var elements = document.querySelectorAll('[data-view-show]')
	Array.prototype.forEach.call(elements, function(el, i){
		el.style.display = "none"
	});
}());