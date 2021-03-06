const Preload = (() => {
    let observer = null;
    let timer;

    const throttleTime = 200;
    const store = [];
    const isIntersection = 'IntersectionObserver' in window;
    const y = window.scrollY;

    return class {
        constructor(config = {}, images){
            if(!images.length) throw new Error('There are no images!');

            this._config = config;
            this._images = images;

            isIntersection ? this.observer() : this.establish();
        }

        /**
         * @desc 옵저버에 이미지 등록
         */
        observer(){
            observer = new IntersectionObserver(this.intersection.bind(this), this._config);
            this._images.forEach(image => observer.observe(image));
        }

        /**
         * @desc 이미지가 intersecting 일 경우 preload 실행
         * @param entries
         */
        intersection(entries){
            entries.forEach(v => {
                if(!v.isIntersecting) return;

                const { target } = v;

                this.preload(target);
                observer.unobserve(target);
            });
        }

        /**
         * @desc IntersectionObserver 를 지원하지 않을 경우 스토어 초기화
         */
        establish(){
            let len = this._images.length;

            while(len--) store.push(this._images[len]);

            if(!y) this.processing();

            this.registerEvent();
        }

        /**
         * @desc 이미지 preload
         * @param target
         * @param index
         */
        preload(target, index){
            this.repainting(target);

            if(!isIntersection){
                this.destroyStore(index);
            }
        }

        /**
         * @desc re-painting images
         * @param target
         */
        repainting(target){
            const { preload } = target.dataset;

            if(target.tagName.toLowerCase() === 'img') target.src = preload;
            else target.style.background.replace(/url\([?.*]\)/i, preload);
        }

        /**
         * @desc 스크롤 이벤트 쓰로틀링
         * @param target
         * @param index
         */
        throttling(target, index){
            if(!timer){
                timer = setTimeout(_ => {
                    timer = null;
                    this.processing(target, index);

                }, throttleTime);
            }
        }

        /**
         * @desc 스토어에 저장되어 있는 이미지 preload
         */
        processing(){
            let len = store.length;

            while(len--) if(this.getHeight(store[len]) === true) this.preload(store[len], len);
        }

        /**
         * @desc 각 이미지의 화면 위치 제공
         * @param image
         * @returns {boolean|number}
         */
        getHeight(image){
            const rect = image.getBoundingClientRect();

            return (rect && rect.top) <= window.innerHeight || document.documentElement.clientHeight;
        }

        /**
         * @desc 스크롤 이벤트 등록
         */
        registerEvent(){
            window.addEventListener('scroll', this.throttling.bind(this), false);
        }

        /**
         * @desc 스크롤 이벤트 제거
         */
        destroyEvent(){
            window.removeEventListener('scroll', this.throttling.bind(this), false);
        }

        /**
         * @desc 스토어 갱신
         * @param image
         * @param index
         */
        destroyStore(index){
            if(!store.length) this.destroyEvent();
            else{
                store.splice(index, 1);
                this.destroyEvent();
            }
        }
    };
})();

export default Preload;
