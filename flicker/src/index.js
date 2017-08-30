/**
 * @author Jang Jeong Sik
 * @date 2017.08.19
 */

/**
 * @description import CSS & poly-fills
 */
import './assets/scss/swipe.scss';
import 'babel-polyfill';
import 'whatwg-fetch';

/**
 * @description 상태 관리 클래스
 * @type {ViewState}
 */
const ViewState = class {
    static setState(key, cls){
        const v = new cls();

        if(!(v instanceof ViewState)){
            throw 'invalid class!';
        }

        if((ViewState._subClass || (ViewState._subClass = new Map())).has(key)){
            throw 'exist key!';
        }

        ViewState._subClass.set(key, cls);
    }

    static getState(key){
        return new (ViewState._subClass.get(key));
    }

    stateList(){
        return Array.from(ViewState._subClass.keys());
    }

    // VO 캡슐화
    get url(){
        throw 'must be overrides!';
    }
};

/**
 * @description 상태에 따른 모델을 제공
 * @type {Model}
 */
const Model = class {
    _updateModel(type){
        return fetch(type.url, { method : 'GET' }).then(response => {
            if(!response.ok){
                throw new Error('Could not get query String?');
            }

            return response.json();
        });
    }

    _updateType(message){
        return this._updateModel(ViewState.getState(message.type));
    }
};

/**
 * @description 상태 리스너 클래스
 * @type {Listener}
 */
const Listener = class {
    listen(message){
        throw 'must be overrides!';
    }
};

/**
 * @description 상태를 추가, 삭제, 알려주며 모델의 정보를 캐싱하여 View 클래스에 제공
                Observer pattern (cold observerble)
 * @type {ViewModel}
 */
const ViewModel = class extends Listener{
    constructor(){
        super();
        this._model = new Model();
        this._listener = new Set();
        this._cache = new Map();
    }

    _memoization(message){
        if(this._cache.has(message.type)){
            return this._cache.get(message.type);

        } else {
            this._cache.set(message.type, this._model._updateType(message));
        }

        return this._cache.get(message.type);
    }

    _notify(){
        this._listener.forEach(v => {
            v.listen();
        });
    }

    addListener(listener){
        this._listener.add(listener);
    }

    removeListener(listener){
        this._listener.delete(listener);
    }

    listen(message){
        this._notify(message);
    }

    updateType(message){
        return this._memoization(message);
    }
};

/**
 * @description 디바이스의 환경을 체크하여 View Renderer 클래스를 호출
                + 이부분에 대한 상태 체크 부분을 따로 빼거나 renderer 클래스로 inject 했으면 어땠을까?
 * @type {View}
 */
const View = class extends ViewModel{
    constructor(parent, options = {}){
        super();

        this._timer = null;
        this._responsive = 768;
        this._message = {};
        this._loaded = false;
        this._parent = document.querySelector(parent);
        this._container = this._parent.querySelector('.panel-list');
        this._viewRenderer = null;
        this._options = options;

        this.addListener(this);
        this._init();
    }
    _init(){
        if(!this._container){
            throw 'Be must have container element!';
        }
        this._bindEvent();
    }

    _bindEvent(){
        if(this._timer){
            clearTimeout(this._timer);
        }

        this._timer = setTimeout(() => window.addEventListener('resize', this._resize.bind(this), false), 0);
        window.addEventListener('load', this._resize.bind(this), false);
    }

    _resize(){
        const size = window.innerWidth;

        this._message = size <= this._responsive ? { type : 'mobile' } : { type : 'desktop' };
        this._notify(this._message);

    }

    _render(promise){
        promise.then(data => {
            if(!this._loaded){
                this._viewRenderer = new ViewRenderer(data, this);
                this._loaded = true;

            } else {
                this._viewRenderer.resize(data);
            }
        }).catch(e => console.log(e));
    }

    listen(){
        this._render(this.updateType(this._message));
    }
};

/**
 * @description 실제로 플리킹 되는 엘리먼트 생성 및 동작 제어
 * @type {ViewRenderer}
 * @inject {View}
 */
