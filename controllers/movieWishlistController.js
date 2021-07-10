const axios = require("axios");

exports.viewWishlist = function (req, res) {
    const connection = req.app.get("db");
    connection.query("SELECT * FROM wishlists WHERE user_id = ?",
        [req.session.userId],
        function (err, result) {
            var movieData = [];
            if (err || result.length <= 0) {
                res.render("pages/index", {
                    title: "Wishlist | Movie Wishlist",
                    isLoggedIn: req.session.userId != 0,
                    message: "No Results Found"
                });
                return;
            }
            result.forEach(movie => {
                movieData.push({
                    imdbID: movie.imdb_id,
                    Title: movie.title,
                    Poster: movie.poster,
                    Year: movie.year
                });
            });

            res.render("pages/index", {
                title: "Wishlist | Movie Wishlist",
                isLoggedIn: req.session.userId != 0,
                movieData: movieData
            });
        });
}

exports.displayMovieSearch = function (req, res) {
    res.render("pages/search", {
        title: "Add Movie | Movie Wishlist",
        isLoggedIn: req.session.userId != 0,
    });
};

exports.searchMovie = function (req, res) {
    const search = req.body.q;
    const connection = req.app.get("db");
    connection.query(
        "SELECT imdb_id FROM wishlists WHERE user_id = ?",
        [req.session.userId],
        function (dbErr, dbResult) {
            axios.get(`http://www.omdbapi.com/?apikey=${process.env.apiKey}&s=${search}&page=1&type=movie`)
                .then(function (apiResponse) {
                    if (dbErr || dbResult.length <= 0) {
                        var movieData = apiResponse.data.Search;
                    } else {
                        var movieData = apiResponse.data.Search;
                        dbResult.forEach(function (dbRes) {
                            movieData = movieData.filter(function (elem) {
                                return elem.imdbID != dbRes.imdb_id
                            });
                        })
                    }
                    res.render("pages/search", {
                        movieData: movieData,
                        isLoggedIn: req.session.userId != 0,
                    });
                })
        }
    );
}

exports.addToWishlist = function (req, res) {
    const movieData = JSON.parse(req.body.movieData);
    const connection = req.app.get("db");
    connection.query("INSERT INTO wishlists(imdb_id, title, year, poster, user_id) VALUES (?, ?, ?, ?, ?)",
        [movieData.imdbID, movieData.Title, movieData.Year, movieData.Poster, req.session.userId],
        function (err, result) {
            if (result.insertId > 0) {
                res.redirect("/");
            }
        }
    );
}

exports.removeFromWishlist = function (req, res) {
    const movieData = JSON.parse(req.body.movieData);
    const connection = req.app.get("db");
    connection.query("DELETE FROM wishlists WHERE imdb_id = ? AND user_id = ?",
        [movieData.imdbID, req.session.userId],
        function (err, result) {
            res.redirect("/");
        }
    );
}