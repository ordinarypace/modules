# use
##### mark-up
```bash
<input type="checkbox" id="" class="" data-valid="">
<label for="" class="">
    <i class="ico"></i>
    <span class="description"></span>
</label>
<span class="invalid-message"></span>
```

##### types data-valid
```bash
data-valid : name / email / password / year / month / day ... 
```

##### ignore types
```bash
data-valid="ignore"
```

##### script / standard
```bash
const validator = new Validator({
    // mandantory
    collection: document.querySelectorAll('[data-valid]'),
    target: document.querySelector('.poing-signup__complete'),
    
    // optional
    compare: ['password', 'password2']
});

this.validator.run();
```

##### script / optional
```bash
this.validator.optional();
```

##### result
```bash
this.validator.run((response) => {
    // ...statements
});
```

##### use methods and return result
```bash
// run validator
validator.run()

// run optional validator
validator.optional()

// add preset rules
validator.add(key, value)

// remove preset rules
validator.remove(key)

// static methods / traverse invalid-message node
Validator.traverseNode(item)

// result type is Map
result.get(key).target
result.get(key).value
result.get(key).option
result.get(key).preset
```
