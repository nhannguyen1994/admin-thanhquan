'use strict';
// const bcrypt = require('bcryptjs');

class User {
    constructor(db) {
        this.db = db;
    }
    selectAllUser () {
        return this.db.many("SELECT user_id, email, fullname, gender, address FROM user_account");
    }
    selectUser(email) {
        return this.db.oneOrNone("SELECT * FROM user_account WHERE email= $1", [email]);
    }
    selectUserById(user_id) {
        return this.db.oneOrNone("SELECT * FROM user_account WHERE user_id = $1", [user_id]);
    }
    addUser(email, hashPass, fullname, gender, address, agreement) {
        return this.db.one("INSERT INTO user_account(email, pass, fullname, gender, address, agreement) VALUES($1, $2, $3, $4, $5, $6) RETURNING user_id, email, fullname, gender, address", [email, hashPass, fullname, gender, address, agreement]);
    }
    // generateHash(password) {
    //     return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
    // }
    // validPassword(password, pass) {
    //     return bcrypt.compareSync(password, pass);
    // }
}

module.exports = User;