const express = require("express");
const router = express.Router();
const movieWishlistController = require("../controllers/movieWishlistController");
const authMiddlewares = require("../middlewares/auth");

router.get("/", authMiddlewares.checkAuth, movieWishlistController.viewWishlist);
router.post("/add", authMiddlewares.checkAuth, movieWishlistController.addToWishlist);
router.post("/remove", authMiddlewares.checkAuth, movieWishlistController.removeFromWishlist);

// router.get("/search", authMiddlewares.checkAuth, movieWishlistController.displayMovieSearch);
router.post("/search", authMiddlewares.checkAuth, movieWishlistController.searchMovie);

module.exports = router;