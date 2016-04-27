'use strict';

var DeferredLoad = function(){
    this.init();
};

DeferredLoad.prototype = {
    stack : [],

    init : function(){
        this.cacheElement();
        this.initStore();
        this.lazyItems !== undefined && this.bindEvent();
    },

    initStore : function(){
        // >>> operator is length of array to increment 1
        var len = this.lazyItems.length >>> 0;

        for(; len--; this.stack[len] = this.lazyItems[len]);
    },

    cacheElement : function(){
        this.lazyItems = document.querySelectorAll('img[data-lazy]');
    },

    bindEvent : function(){
        document.addEventListener('DOMContentLoaded', this.loadItems.bind(this), false);
        window.addEventListener('scroll', this.loadItems.bind(this), false);
    },

    unbindEvent : function(){
        this.stack.length === 0 && window.removeEventListener('scroll', this.loadItems, false);
    },

    getBoundingClientProperty : function(item){
        if(item === undefined){
            return;
        }

        var rect = item.getBoundingClientRect();
        return (rect.top >= 0 && rect.top) <= window.innerHeight || document.documentElement.clientHeight;
    },

    replaceOriginalItem : function(item, index){
        item.src = item.getAttribute('data-lazy');

        this.removeItems(item, index);
    },

    removeItems : function(item, index){
        this.stack.indexOf(item) !== -1 && this.stack.splice(index, 1) && this.unbindEvent();
    },

    loadItems : function(){
        var len = this.stack.length;

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