import React, {useState} from 'react';
import css from './TopBar.module.css'
import {Link, useLocation} from "react-router-dom";


function TopBar({currency, setCurrency}) {

    const [focusedCurrencyChange, setFocusedCurrencyChange] = useState(false);
    const location = useLocation()
    const getCurrency = (currency) => {
        switch (currency) {
            case 'dollar':
                return '$';
            case 'euro':
                return '€';
            case 'lari':
                return '₾';
            default:
                return '$';
        }
    }

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
                <a>
                    <img src="/logo.svg" alt="Logo" width='30px' height='30px'/>
                </a>
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

                </div>
            </div>
        </header>
    );
}

export default TopBar;