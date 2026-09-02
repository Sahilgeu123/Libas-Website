const user = require("../models/userModel");

const addWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const User = await user.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          wishlist: productId,
        },
      },
      { new: true },
    );

    res.status(200).json({
      message: "Added to wishlist",
      wishlist: User.wishlist,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const getAllWishlist = async (req, res) => {
  try {
    const User = await user.findById(req.user._id).populate("wishlist");

    res.status(200).json({
      wishlist: User.wishlist,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteWishlistById = async (req, res) => {
  try {
    const { _id } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          wishlist: _id,
        },
      },
      { new: true },
    );

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          wishlist: [],
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Wishlist cleared",
      wishlist: user.wishlist,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


module.exports = {
  addWishlist,
  getAllWishlist,
  deleteWishlistById,
  clearWishlist,
};
