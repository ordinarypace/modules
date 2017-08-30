export const fetch = (req, res) => {
    if(!req.query.device) res.send('Query String Error');

    // ... apis

    // const device = req.query.device;
    // const count = parseInt(req.query.count);
    // const result =  device === 'mobile' ? bannersMobileData.slice(0, count) : bannersDesktopData.slice(0, count);

    // res.json(result);
};
