import { fetch } from '../controllers/banners.controller';

export default (router) => {
    router.get('/banners', fetch);
}
