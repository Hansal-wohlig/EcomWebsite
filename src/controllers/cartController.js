const Cart = require("../models/cartModel")
const Product = require("../models/Product")

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.render("public/cart", {
      title: "Your Cart", // ✅ Add this line
      cart,
      user: req.user,
    });
  };
  


exports.getCartData = async(req,res)=>{
    const cart = await Cart.findOne({user:req.user._id}).populate("items.product")
    res.json(cart)
}

exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        let quantity = Number(req.body.quantity);
        if (!quantity || isNaN(quantity) || quantity < 1) quantity = 1;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        // Check if product is active
        if (!product.isActive) {
            return res.status(400).json({ 
                success: false, 
                message: 'This product is currently unavailable' 
            });
        }

        // Check stock availability
        if (quantity > product.stockQty) {
            return res.status(400).json({ 
                success: false, 
                message: `Only ${product.stockQty} items available in stock` 
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [{ product: productId, quantity, price: product.price }]
            });
        } else {
            const existingItem = cart.items.find(item => item.product.equals(productId));
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > product.stockQty) {
                    return res.status(400).json({ 
                        success: false, 
                        message: `Cannot add more items. Only ${product.stockQty} available in stock` 
                    });
                }
                existingItem.quantity = newQuantity;
            } else {
                cart.items.push({ product: productId, quantity, price: product.price });
            }
        }
        
        cart.calculateTotal();
        await cart.save();
        
        res.json({ 
            success: true, 
            message: `${product.title} added to cart successfully!`,
            cartItemCount: cart.items.length
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add item to cart. Please try again.' 
        });
    }
};

// Remove one item (decrease quantity by 1)
exports.removeOneFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }

        const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
        
        if (itemIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found in cart' 
            });
        }

        const item = cart.items[itemIndex];
        
        if (item.quantity > 1) {
            // Decrease quantity by 1
            item.quantity -= 1;
        } else {
            // Remove the entire item if quantity is 1
            cart.items.splice(itemIndex, 1);
        }

        cart.calculateTotal();
        await cart.save();

        // Always return JSON response for API calls
        return res.json({ 
            success: true, 
            message: 'Item removed from cart',
            cartItemCount: cart.items.length,
            totalPrice: cart.totalPrice
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to remove item from cart' 
        });
    }
};

// Remove entire product (all quantities)
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }

        // Remove the entire item
        cart.items = cart.items.filter(item => !item.product.equals(productId));
        cart.calculateTotal();
        await cart.save();

        // Always return JSON response for API calls
        return res.json({ 
            success: true, 
            message: 'Product removed from cart',
            cartItemCount: cart.items.length,
            totalPrice: cart.totalPrice
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to remove product from cart' 
        });
    }
};
  
  exports.clearCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).send('Cart not found');
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.json({ message: 'Cart cleared' });
  };