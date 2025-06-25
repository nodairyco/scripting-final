import React, {useContext, useState} from 'react';
import {useLocation, useParams} from "react-router-dom";
import css from './ProductDetails.module.css'
import {context} from "../App.jsx";

function ProductDetails() {
    const {womenClothing, menClothing, childrenClothing, currency, updateCartItems} = useContext(context)
    const params = useParams()
    const [chosenSize, setChosenSize] = useState('')

    const getCurrentClothing = () => {
        switch (params.category) {
            case "women":
                return womenClothing.find((x) => x.id === parseInt(params.id))
            case "men":
                return menClothing.find((x) => x.id === parseInt(params.id))
            case "children":
                return childrenClothing.find((x) => x.id === parseInt(params.id))
            default:
                return undefined
        }
    }

    const [currentClothing, _] = useState(getCurrentClothing())

    return (
        <main className={css.main}>
            <div className={css.thumbnailContainer}>
                <img alt='clothing' src={currentClothing.image} width={511} height={610}/>
            </div>
            <div className={css.detailsContainer}>
                <div className={css.headerContainer}>
                    <p className={css.brandP}>
                        {currentClothing.brand}
                    </p>
                    <p className={css.nameP}>
                        {currentClothing.name}
                    </p>
                </div>
                <div className={css.sizeContainer}>
                    <p className={css.sizeP}>
                        SIZE:
                    </p>
                    <div className={css.sizeList}>

                        {
                            currentClothing.availableSize.map((size, index) => {
                                return (
                                    <a key={index} className={chosenSize === size ? css.sizeBtnChosen : css.sizeBtn}
                                       onClick={(e) => {
                                           e.stopPropagation()
                                           setChosenSize(size)
                                       }}>
                                        {size}
                                    </a>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={css.priceContainer}>
                    <p className={css.sizeP}>
                        PRICE:
                    </p>
                    <p className={css.priceP}>
                        {getCurrency(currency)}{getPrice(currentClothing.price, currency)}
                    </p>
                    <a className={chosenSize ? css.addToCartBtn : css.disableAddToCartBtn}
                       onClick={() => {
                           if (chosenSize) {
                               updateCartItems({...currentClothing, chosenSize: chosenSize, quantity: 1}, chosenSize)
                           }
                       }}
                    >
                        ADD TO CART
                    </a>
                    <p>
                        {currentClothing.description} 
                    </p>
                </div>
            </div>
        </main>
    );
}

function getPrice(price, currency) {
    switch (currency) {
        case 'euro':
            return (price * 0.85).toFixed(2)
        case 'lari':
            return (price * 3.2).toFixed(2)
        default:
            return price.toFixed(2)
    }
}

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
export default ProductDetails;