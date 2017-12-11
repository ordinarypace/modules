# use
##### mark-up
```bash
<input type="checkbox" id="" class="" data-valid="optional">
<label for="" class="">
    <i class="ico"></i>
    <span class="description"></span>
</label>
```

##### script
```bash
this.validator = new validator({
    collection: document.querySelectorAll('[data-valid]'),
    target: document.querySelector('.poing-signup__complete'),
    compare: ['password', 'password2']
});

this.validator.run();
```
