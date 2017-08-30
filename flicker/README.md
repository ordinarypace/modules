# Use

##### install dependencies & dev dependencies
```bash
$npm install
```

##### build server-side scripts & transpile client-side scripts to ES2015
```bash
$npm run build
```

##### open local server (port:3000) & watch client-side scripts by webpack
```bash
$npm run start
```

##### build production
```bash
$npm run production
```

##### clean build folder & bundle script
```bash
$npm run clean
```

##### windows, osx 설정
```
window
"scripts": {
    "clean": "rm -rf build ./public/js",
    "build": "babel app --out-dir build && webpack --progress --color --config ./config/webpack.config.js",
    "start": "set:NODE_ENV=development && node ./build/index.js",
    "production": ":setNODE_ENV=production && node ./build/index.js"
}

osx
"scripts": {
    "clean": "rm -rf build ./public/js",
    "build": "babel app --out-dir build && webpack --progress --color --config ./config/webpack.config.js",
    "start": "NODE_ENV=development && node ./build/index.js",
    "production": "NODE_ENV=production && node ./build/index.js"
}
```
