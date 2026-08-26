const express = require("express");
const { protected } = require("../middleware/auth.Middleware");

const {
  addWishlist,
  getAllWishlist,
  deleteWishlistById,
  clearWishlist,
} = require("../controllers/wishlistController.js");

const router = express.Router();

router.route("/").get(getAllWishlist).post(addWishlist);
router.route("/:_id").delete(deleteWishlistById);
router.delete("/",clearWishlist);

module.exports = router;
