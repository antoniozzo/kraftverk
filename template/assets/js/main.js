var toggleWidth = function(parentSelector, selector, target) {
	var parents = document.querySelectorAll(parentSelector);

	[].forEach.call(parents, function(parent) {
		var nodes = parent.querySelectorAll('['+ selector + ']');

		[].forEach.call(nodes, function(node) {
			node.onclick = function() {
				[].forEach.call(nodes, function(node) {
					node.classList.remove('is-active');
				});

				var iframe = parent.querySelector(target);

				if (iframe) {
					iframe.style.width = node.getAttribute(selector);
					node.classList.add('is-active');
				}
			}
		});
	});
};

(function() {

	iFrameResize();
	prettyPrint();
	toggleWidth('.section', 'data-toggle-width', 'iframe');

})();
