import React from 'react';
import {useLocation, useParams} from "react-router-dom";
import outerCss from '../App.module.css'
import css from './ProductDetails.module.css'

function ProductDetails() {
    const location = useLocation()
    const params = useParams()
    return (
        <div className={outerCss.contentDiv}>
            {location.pathname}
            <br/>
            {params.category}
            <br/>
            {params.id}
        </div>
    );
}

export default ProductDetails;