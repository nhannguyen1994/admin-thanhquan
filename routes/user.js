const { db, } = require('../pgp');
const User = require('../models/user.js');

const user = new User(db);

module.exports = function (express) {
    const router = express.Router();

    // display list of users
    router.get('/', (req, res) => {
        user.selectAllUser()
            .then(data => {
                //console.log(data);
                res.render('quan-ly-user.html', {
                    users: data
                });
            })
    });


    return router;
}