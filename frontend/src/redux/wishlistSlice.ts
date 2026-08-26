import {createSlice, type PayloadAction} from "@reduxjs/toolkit"
import { type CartItem } from "../types/cart"

interface WishlistState {
  items: CartItem[];
}

const initialState: WishlistState = {
  items: [],
};


const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<CartItem>) => {
      const exists = state.items.some(
        (item) => item._id === action.payload._id
      );

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export const wishlistReducer =  wishlistSlice.reducer;