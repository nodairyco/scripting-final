import React, {useContext, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import css from './Home.module.css'
import outerCss from '../App.module.css'
import {context} from "../App.jsx";

export default function Home({currency}) {

    const {
        womenClothing,
        setWomenClothing,
        menClothing,
        setMenClothing,
        childrenClothing,
        setChildrenClothing
    } = useContext(context)

    const params = useParams()
    const getCategoryTitle = (category) => {
        switch (category) {
            case 'women':
                return "Women's clothing"
            case 'men':
                return "For Men"
            case 'children':
                return "Clothes for Children"
            default:
                return "Error not found"
        }
    }

    const getClothing = (category) => {
        switch (category) {
            case 'women':
                return womenClothing
            case 'men':
                return menClothing
            case 'children':
                return childrenClothing
        }
    }

    return (
        <div className={outerCss.contentDiv}>
            <h1 className={css.categoryTitle}>
                {getCategoryTitle(params.category)}
            </h1>
            <div className={css.clothesContainer}>
                {
                    getClothing(params.category) ?
                        getClothing(params.category).map((movie) => {
                            return <ClothesCard key={movie.id} clothing={movie} currency={currency}
                                                category={params.category}/>
                        }) : <p>Error</p>
                }
            </div>
        </div>
    );
}

function ClothesCard({clothing, currency, category}) {
    const navigate = useNavigate()
    const [activateSizeList, setActivateSizeList] = useState(false)
    const calculatePrice = (price, currency) => {
        switch (currency) {
            case 'euro':
                return `€${(price * 0.85).toFixed(2)}`;
            case 'lari':
                return `₾${(price * 3.2).toFixed(2)}`;
            default:
                return `$${price.toFixed(2)}`;
        }
    }

    const isItOutOfStock = (stock) => {
        for (let i = 0; i < stock.length; i++) {
            if (stock[i] > 0) {
                return false
            }
        }
        return true
    }

    const navigateFunction = () => {
        if (!isItOutOfStock(clothing.stock)) {
            navigate(`/clothes/${category}/${clothing.id}`)
        }
    }

    return (
        <div className={isItOutOfStock(clothing.stock) ? css.clothesCardOutOfStock : css.clothesCard}
             onClick={() => {
                 navigateFunction()
             }}>
            <img src={clothing.image} className={css.cardImg} alt='clothing'/>
            {
                isItOutOfStock(clothing.stock) &&
                <div className={css.clothesCardOutOfStockText}>
                    OUT OF STOCK
                </div>
            }
            <div className={css.addToCartBtn} onClick={(e) => {
                e.stopPropagation()
                setActivateSizeList(!activateSizeList)
            }}>
                {
                    activateSizeList &&
                    <SizeList clothing={clothing}/>
                }
                <img alt='empty cart icon' src='/EmptyCart.svg'/>
            </div>
            <p className={css.cardDetailsNameContainer}>{clothing.name}</p>
            <p className={css.cardDetailsPriceContainer}>{calculatePrice(clothing.price, currency)}</p>
        </div>
    )
}

function SizeList({clothing}) {

    const [chosenSize, setChosenSize] = useState('')
    const {updateCartItems} = useContext(context)
    
    const handleSizeChoosing = (size) => {
        if (size !== chosenSize) {
            setChosenSize(size)
        }
    }
    
    const handleAddingToCart = () => {
        if (chosenSize === '') {
            return
        } 
        
        updateCartItems({...clothing, quantity:1, chosenSize: chosenSize}, chosenSize)
    }

    return (
        <div className={css.chooseSizeContainer}>
            <p>CHOOSE A SIZE</p>
            <div className={css.sizeListContainer}>
                {
                    clothing.availableSize.map((size, index) => {
                        return (
                            <a key={index} className={chosenSize === size ? css.sizeBtnChosen : css.sizeBtn}
                               onClick={(e) => {
                                   e.stopPropagation()
                                   handleSizeChoosing(size)
                               }}>
                                {size}
                            </a>
                        )
                    })
                }
            </div>
            <a className={css.finalize} onClick={() => handleAddingToCart()}>
                ADD TO CART
            </a>
            <div className={css.arrowDiv}/>
        </div>
    )
}