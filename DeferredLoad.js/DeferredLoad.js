'use strict';

var DeferredLoad = function(){
    this.init();
};

DeferredLoad.version = 0.2;
DeferredLoad.prototype = {
    stack : [],
    load : null,

    init : function(){
        this.cacheElement();
        this.initStore();
        this.deferredItems !== undefined && this.bindEvent();
    },

    initStore : function(){
        // >>> operator is length of array to increment 1
        var len = this.deferredItems.length >>> 0;

        for(; len--; this.stack[len] = this.deferredItems[len]);
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
        return (rect.top >= 0 && rect.top) <= window.innerHeight || document.documentElement.clientHeight;
    },

    replaceOriginalItem : function(item, index){
        var deferred = item.getAttribute('data-deferred');

        if(item.src && item.tagName === 'IMG'){
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
                this.logging(item);
                this.replaceOriginalItem(item, len);
            }
        }
    },

    logging : function(item){
        //google analytics log statement...
    }
};
