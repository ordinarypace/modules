const Preload = (() => {
    let observer = null;

    const store = [];
    const isIntersection = ('IntersectionObserver' in window);
    const y = window.scrollY;

    // TODO: background 이미지 지원 여부 및 쓰로틀링 지원
    return class {
        constructor(config){
            this._config = config;
            this._images = document.querySelectorAll('[data-preload]');

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

            y === 0 ? this.processing() : this.registerEvent();
        }

        /**
         * @desc 이미지 preload
         * @param target
         * @param index
         */
        preload(target, index){
            const { preload } = target.dataset;

            target.src = preload;

            if(!isIntersection){
                this.destroyStore(target, index);
            }
        }

        /**
         * @desc 스토어에 저장되어 있는 이미지 preload
         */
        processing(){
            let image;
            let len = store.length - 1;

            this.destroyEvent();

            while(image = store[len--]){
                if(this.getHeight(image)) this.preload(image, len);
            }
        }

        /**
         * @desc 각 이미지의 화면 위치 제공
         * @param image
         * @returns {boolean|number}
         */
        getHeight(image){
            const rect = image.getBoundingClientRect();

            return (rect && rect.top >= 0) <= window.innerHeight || document.documentElement.clientHeight;
        }

        /**
         * @desc 스크롤 이벤트 등록
         */
        registerEvent(){
            window.addEventListener('scroll', this.processing.bind(this), false);
        }

        /**
         * @desc 스크롤 이벤트 제거
         */
        destroyEvent(){
            window.removeEventListener('scroll', this.processing.bind(this), false);
        }

        /**
         * @desc 스토어 갱신
         * @param image
         * @param index
         */
        destroyStore(image, index){
            if(store.includes(image)){
                store.splice(index, 1);
                this.destroyEvent();
            }
        }
    };
})();

export default Preload;
