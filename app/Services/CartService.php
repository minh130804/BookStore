<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;

class CartService
{
    /**
     * Get user's cart including cart items and corresponding books.
     */
    public function getCartForUser($userId)
    {
        return Cart::with('items.book')->where('user_id', $userId)->first();
    }

    /**
     * Add a book to the user's cart. Creates a cart if it doesn't exist,
     * updates quantity if the book is already in the cart, otherwise adds it as a new item.
     */
    public function addToCart($userId, int $bookId, int $quantity)
    {
        $cart = Cart::firstOrCreate(['user_id' => $userId]);

        $cartItem = CartItem::where('cart_id', $cart->id)
                            ->where('book_id', $bookId)
                            ->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'book_id' => $bookId,
                'quantity' => $quantity
            ]);
        }

        return true;
    }

    /**
     * Remove an item from the user's cart after verifying owner.
     */
    public function deleteCartItem($userId, CartItem $cartItem)
    {
        if ($cartItem->cart && $cartItem->cart->user_id === $userId) {
            $cartItem->delete();
            return true;
        }
        return false;
    }
}
