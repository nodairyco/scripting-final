import React, {useContext} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import css from './Home.module.css'
import outerCss from '../App.module.css'
import {clothingContext} from "../App.jsx";

export default function Home({currency}) {

    const {
        womenClothing,
        setWomenClothing,
        menClothing,
        setMenClothing,
        childrenClothing,
        setChildrenClothing
    } = useContext(clothingContext)

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
            <img src={clothing.image} className={css.cardImg}/>
            {
                isItOutOfStock(clothing.stock) &&
                <div className={css.clothesCardOutOfStockText}>
                    OUT OF STOCK
                </div>
            }
            <p className={css.cardDetailsNameContainer}>{clothing.name}</p>
            <p className={css.cardDetailsPriceContainer}>{calculatePrice(clothing.price, currency)}</p>
        </div>
    )
}