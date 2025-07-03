import React, { useContext } from 'react';
import { context } from '../Context.jsx';
import css from './Cart.module.css';
import { Link } from 'react-router-dom';



const Cart = () => {
    const { cartItems, setCartItems, currency, getPrice, getCurrency } = useContext(context);

    const getTotal = () => {
        const rawTotal = cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
        return getPrice(rawTotal, currency);
    };

    const updateQuantity = (item, delta) => {
        const updatedItems = cartItems.map((cartItem) =>
            cartItem.id === item.id && cartItem.chosenSize === item.chosenSize
                ? { ...cartItem, quantity: Math.max(cartItem.quantity + delta, 1) }
                : cartItem
        );
        setCartItems(updatedItems);
    };

    const updateChosenSize = (item, newSize) => {
        if (item.chosenSize === newSize) return;

        const existingItemIndex = cartItems.findIndex(
            cartItem => cartItem.id === item.id && cartItem.chosenSize === newSize
        );

        if (existingItemIndex !== -1) {
            const updatedItems = cartItems.map((cartItem, index) => {
                if (index === existingItemIndex) {
                    return { ...cartItem, quantity: cartItem.quantity + item.quantity };
                }
                if (cartItem.id === item.id && cartItem.chosenSize === item.chosenSize) {
                    return null;
                }
                return cartItem;
            }).filter(Boolean);
            
            setCartItems(updatedItems);
        } else {
            const updatedItems = cartItems.map((cartItem) =>
                cartItem.id === item.id && cartItem.chosenSize === item.chosenSize
                    ? { ...cartItem, chosenSize: newSize }
                    : cartItem
            );
            setCartItems(updatedItems);
        }
    };

    return (
        <div className={css.cartPage}>
            <h1>CART</h1>
            {cartItems.map((item) => (
                <div key={`${item.id}-${item.chosenSize}`} className={css.cartItem}>
                    <div className={css.details}>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <strong>
                            {getCurrency(currency)}{getPrice(item.price, currency)}
                        </strong>
                        <div className={css.size}>
                            <p>SIZE:</p>
                            <div className={css.sizeSelector}>
                                {item.availableSize.map((size, index) => (
                                    <div
                                        key={index}
                                        className={
                                            item.chosenSize === size
                                                ? `${css.sizeBox} ${css.sizeBoxSelected}`
                                                : css.sizeBox
                                        }
                                        onClick={() => updateChosenSize(item, size)}
                                    >
                                        {size}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={css.controls}>
                        <button onClick={() => updateQuantity(item, +1)}>+</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item, -1)}>-</button>
                    </div>
                    <div className={css.image}>
                        <img src={item.image} alt={item.name} />
                    </div>
                </div>
            ))}
            <div className={css.summary}>
                <p>
                    <strong>Quantity:</strong>{' '}
                    {cartItems.reduce((q, i) => q + i.quantity, 0)}
                </p>
                <p>
                    <strong>Total:</strong>{' '}
                    {getCurrency(currency)}{getTotal()}
                </p>
                <Link to="/checkout/details" className={css.continueBtn}>
                    CONTINUE
                </Link>
            </div>
        </div>
    );
};

export default Cart;