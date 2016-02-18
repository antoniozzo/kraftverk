var toggleWidth = function(parentSelector, selector, target) {
	var parents = document.querySelectorAll(parentSelector);

	[].forEach.call(parents, function(parent) {
		var nodes = parent.querySelectorAll('[' + selector + ']');

		[].forEach.call(nodes, function(node) {
			node.onclick = function() {
				[].forEach.call(nodes, function(node) {
					node.classList.remove('is-active');
				});

				var iframe = parent.querySelector(target);

				if (iframe) {
					iframe.style.width = node.getAttribute(selector);

					setTimeout(function() {
						iframe.iFrameResizer.resize();
					}, 500);

					node.classList.add('is-active');
				}
			}
		});
	});
};

var scrollSpy = function(selector, dataSelector, offset) {
	var nodes = document.querySelectorAll('[' + dataSelector + ']');
	var target = document.querySelector(selector);
	var sections = {};
	var i = 0;

	[].forEach.call(nodes, function(node) {
		sections[node.getAttribute(dataSelector)] = node.offsetTop;
	});

	window.onscroll = function() {
		var scrollPosition = (document.documentElement.scrollTop || document.body.scrollTop) + offset;

		for (i in sections) {
			if (sections[i] <= scrollPosition) {
				target.innerHTML = i;
			}
		}
	};
};

(function() {

	iFrameResize();
	prettyPrint();
	toggleWidth('.section', 'data-toggle-width', 'iframe');
	scrollSpy('.js-breadcrumb', 'data-section', 200);

})();