const ViewRenderer = class {
    constructor(data, view){
        this._view = view;
        this._parent = this._view._parent;
        this._container = this._view._container;
        this._message = this._view._message;

        this._timer = null;
        this._loaded = false;
        this._css = this.getCss();

        this._events = {
            touchstart : 'touchStart',
            touchmove : 'touchMove',
            touchend : 'touchEnd'
        };

        this._panel = {
            list : [],
            width : [],
            height : 0,
            index : 0,
            count : 0,
            deltaX : 0,
            startX : 0,
            edge : 40,
            dist : 0,
            range : 50,
            duration : 10
        };
        // cssText로 대체를 했어야 함
        this._indicator = {
            list : []
        };

        const { autoPlay, infinity } = this._view._options;

        this._option = {
            speed : 300,
            autoPlaySpeed : 3000,
            autoPlay : autoPlay,
            infinity : infinity
        };

        this._dom = {
            indicator : this._parent.querySelector('.indicator-list'),
            btnPrev : this._parent.querySelector('.button-prev'),
            btnNext : this._parent.querySelector('.button-next')
        };

        this._class = {
            panel : 'panel-item',
            indicator : 'indicator-item'
        };

        this.render(data);
    }

    resize(data){
        this.destroy();
        this.setElement(data);
        this.setContainer();
        this.setPanel();
        this.updatePosition();
        this.setIndicator();
        this.setIndicatorInit();
    }

    render(data){
        this.setElement(data);
        this.setContainer();
        this.setPanel();
        this.updateCount();
        this.setIndicator();
        this.setIndicatorInit();
        this.bindEvent();

        if(this._option.autoPlay){
            this.autoPlay();
        }

        if(this._option.infinity){
            this.setInfinitePanel()
        }
    }
    // 이미 생성되어 있는 dom 엘리먼트 이벤트 바인딩
    bindEvent(){
        for(let key in this._events){
            this._container.addEventListener(key, this[this._events[key]].bind(this), false);
        }

        this._dom.btnPrev.addEventListener('click', this.prev.bind(this), false);
        this._dom.btnNext.addEventListener('click', this.next.bind(this), false);
    }

    touchStart(e){
        this._panel.startX =  e.type === 'touchstart' ? e.touches[0].pageX : e.pageX;
    }

    touchMove(e){
        this._panel.deltaX = (e.type === 'touchmove' ? e.touches[0].pageX : e.pageX) - this._panel.startX;
        this.move(this._panel.deltaX - this.getX(this._panel.index));

        e.preventDefault();
    }

    touchEnd(e){
        if(Math.abs(this._panel.deltaX) > this._panel.edge){
            this._panel.deltaX < 0 ? this.next() : this.prev();

        } else {
            this.moveEnd({
                event : e,
                index : this._panel.index
            });
        }
    }

    autoPlay(){
        this._timer = setInterval(this.next.bind(this), this._option.autoPlaySpeed);
    }

    next(e){
        this.disableEvent(e);

        if(this._panel.index >= this._panel.list.length - 1){
            this.moveEnd({
                event : e,
                index : 0
            });
        } else {
            this.moveHandler({
                event : e,
                index : this._panel.index + 1,
                direction : -1,
                type : 'next'
            });
        }
    }

    prev(e){
        this.disableEvent(e);

        if(this._panel.index <= 0){
            this.moveEnd({
                event : e,
                index : this._panel.list.length - 1
            });
        } else {
            this.moveHandler({
                event : e,
                index : this._panel.index - 1,
                direction : 1,
                type : 'prev'
            });
        }
    }

    move(dist){
        this._container.style[this._css.transition] = 'none';
        this._container.style[this._css.transform] = `translate3d(${dist}px, 0, 0)`;
    }

    moveHandler({ event, index, direction, type }){
        if(event && this._option.autoPlay){
            clearInterval(this._timer);
        }

        if(this.updateCountCheck()){
            this._panel.count = this._panel.list.length;
            this._panel.index = 0;
            index = 1;

            this.clearPosition();
        }

        this.moveEnd({
            event,
            index : index,
            direction,
            type
        });
    }

    moveEnd({ event, index, direction, type }){
        if(this.compareIndex(index)){
            return;
        }

        if(this._css){
            this.animate({
                dist : (-1 * this.getX(index)),
                index
            });
        } else {
            this.animateNotSupportTransition({ index, direction, type });
        }

        this.updateIndicator({ event, index });
    }

    animate({ dist }){
        this._container.style[this._css.transition] = `all ${this._option.speed}ms ease`;
        this._container.style[this._css.transform] = `translate3d(${dist}px, 0, 0)`;
    }

    animateNotSupportTransition({ index, direction }){
        const frame = () => {
            if(!direction){
                direction = this._panel.width * index  > Math.abs(this._panel.dist) ? -1 : 1;
            }
            this._panel.dist += this._panel.range * direction;

            let positive = this.getX(index);
            let compare = Math.abs(this._panel.dist);

            if(positive - compare === 0){
                clearInterval(timer);
            }

            this._container.style.left = `${this._panel.dist}px`;
        };

        let timer = setInterval(frame, this._panel.duration);
    }

    getX(index){
        return this._panel.list[index].offsetLeft;
    }

    updatePosition(){
        this.move(-1 * this._panel.index * this._panel.width);
        this.updateIndicator(this._panel.index);
    }

    updateIndicator({ event, index }){
        if(index === undefined || index === null){
            return;
        }

        this._indicator.list[index].setAttribute('class', `${this._class.indicator} active`);
        this._indicator.list[this._panel.index].setAttribute('class', this._class.indicator);

        this._panel.index = index;
        this.disableEvent(event);
    }

    updateCount(){
        this._panel.count = this._panel.list.length;
    }

    updateCountCheck(){
        return this._panel.count !== this._panel.list.length;
    }

    setContainer(){
        this._panel.list = Array.from(this._container.children);
        this._panel.width = this._parent.getBoundingClientRect().width;
        this._container.style.cssText = `width:${this._panel.list.length * this._panel.width}px;box-sizing:border-box;touch-action:pan-y;-webkit-user-drag:none`;
    }

    setPanel(){
        if(this._panel.list.length < 2){
            this._parent.setAttribute('class', 'panel-container none-flick');
            return;
        }
        for(const [i, v] of this._panel.list.entries()){
            v.style.left = `${this._panel.width * i}px`;
            v.style.width = `${this._panel.width}px`;
        }
    }

    setElement(data){
        const template;
        this._container.innerHTML = '';

        for(const [i, v] of data.entries()){
            template += `<li class="${this._class.panel}" data-index="${i}"><a href="${v.link}" target="_blank"><img src="${v.image}" alt="banner-name"></a></li>`;
        }

        this._container.innerHTML = template;
    }

    setIndicator(){
        const template;
        this._dom.indicator.innerHTML = '';

        for(let i = 0; i < this._panel.list.length; i += 1){
            template += `<li class="${this._class.indicator}"><button type="button">${i}</button></li>`;
        }
        // reflow를 줄이기 위해 cssText property로 작업했어야 함.
        this._dom.indicator.innerHTML = template;
        this._dom.indicator.style.cssText = 'position:absolute;bottom:20px;left:0;width:100%;text-align:center';
    }

    setIndicatorInit(){
        this._indicator.list = Array.from(this._dom.indicator.children);

        for(const [i, v] of this._indicator.list.entries()){
            v.addEventListener('click', e => this.moveEnd({ event : e, index : i, direction : null, type : 'indicator' }), false);
        }

        if(!this._loaded || this.updateCountCheck()){
            this._indicator.list[this._panel.index].setAttribute('class', `${this._class.indicator} active`);
            this._loaded = true;
        }
    }

    //TODO infinity flicking 구현부, 클론 후 포지션 체인지를 통해 구현?
    setInfinitePanel(){

    }

    getCss(){
        const element = document.createElement('div');

        let transition = ['transition', 'mozTransition', 'msTransition', 'oTransition', 'webkitTransition'];
        let transform = ['transform', 'mozTransform', 'msTransform', 'oTransform', 'webkitTransform'];

        for(let i = 0; i < transition.length; i += 1){
            if(transition[i] in element.style){
                return {
                    transform : transform[i],
                    transition : transition[i]
                }
            }
        }
    }

    clearPosition(){
        this._container.style[this._css.transform] = 'translate3d(0, 0, 0)';
    }

    compareIndex(index){
        return this._panel.index === index;
    }

    disableEvent(e){
        if(!e || !e.currentTarget || !e.currentTarget.disabled){
            return;
        }
        const target = e.currentTarget;

        target.disabled = !target.disabled;
    }

    destroy(){
        this._timer = null;
        this._loaded = false;
        this._css = this.getCss();
    }
};

/**
 * @description 상태 등록
 */
ViewState.setState('mobile', class extends ViewState{
    get url(){
        return '/banners?device=mobile&count=4';
    }
});

ViewState.setState('desktop', class extends ViewState{
    get url(){
        return '/banners?device=desktop&count=4';
    }
});

new View('.panel-container', { autoPlay : false, infinity : false });
