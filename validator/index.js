import Common from '@/common';
import preset from './preset';

const Validator = (() => {
    const validateType = {
        valid: 'valid',
        invalid: 'invalid',
        required: 'required'
    };
    const validateCommand = {
        add: 'add',
        remove: 'remove'
    };
    const validateException = ['check', 'ignore'];
    const className = 'invalid-message';
    const response = new Map();

    return class {
        static optional(options){
            return Common.array.assign(options).some(v => (v.checked || v.selected));
        }

        static conditional(option){
            const { message } = option.dataset;

            if(!option.checked) console.log(message);
        }

        constructor(collection){
            this._collection = Common.array.assign(collection);
            this._error = 0;
        }

        get response(){
            return response;
        }

        set response(item){
            response.set(item.id, {
                target: item,
                value: item.value
            });
        }

        [validateCommand.add](k, v){
            preset[k] = v;

            return this;
        }

        [validateCommand.remove](k){
            if(Object.hasOwnProperty.call(preset, k)) delete preset[k];
        }

        run(){
            for(const [k, v] of this._collection.entries()){
                if(this.ignore(v)){
                    continue;
                }

                this.primitive(v);
            }

            return !this._error;
        }

        primitive(item){
            if(!this.required(item)) this.valid({ item, type: validateType.required });
            else {
                if(!preset[item.dataset.valid].rule.test(item.value.trim())) this.valid({ item, type: validateType.invalid });
                else {
                    this.valid({
                        item,
                        type: validateType.valid,
                        command: validateCommand.remove,
                        isError: -1
                    });
                }
            }
        }

        required(item){
            return Common.string.isEmpty(item.value);
        }

        valid({
                  item,
                  type = validateType.required,
                  command = validateCommand.add,
                  isError = 1
        }){
            const node = this.traverseNode(item);

            this.error(isError);
            this.style([item, node], command);

            if(isError > 0) node.textContent = preset[item.dataset.valid][type];
            else{
                node.textContent = '';
                this.response = item;
            }
        }

        traverseNode(item){
            let node = item;

            while(node){
                if(node.nodeType === 1 && node.classList.contains(className)) return node;

                node = node.nextSibling;
            }
        }

        style(items, command){
            items.forEach(v => v.classList[command](validateType.invalid));
        }

        ignore(item){
            return validateException.includes(item.dataset.valid);
        }

        error(count){
            this._error += count;
        }   
    };
})();


export default Validator;