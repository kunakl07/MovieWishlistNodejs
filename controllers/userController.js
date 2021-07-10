const crypto = require("crypto");   

exports.loginPage = function (req, res) {
    res.render("pages/login", {
        title: "Login | Movie Wishlist"
    });
};

exports.handleLogin = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // Validate inputs if possible
    if(username == "" || password == "" || username == undefined || password == undefined) {
        res.render("pages/login", {
            message: "Email and Password both fields are required"
        });
        return;
    }
    // Create hash of passworrd
    const md5 = crypto.createHash("md5");
    const passwordHash = md5.update(password).digest("hex");

    // Check for entry with same username and password hash
    var connection = req.app.get("db");
    connection.query(
        "SELECT * FROM users WHERE user_name = ? AND user_password = ?",
        [username, passwordHash],
        function(err, result) {
            if (err || result && result.length <= 0) {
                res.render("pages/login", {
                    message: "Invalid Email/Password",
                });
                return;
            }

            req.session.userId = result[0].user_id;
            req.session.userName = result[0].user_name;
            req.session.save();
            res.redirect("/");
        }
    );    

};

exports.registerPage = function (req, res) {
    res.render("pages/register", {
        "title": "Register | Movie Wishlist"
    });
};

exports.handleRegister = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // Validate inputs if possible
    if(username == "" || password == "" || username == undefined || password == undefined) {
        res.render("pages/register", {
            message: "Email and Password both fields are required"
        });
        return;
    }
    // Create hash of password
    const md5 = crypto.createHash("md5");
    const passwordHash = md5.update(password).digest("hex");

    // save to db
    var connection = req.app.get("db");

    connection.query ("SELECT * FROM users WHERE user_name = ?", [username], function(err, result) {
        if(result && result.length > 0) {
            res.render("pages/register", {
                message: "Username already exists"
            });
            return;
        }
        connection.query(
            "INSERT INTO users(user_name, user_password) VALUES (?, ?)",
            [username, passwordHash],
            function(_, result) {
                if(result.insertId > 0) {
                    res.redirect("/login");
                }
            }
        );
    });
};

exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect("/login");
}