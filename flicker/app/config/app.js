import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import validator from 'express-validator';

export default (app, config) => {
    app.use(express.static('public'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    config.env === 'production' ? app.use(compress()) : app.use(logger('dev'));
    app.use(validator());
    app.use(methodOverride());
};
