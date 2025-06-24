import {lazy, Suspense, useState} from 'react'
import {Navigate, Route, Routes} from "react-router-dom"
import TopBar from "./modules/TopBar.jsx"
import css from './App.module.css'

function App() {

    const Home = lazy(() => import('./modules/Home.jsx'))
    const ProductDetails = lazy(() => import('./modules/ProductDetails.jsx'))
    const [currency, setCurrency] = useState('dollar')
    const [cartItems, setCartItems] = useState([])
    const [womenClothing, setWomenClothing] = useState(womensClothing)

    return (
        <>
            <TopBar currency={currency} setCurrency={setCurrency}/>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path='/clothes/:category'
                           element={<Home womenClothing={womenClothing} currency={currency}/>}/>
                    <Route path='/' element={<Navigate to='/clothes/women'/>}/>
                    <Route path='/clothes/:category/:id' element={<ProductDetails/>}/>
                </Routes>
            </Suspense>
        </>
    )
}

const womensClothing = [
    {
        id: 1,
        name: 'Beige Cotton Dress',
        price: 50.00,
        availableSize: ['S', 'M', 'L', 'XL'],
        stock: [5, 5, 5, 5],
        description: 'Beige cotton dress, perfect for summer and fall chilly evenings.',
        image: '/images/woman1.png',
        brand: 'Jim Wool'
    },
    {
        id: 2,
        name: 'Gray Cotton Sweatshirt',
        price: 40.00,
        availableSize: ['S', 'M', 'L', 'XL'],
        stock: [5, 5, 5, 5],
        description: 'Classic gray sweatshirt, perfect for any casual and semi-formal occasion.',
        image: '/images/woman2.png',
        brand: 'Long Long Ltd.'
    },
    {
        id: 3,
        name: 'Off-White Sundress',
        price: 80.00,
        availableSize: ['S', 'M', 'L', 'XL'],
        stock: [5, 5, 5, 5],
        description: 'Conquer the summer with this premium sundress (bouquet not included).',
        image: '/images/woman3.png',
        brand: 'Siegmeyer & Siegward'
    },
    {
        id: 4,
        name: 'Cool Hand Bag',
        price: 400.00,
        availableSize: ['S', 'M', 'L', 'XL'],
        stock: [5, 5, 5, 5],
        description: 'Need to carry stuff around but have no space? We have the solution!',
        image: '/images/woman4.png',
        brand: 'Merchant Hag Melentia Clothing'
    },
    {
        id: 5,
        name: 'Pink Sweatshirt',
        price: 400.00,
        availableSize: ['S', 'M', 'L', 'XL'],
        stock: [0, 0, 0, 0],
        description: 'Very popular, amazing, and fast-selling pink BEAUTY!',
        image: '/images/pink-sweatshirt.jpg',
        brand: 'Yhorm style Fashion'
    }
]

export default App
