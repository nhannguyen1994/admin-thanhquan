module.exports = (app, express) => {

    app.get('/', (req, res) => {
        res.render('index.html');
    });
    // ======================================
    // USER MANAGEMENT =====================
    // ======================================
    const user = require('./user')(express);
    app.use('/user', user);

    // ======================================
    // STATISTICS MANAGEMENT ================
    // ======================================
    const chart = require('./chart')(express);
    app.use('/thong-ke', chart);
    
    // ======================================
    // PRODUCT MANAGEMENT ===================
    // ======================================
    const product = require('./product')(express);
    app.use('/san-pham', product);

    // ======================================
    // ORDER MANAGEMENT =====================
    // ======================================
    const order = require('./order')(express);
    app.use('/don-hang', order);

    app.get('/tin-tuc', (req, res) => {
        res.render('tintuc.html');
    });
    app.get('/lien-he', (req, res) => {
        res.render('lienhe.html');
    });
};