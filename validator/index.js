import Common from '@/common';
import preset from './preset';

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

        static migration(response){
            const data = {
                'login_email': response.get('login_email').value,
                'web_name': response.get('web_name').value,
                'password': response.get('password').value,
                'gender': '',
                'birthday': '',
                'fb_id': '',
                'fb_profile_url': '',
                'fb_friends': ''
            };

            return data;
        }

        constructor({ collection, target, compare }){
            this._error = 0;
            this._collection = Common.array.assign(collection);
            this._required = this._collection.filter(v => v.dataset.valid !== role.optional);
            this._optional = this._collection.filter(v => v.dataset.valid === role.optional);
            this._response = new Map();
            this._cb = null;
            this._target = target;
            this._compare = compare;
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

        process(iterator){
            for(const [k, v] of iterator.entries()){
                if(this.ignore(v)) continue;
                else if(!this._loaded) this.watch(v);

                this.validation(v);
            }

            this._loaded = true;

            if(!this._error) this._cb.call(this, this.response);
        }

        watch(v){
            ['keyup', 'change', 'focusin'].forEach(e => v.addEventListener(e, () => this.validation(v), false));
        }

        validation(v){
            if(v.dataset.valid === role.optional) this.aggregate(v);
            else this.primitive(v);
        }

        primitive(item){
            if(!this.isValue(item)) this.valid({ item, type: role.required });
            else !preset[item.dataset.valid].rule.test(item.value.trim()) ? this.valid({ item }) : this.valid({ item, isError: 0 });
        }

        aggregate(item){
            if(item.dataset.essential === 'true') item.checked || item.selected ? this.valid({ item, isError: 0 }) : this.valid({ item });
            else this.response = item;
        }

        valid({ item, type = role.invalid, isError = 1 }){
            const node = validator.traverseNode(item);

            this.error(isError);

            if(this._loaded){
                if(isError > 0) this.fail({ item, node, type });
                else {
                    if(this._compare.length && item.dataset.valid === this._compare[1]) this.compare(item) ? this.success({ item, node, type: role.valid }) : this.fail({ item, node });
                    else this.success({ item, node, type: role.valid });
                }
            }
        }

        fail({
                 item,
                 node,
                 type = role.invalid,
                 action = command.add
        }){
            node.textContent = preset[item.dataset.valid][type];
            this.style([item, node], type, action);
        }

        success({
                    item,
                    node,
                    type = role.valid,
                    action = command.add
        }){
            if(node.classList.contains(role.invalid)) this.style([item, node], role.invalid, command.remove);

            node.textContent = '';
            this.style([item, node], type, action);
            this.response = item;
        }

        isValue(item){
            return Common.string.isEmpty(item.value);
        }

        compare(v){
            return this.response.get(this._compare[0]).value === v.value;
        }

        proceeding(boolean){
            this._target.disabled = boolean;
        }

        style(items, type, action){
            items.forEach(v => v.classList[action]((type === role.required) ? role.invalid : type));
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
