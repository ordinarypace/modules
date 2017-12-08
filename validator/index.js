import Common from '@/common';
import preset from './preset';

/**
 * @author jeongsik.jang
 * @date 2017. 12. 7
 * @desc
 *
 * data-valid="preset | optional | ignore"
 * data-essential (data-type : optional)
 *
 * const validator = new Validator(document.querySelectorAll('[data-valid]'));
 * validator.run((response) => { ...statements });
 */
const Validator = (() => {
    const role = {
        valid: 'valid',
        invalid: 'invalid',
        required: 'required',
        optional: 'optional'
    };
    const command = {
        add: 'add',
        remove: 'remove'
    };

    const exception = ['ignore'];
    const className = 'invalid-message';

    return class validator {
        static traverseNode(item){
            let node = item;

            while(node){
                if(node.nodeType === 1 && node.classList.contains(className)) return node;

                node = node.nextSibling;
            }
        }

        constructor({ collection, target }){
            this._error = 0;
            this._collection = Common.array.assign(collection);
            this._required = this._collection.filter(v => v.dataset.valid !== role.optional);
            this._optional = this._collection.filter(v => v.dataset.valid === role.optional);
            this._response = new Map();
            this._cb = null;
            this._target = target;
            this._loaded = false;
        }

        get response(){
            return this._response;
        }

        set response(item){
            this._response.set(item.id, {
                target: item,
                value: item.value,
                option: item.checked || item.selected,
                preset: preset[item.dataset.valid]
            });
        }

        run(cb){
            this._cb = cb;
            this._error = 0;
            this.all();
        }

        all(){
            this.process(this._collection);
        }

        required(){
            this.process(this._required);
        }

        optional(){
            for(const [k, v] of this._optional.entries()){
                v.checked = !v.checked;

                this.validation(v);
            }
        }

        watch(v){
            ['keyup', 'change', 'focusin'].forEach(e => v.addEventListener(e, () => this.validation(v), false));
        }

        process(iterator){
            this.proceeding(true);

            for(const [k, v] of iterator.entries()){
                if(this.ignore(v)) continue;
                else {
                    if(!this._loaded) this.watch(v);
                }

                this.validation(v);
            }

            this._loaded = true;

            if(!this._error){
                this.proceeding(false);
                this._cb.call(this, this.response)
            }
        }

        proceeding(boolean){
            this._target.disabled = boolean;
        }

        validation(v){
            if(v.dataset.valid === role.optional) this.aggregate(v);
            else this.primitive(v);
        }

        primitive(item){
            if(!this.isValue(item)) this.valid({ item, type: role.required });
            else {
                if(!preset[item.dataset.valid].rule.test(item.value.trim())) this.valid({ item, type: role.invalid });
                else {
                    this.valid({
                        item,
                        type: role.valid,
                        action: command.remove,
                        isError: 0
                    });
                }
            }
        }

        aggregate(item){
            if(item.dataset.essential === 'true'){
                if(item.checked || item.selected){
                    this.valid({
                        item,
                        type: role.valid,
                        action: command.remove,
                        isError: 0
                    });
                } else this.valid({ item, type: role.invalid });
            } else this.response = item;
        }

        valid({
                  item,
                  type = role.required,
                  action = command.add,
                  isError = 1
        }){
            const node = validator.traverseNode(item);

            this.error(isError);

            if(this._loaded){
                this.style([item, node], action);

                if(isError > 0) node.textContent = preset[item.dataset.valid][type];
                else{
                    node.textContent = '';
                    this.response = item;
                }
            }
        }

        isValue(item){
            return Common.string.isEmpty(item.value);
        }

        style(items, command){
            items.forEach(v => v.classList[command](role.invalid));
        }

        ignore(item){
            this.response = item;

            return exception.includes(item.dataset.valid);
        }

        error(count){
            this._error += count;
        }

        [command.add](k, v){
            preset[k] = v;

            return this;
        }

        [command.remove](k){
            if(Object.hasOwnProperty.call(preset, k)) delete preset[k];
        }
    };
})();


export default Validator;
