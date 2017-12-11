# use
##### mark-up
```bash
<input type="checkbox" id="" class="" data-valid="">
<label for="" class="">
    <i class="ico"></i>
    <span class="description"></span>
</label>
```

##### types data-valid
```bash
data-valid : name / email / password / year / month / day ... 
```

##### script / standard
```bash
this.validator = new validator({
    collection: document.querySelectorAll('[data-valid]'),
    target: document.querySelector('.poing-signup__complete'),
    compare: ['password', 'password2']
});

this.validator.run();
```

##### script / optional
```bash
this.validator.optional();
```
