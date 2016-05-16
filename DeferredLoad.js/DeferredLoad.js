'use strict';

var DeferredLoad = function(){
	this.init();
};

DeferredLoad.prototype = {
	stack : [],
	load : null,
	loaded : false,
	trackingViewOffsetTop : 0,

	init : function(){
		this.cacheElement();
		this.initStore();
		this.deferredItems !== undefined && this.bindEvent();
	},

	initStore : function(){
		var len = this.deferredItems.length >>> 0;

		for(; len--; this.stack[len] = this.deferredItems[len]);

		this.trackingViewOffsetTop = this.stack[0].getBoundingClientRect().top;
	},

	cacheElement : function(){
		this.deferredItems = document.querySelectorAll('[data-deferred-complete=N]');
	},

	bindEvent : function(){
		this.load = this.loadItems.bind(this);

		document.addEventListener('DOMContentLoaded', this.load, false);
		window.addEventListener('scroll', this.load, false);
	},

	unbindEvent : function(){
		this.stack.length === 0 && window.removeEventListener('scroll', this.load, false);
	},

	getBoundingClientProperty : function(item){
		if(item === undefined){
			return;
		}

		var rect = item.getBoundingClientRect();

		return (rect && rect.top >= 0) <= window.innerHeight || document.documentElement.clientHeight;
	},

	replaceOriginalItem : function(item, index){
		var deferred = item.getAttribute('data-deferred');

		if(item.src !== undefined && item.tagName === 'IMG'){
			item.src = deferred;
		} else {
			item.style.backgroundImage = ['url(', deferred, ')'].join('');
		}

		this.removeItems(item, index);
	},

	removeItems : function(item, index){
		if(this.stack.indexOf(item) !== -1){
			item.dataset['deferredComplete'] = 'Y';
			this.stack.splice(index, 1);
			this.unbindEvent();
		}
	},

	loadItems : function(){
		var len = this.stack.length;

		this.unbindEvent();

		while(len-- > 0){
			var item = this.stack[len];

			if(this.getBoundingClientProperty(item) === true){
				this.replaceOriginalItem(item, len);
				!this.loaded && this.logging();
			}
		}
	},

	logging : function(){
		this.loaded = true;
		window.fashionImpressionTracking && fashionImpressionTracking('scroll_relative_products', null, this.trackingViewOffsetTop);
	}
};
