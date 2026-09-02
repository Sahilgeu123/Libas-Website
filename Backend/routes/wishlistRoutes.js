const express = require("express");
const { protected } = require("../middleware/auth.Middleware");

const {
  addWishlist,
  getAllWishlist,
  deleteWishlistById,
  clearWishlist,
} = require("../controllers/wishlistController.js");

const router = express.Router();

router.route("/").get(protected, getAllWishlist).post(protected, addWishlist);
router.delete("/:_id",protected ,deleteWishlistById);
router.delete("/",protected, clearWishlist);

module.exports = router;
