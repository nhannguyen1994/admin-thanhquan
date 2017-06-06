const { db, } = require('../pgp');
const Product = require('../models/product.js');
const PriceConverter = require('../models/priceConvert');

const product = new Product(db);

module.exports = function (express) {
    const router = express.Router();

    // display table of product types and their amounts
    router.get('/loai-san-pham', (req, res) => {
        product.countProductType()
            .then(data => {
                res.render('loai-san-pham.html', {
                    productType: data
                });

            })
    });

    router.get('/hang-san-xuat', (req, res) => {
        product.countManufacturer()
            .then(data => {
                res.render('hang-san-xuat.html', {
                    manufacturers : data
                });
            });
    });

    router.get('/', (req, res) => {

        let q = req.query.page;
        let n = 9;
        let pgfrom = 0;
        if (q != undefined && q > 0) {
            pgfrom = (pgfrom + q - 1) * n;
        } else {
            q = 1;
        }
        //
        let price = req.query.gia;
        let order = req.query.order;
        //
        db.task(t => {
            if (price !== undefined) {
                let productData = product.selectByPriceRange2(price, n, pgfrom);
                return t.batch([
                    productData[0],
                    productData[1],
                    q,
                    '?gia=' + price
                ]);
            } else if (order !== undefined) {
                let productData = product.selectByOrder(order, n, pgfrom);
                return t.batch([
                    productData[0],
                    productData[1],
                    q,
                    '?order=' + order
                ]);
            } else {
                return t.batch([
                    product.selectByPagination(n, pgfrom),
                    product.countAll(),
                    q,
                ]);
            }
        })
            .then(data => {
                let countAll = page = 0;
                data[1].forEach((index) => {
                    countAll = index.count;
                    page = Math.ceil(index.count / n, 0);
                });
                if (q > page) {
                    q = 1;
                }
                // reformat price
                data[0].forEach(eachProduct => {
                    eachProduct.price = PriceConverter(eachProduct.price);
                });
                //
                res.render('san-pham.html', {
                    pageTitle: 'Điện thoại',
                    products: data[0],
                    countAll: data[1],
                    allpage: page,
                    pageCurrent: q,
                    pageQuery: data[3]
                });
            })
            .catch(error => {
                res.json({
                    success: false,
                    error: error.message || error
                });
            });
    });

    router.post('/search', (req, res) => {
        product.findByName(req.body.search)
            .then(data => {
                // reformat price
                data.forEach(eachProduct => {
                    eachProduct.price = PriceConverter(eachProduct.price);
                });
                //
                res.render('san-pham.html', {
                    pageTitle: 'Tìm Kiếm',
                    products: data
                });
            })
    });

    return router;
};