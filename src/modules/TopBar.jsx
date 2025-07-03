import React, {useContext, useState} from 'react';
import css from './TopBar.module.css'
import {Link, useLocation} from "react-router-dom";

import {context} from "../Context.jsx";


export default function TopBar() {
    const {currency, setCurrency, cartItems, getCurrency} = useContext(context)
    const [focusedCurrencyChange, setFocusedCurrencyChange] = useState(false);
    const [activateShoppingCart, setActivateShoppingCart] = useState(false);
    const location = useLocation()

    return (
        <header className={css.topbarContainer}>
            <nav className={css.navBar}>
                <Link to='/clothes/women' className={
                    location.pathname === '/clothes/women' ?
                        css.navBarButtonFocused : css.navBarButton
                }>
                    WOMEN
                </Link>
                <Link to='/clothes/men' className={
                    location.pathname === '/clothes/men' ?
                        css.navBarButtonFocused : css.navBarButton
                }>
                    MEN
                </Link>
                <Link to='/clothes/children' className={
                    location.pathname === '/clothes/children' ?
                        css.navBarButtonFocused : css.navBarButton
                }>
                    CHILDREN
                </Link>
            </nav>
            <div className={css.logoContainer}>
                <Link to='/clothes/women'>
                    <img src="/logo.svg" alt="Logo" width='30px' height='30px'/>
                </Link>
            </div>
            <div className={css.miscContainer}>
                <a className={css.currencyChanger} onClick={() => {
                    setFocusedCurrencyChange(!focusedCurrencyChange);
                }}>
                    {getCurrency(currency)}
                    <div className={
                        focusedCurrencyChange ? css.currencyChangerArrowFocused :
                            css.currencyChangerArrow
                    }/>
                    {focusedCurrencyChange &&
                        <div className={css.currencyChangeDropdown}>
                            <div className={css.currencyChangeDropdownItem}>
                                <div onClick={() => {
                                    setCurrency('dollar');
                                    setFocusedCurrencyChange(false);
                                }}>
                                    $ USD
                                </div>
                            </div>
                            <div className={css.currencyChangeDropdownItem}>
                                <div onClick={() => {
                                    setCurrency('euro');
                                    setFocusedCurrencyChange(false);
                                }}>
                                    € EUR
                                </div>
                            </div>
                            <div className={css.currencyChangeDropdownItem}>
                                <div onClick={() => {
                                    setCurrency('lari');
                                    setFocusedCurrencyChange(false);
                                }}>
                                    ₾ GEL
                                </div>
                            </div>
                        </div>
                    }
                </a>
                <div className={css.shoppingCart}>
                    <img src="/EmptyCart.svg" width="18px" height="18px" alt="Cart Icon"
                         className={css.shoppingCartIcon}
                         onClick={() => {
                             setActivateShoppingCart(!activateShoppingCart)
                         }}/>
                    {
                        getTotalItems(cartItems) > 0 &&
                        <div className={css.shoppingCartQuantity}>
                            {getTotalItems(cartItems)}
                        </div>
                    }
                    {
                        activateShoppingCart &&
                        <DisplayCart/>
                    }

                    {
                        activateShoppingCart
                        &&
                        <div className={css.shoppingCartCloseOverlay}
                             onClick={() => setActivateShoppingCart(false)}/>
                    }
                </div>
            </div>
        </header>
    );
}

function DisplayCart() {
    const {cartItems, setCartItems, currency, updateCartItems, getCurrency, getPrice} = useContext(context)

    const getTotalPrice = (cartItems, currency) => {
        let price = 0.0
        if (cartItems) {
            for (let i = 0; i < cartItems.length; i++) {
                price += cartItems[i].price * cartItems[i].quantity
            }
        }
        return getPrice(price, currency);
    }

    const updateQuantity = (item, bool) => {
        let updatedCartItems = cartItems.map(cartItem => {
            if (cartItem.id === item.id && cartItem.chosenSize === item.chosenSize) {
                if (cartItem.quantity > 0)
                    return {...cartItem, quantity: bool ? cartItem.quantity + 1 : cartItem.quantity - 1}
                if (cartItem.quantity === 0 && !bool)
                    return {...cartItem, quantity: 0}
                if (bool && cartItem.quantity === 0)
                    return {...cartItem, quantity: 1}
            }
            return cartItem
        });
        setCartItems(updatedCartItems);
    }

    function mapItemSize(size, index, item) {

        let isCurrentSizeChosen = item.chosenSize === size

        const updateChosenSize = (newSize) => {
            if (isCurrentSizeChosen) {
                return
            }

            let lst =
                cartItems.map((itemToUpdate) => {
                    if (itemToUpdate.id === item.id)
                        return {...itemToUpdate, chosenSize: newSize}

                    return itemToUpdate
                })
            setCartItems(lst)
        }

        return (
            <a key={index} className={
                isCurrentSizeChosen ?
                    css.cartItemSizeBtnChosen : css.cartItemSizeBtn
            } onClick={() => {
                if (isCurrentSizeChosen) return
                updateCartItems({...item}, size)
                updateChosenSize(size)
            }}
            >
                {
                    size
                }
            </a>
        )
    }

    return (
        <div className={css.shoppingCartOverlay}>
            <div className={css.cartHeader}>
                <span>My Bag</span>, {getTotalItems(cartItems)} items
            </div>
            <div className={css.cartItemsContainer}>
                {
                    cartItems ?
                        cartItems.map((item, index) => (
                            <div key={index} className={css.cartItem}>
                                <div className={css.cartItemDetails}>
                                    <p>
                                        {item.brand}
                                    </p>
                                    <p>
                                        {item.name}
                                    </p>
                                    <p>
                                        {getCurrency(currency)}{getPrice(item.price, currency)}
                                    </p>
                                    <div className={css.cartItemSizeControl}>
                                        <p>
                                            Size:
                                        </p>
                                        <div className={css.cartItemSizeControlList}>
                                            {
                                                item.availableSize.map((size, index) =>
                                                    mapItemSize(size, index, item)
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={css.cartItemThumbnail}>
                                    <div className={css.cartItemQuantityControl}>
                                        <a onClick={() => {
                                            updateQuantity(item, true)
                                        }}>
                                            +
                                        </a>
                                        <p>
                                            {item.quantity}
                                        </p>
                                        <a onClick={() => {
                                            updateQuantity(item, false)
                                        }}>
                                            -
                                        </a>
                                    </div>
                                    <img className={css.cartItemImage} alt='cart item' src={item.image}/>
                                </div>
                            </div>
                        ))
                        : "No items in cart"
                }
            </div>
            <div className={css.cartTotal}>
                <span>
                    Total
                </span>
                <span className={css.cartTotalPrice}>
                    {getCurrency(currency)}{getTotalPrice(cartItems, currency)} 
                </span>
            </div>
            <div className={css.cartBtnArr}>
                <Link to="/cart" className={css.cartViewBagBtn}>
                    VIEW BAG
                </Link>
                <Link to="/checkout/details" className={css.cartCheckoutBtn}>
                    CHECK OUT
                </Link>
            </div>
        </div>
    )
}

const getTotalItems = (cartItems) => {
    let total = 0
    for (let i = 0; i < cartItems.length; i++) {
        total += cartItems[i].quantity
    }
    return total
}
