exports.checkAuth = function(req, res, next) {
    if (!req.session || !req.session.userId || (req.session && req.session.userId <= 0)) {
        res.redirect('/login');
        return;
    }
    next();
};

exports.chechSessionExists = function(req, res, next) {
    if(req.session && req.session.userId) {
        res.redirect("/");
        return;
    }
    next();
}