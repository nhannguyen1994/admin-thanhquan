const { db, } = require('../pgp');
const Product = require('../models/product.js');

const product = new Product(db);

module.exports = function (express) {
    const router = express.Router();

    router.get('/doanh-so', (req, res) => {
        db.task(t => {
            return t.batch([
                product.selectBestSales(),
                product.countSalesByManufacturer()
            ]);
        }).then(data => {
            // handle best-selling products
            let barData = data[0].map(obj => {
                let returnArr = [];
                returnArr[0] = obj.product_name;
                returnArr[1] = obj.sales_volume;
                return returnArr;
            });
            //console.log(barData);

            // handle sales by manufacturer            
            let total = 0;
            data[1].forEach(each => {
                total += parseInt(each.sum);
            });
            let donutData = data[1].map(obj => {
                let returnObj = {};
                if (obj.manufacturer_id == "") {
                    returnObj.label = "Other"
                } else {
                    returnObj.label = obj.manufacturer_id;
                }
                returnObj.data = parseInt(obj.sum) / total * 100;
                return returnObj;
            });
            //console.log(donutData);
            res.render('flot-doanh-so.html', { barData: barData, donutData: donutData });
        });
    });

    router.get('/hang-ton-kho', (req, res) => {
        db.task(t => {
            return t.batch([
                product.selectMostInStock(),
                product.selectOldestStock()
            ]);
        }).then(data => {
            let barData = data[0].map(obj => {
                let returnArr = [];
                returnArr[0] = obj.product_name;
                returnArr[1] = obj.quantity;
                return returnArr;
            });

            res.render('flot-hang-ton-kho.html', { barData: barData, products: data[1] });
        })
    });

    return router;
}
