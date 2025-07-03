import React, {createContext, useContext, useRef, useState} from 'react';
import css from './Checkout.module.css';
import {useNavigate, useParams} from "react-router-dom";
import {context} from "../Context.jsx";
import data from '../data/data.json'

const shippingContext = createContext()

export default function Checkout() {

    const [success, setSuccess] = useState(false);
    const [shippingInfo, setShippingInfo] = useState(() => {
        const savedData = localStorage.getItem('form')
        if (savedData) {
            return JSON.parse(savedData)
        }
    })
    const params = useParams()
    const [shipping, setShipping] = useState('')


    const getShippingComponent = (shippingStage) => {
        switch (shippingStage) {
            case 'details':
                return (<ShippingDetails/>)
            case 'shipping-method':
                return (<ShippingMethod/>)
            case 'payment':
                return (<Payment/>)
        }
    }

    return (
        <shippingContext.Provider value={{
            shippingInfo, setShippingInfo, shipping, setShipping,
            success, setSuccess
        }}>
            <main className={css.main}>
                {getShippingComponent(params.shippingStage)}
                <DisplayCart/>
            </main>
        </shippingContext.Provider>
    );
}

function ShippingDetails() {
    const {setShippingInfo} = useContext(shippingContext)
    const [form, setForm] = useState(() => {
        const defaultForm = {
            contact: '',
            name: '',
            secondName: '',
            address: '',
            note: '',
            city: '',
            postal: '',
            province: '',
            country: '',
            saveInfo: false
        }

        const savedForm = localStorage.getItem('form')

        try {
            return savedForm ? JSON.parse(savedForm) : defaultForm
        } catch (_) {
            return defaultForm
        }
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Helper to get country list and regions
    const countryList = data.map(c => c.countryName);
    const selectedCountry = data.find(c => c.countryName === form.country);
    const regionList = selectedCountry ? selectedCountry.regions : [];

    const handleChange = e => {
        const {name, value, type, checked} = e.target;
        setForm(f => ({...f, [name]: type === 'checkbox' ? checked : value}));
    };

    const validate = () => {
        const errs = {};
        if (!form.contact.trim()) {
            errs.contact = 'Contact required';
        } else if (!/^\S+@\S+\.\S+$/.test(form.contact) && !/^\+?\d{7,15}$/.test(form.contact)) {
            errs.contact = 'Enter a valid email or phone number';
        }
        if (!form.name.trim()) {
            errs.name = 'Name required';
        } else if (!/^[A-Za-z\s]+$/.test(form.name)) {
            errs.name = 'Name must contain only letters';
        }
        if (!form.secondName.trim()) {
            errs.secondName = 'Second name required';
        } else if (!/^[A-Za-z\s]+$/.test(form.secondName)) {
            errs.secondName = 'Second name must contain only letters';
        }
        if (!form.address.trim()) {
            errs.address = 'Address required';
        }
        if (!form.city.trim()) {
            errs.city = 'City required';
        }
        if (!form.postal.trim()) {
            errs.postal = 'Postal code required';
        } else if (!/^\d+$/.test(form.postal)) {
            errs.postal = 'Postal code must be digits';
        }
        if (!form.province.trim()) {
            errs.province = 'Province required';
        }
        if (!form.country.trim()) {
            errs.country = 'Country required';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
            if (form.saveInfo) {
                form.saveInfo = false
                localStorage.setItem('form', JSON.stringify(form))
            }
            setShippingInfo(form)
            navigate('/checkout/shipping-method', {state: {shippingInfo: form}});
        }
    };
    return (
        <div className={css.contentDiv}>
            <header className={css.divHeader}>
                <span className={css.prev}>Cart</span>
                <span> › </span>
                <span className={css.active}>Details</span>
                <span> › </span>
                <span>Shipping</span>
                <span> › </span>
                <span>Payment</span>
            </header>
            <form className={css.form} onSubmit={handleSubmit}>
                <div className={css.formHeadContainer}>
                    <div className={css.formHeader}>
                        Contact
                    </div>
                    <input name="contact" type="text" placeholder="Email or mobile phone number"
                           value={form.contact} onChange={handleChange} className={css.inputField}/>
                    {
                        errors.contact &&
                        <div className={css.errorMsg}>
                            {errors.contact}
                        </div>
                    }
                </div>
                <div className={css.formHeader} style={{marginTop: 8}}>Shipping Address</div>

                <div className={css.inputRow}>
                    <div className={css.inputContainer}>
                        <input name="name" type="text" placeholder="Name" value={form.name}
                               onChange={handleChange} className={css.inputField}/>
                        {
                            errors.name &&
                            <div className={css.errorMsg}>
                                {errors.name}
                            </div>
                        }
                    </div>
                    <div className={css.inputContainer}>
                        <input name="secondName" type="text" placeholder="Second Name" value={form.secondName}
                               onChange={handleChange} className={css.inputField}/>
                        {
                            errors.secondName &&
                            <div className={css.errorMsg}>
                                {errors.secondName}
                            </div>
                        }
                    </div>
                </div>

                <div className={css.inputRow}>
                    <div className={css.inputContainer}>
                        <input name="address" type="text" placeholder="Address and number" value={form.address}
                               onChange={handleChange} className={css.inputField}/>
                        {errors.address && <div className={css.errorMsg}>{errors.address}</div>}
                    </div>
                </div>

                <div className={css.inputRow}>
                    <div className={css.inputContainer}>
                        <input name="note" type="text" placeholder="Shipping note (optional)" value={form.note}
                               onChange={handleChange} className={css.inputField}/>
                    </div>
                </div>

                <div className={css.inputRow}>
                    <div className={css.inputContainer}>
                        <input name="city" type="text" placeholder="City" value={form.city}
                               onChange={handleChange} className={css.inputField}/>
                        {errors.city && <div className={css.errorMsg}>{errors.city}</div>}
                    </div>
                    <div className={css.inputContainer}>
                        <input name="postal" type="text" placeholder="Postal Code" value={form.postal}
                               onChange={handleChange} className={css.inputField}/>
                        {errors.postal && <div className={css.errorMsg}>{errors.postal}</div>}
                    </div>
                    <div className={css.inputContainer}>
                        <select
                            name="province"
                            value={form.province}
                            onChange={handleChange}
                            className={css.inputField}
                            disabled={!form.country}
                        >
                            <option value="">Select region</option>
                            {regionList.map(region => (
                                <option key={region.shortCode || region.name}
                                        value={region.name}>{region.name}
                                </option>
                            ))}
                        </select>
                        {errors.province && <div className={css.errorMsg}>{errors.province}</div>}
                    </div>
                </div>
                <div className={css.inputRow}>
                    <select
                        name="country"
                        value={form.country}
                        onChange={e => {
                            handleChange(e);
                            setForm(f => ({...f, province: ''})); // reset province when country changes
                        }}
                        className={css.inputField}
                    >
                        <option value="">
                            Select country/region
                        </option>
                        {countryList.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>
                {errors.country && <div className={css.errorMsg}>{errors.country}</div>}
                <div>
                    <input name="saveInfo" type="checkbox" checked={form.saveInfo} onChange={handleChange}/>
                    <label htmlFor="saveInfo">Save this informations for a future fast checkout</label>
                </div>
                <div className={css.buttonRow}>
                    <button type="button" className={css.link} onClick={() => navigate('/cart')}>
                        Back to cart
                    </button>
                    <button type="submit" className={css.primary}>Go to shipping method</button>
                </div>
            </form>
        </div>
    )
}

function ShippingMethod() {
    const {shippingInfo, shipping, setShipping} = useContext(shippingContext)
    const {currency, getCurrency, getPrice} = useContext(context)
    const navigate = useNavigate();

    const contact = shippingInfo.contact || '';
    const address =
        [shippingInfo.address, shippingInfo.city, shippingInfo.postal, shippingInfo.province, shippingInfo.country]
            .filter(Boolean).join(', ');

    return (
        <div className={css.contentDiv}>
            <header className={css.divHeader}>
                <span className={css.prev}>Cart</span>
                <span> › </span>
                <span className={css.prev}>Details</span>
                <span> › </span>
                <span className={css.active}>Shipping</span>
                <span> › </span>
                <span>Payment</span>
            </header>
            <div className={css.infoBox}>
                <div className={css.infoRow}>
                    <span className={css.infoLabel}>Contact</span>
                    {contact}
                </div>
                <div className={css.infoRow}>
                    <span className={css.infoLabel}>Ship to</span> {address}
                </div>
            </div>
            <div style={{fontWeight: 600, fontSize: 18, marginBottom: 18}}>Shipping method</div>
            <div className={css.shippingMethods}>
                <div className={css.methodOption}>
                    <label className={css.methodLabel} onClick={() => setShipping('free')}>
                        <div className={shipping === 'free' ? css.selected : css.rad}>

                        </div>
                        Standard Shipping
                    </label>
                    <span className={css.methodPrice}>
                        Free
                    </span>
                </div>
                <div className={css.methodOption}>
                    <label className={css.methodLabel} onClick={() => setShipping('premium')}>
                        <div className={shipping === 'premium' ? css.selected : css.rad}>

                        </div>
                        Premium Shipping
                    </label>
                    <span className={css.methodPrice}>
                        {getCurrency(currency)}{getPrice(4.99, currency)}
                    </span>
                </div>
                <div className={css.buttonRow}>
                    <button className={css.link} onClick={() => navigate('/checkout/details')}>Back to details
                    </button>
                    <button className={css.primary} onClick={() => navigate('/checkout/payment')}>
                        Go to payment
                    </button>
                </div>
            </div>
        </div>
    )
}

function Payment() {
    const {shipping, shippingInfo: info, success, setSuccess} = useContext(shippingContext)
    const {setCartItems, currency, getCurrency, getPrice} = useContext(context)
    const navigate = useNavigate()
    const [card, setCard] = useState({number: '', name: '', exp: '', cvv: ''});
    const [errors, setErrors] = useState({});

    const contact = info.contact || '';
    const address = [info.address, info.city, info.postal, info.province, info.country].filter(Boolean).join(', ');

    const validate = () => {
        const errs = {};
        if (!/^\d{16}$/.test(card.number.replace(/\s+/g, ''))) {
            errs.number = 'Card number must be 16 digits';
        }
        if (!card.name.trim()) {
            errs.name = 'Cardholder name required';
        } else if (!/^[A-Za-z\s]+$/.test(card.name)) {
            errs.name = 'Cardholder name must contain only letters';
        }
        if (!/^\d{2}\/\d{2}$/.test(card.exp)) {
            errs.exp = 'Format MM/YY';
        } else {
            const [mm, yy] = card.exp.split('/').map(Number);
            const now = new Date();
            const expDate = new Date(2000 + yy, mm - 1, 1);
            if (mm < 1 || mm > 12) {
                errs.exp = 'Invalid month';
            } else if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
                errs.exp = 'Card expired';
            }
        }
        if (!/^\d{3,4}$/.test(card.cvv)) {
            errs.cvv = 'CVV must be 3 or 4 digits';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleCardChange = e => {
        const {name, value} = e.target;
        setCard(c => ({...c, [name]: value}));
        setErrors(errs => ({...errs, [name]: undefined}));
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
            setSuccess(true);
        }
    };

    
    return (
        <div className={css.contentDiv}>
            {success ?
                (<>
                    <header className={css.divHeader}>
                        <span className={css.prev}>Cart</span>
                        <span> › </span>
                        <span className={css.prev}>Details</span>
                        <span> › </span>
                        <span className={css.prev}>Shipping</span>
                        <span> › </span>
                        <span className={css.active}>Payment</span>
                    </header>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60}}>
                        <img src="/check.svg" alt="Success" style={{width: 100, height: 100, marginBottom: 24}}/>
                        <h2 style={{margin: 0, fontWeight: 500}}>Payment Confirmed</h2>
                        <div style={{color: '#4caf50', margin: '8px 0'}}>ORDER #2039</div>
                        <button
                            className={css.primary}
                            style={{marginTop: 24}}
                            onClick={() => {
                                navigate('/clothes/women');
                                setCartItems([]);
                            }}
                        >
                            Back to shopping
                        </button>
                    </div>
                </>)
                : (<>
                        <header className={css.divHeader}>
                            <span className={css.prev}>Cart</span>
                            <span> › </span>
                            <span className={css.prev}>Details</span>
                            <span> › </span>
                            <span className={css.active}>Shipping</span>
                            <span> › </span>
                            <span>Payment</span>
                        </header>
                        <div className={css.infoBox}>
                            <div className={css.infoRow}>
                                <span className={css.infoLabel}>Contact</span>
                                {contact}
                            </div>
                            <div className={css.infoRow}>
                                <span className={css.infoLabel}>Ship to</span>
                                {address}
                            </div>
                            <div className={css.infoRow}>
                    <span className={css.infoLabel}>
                        Method
                    </span>
                                {shipping === 'free' ? 'Standard Shipping' : 'Premium Shipping'}
                                {shipping === 'free' ? '- FREE' : `- ${getCurrency(currency)}${getPrice(4.99, currency)}`}
                            </div>
                        </div>
                        <div className={css.formHeader}>Payment method</div>
                        <form onSubmit={handleSubmit} style={{
                            background: '#fff',
                            border: '1px solid #cce5d6',
                            borderRadius: 6,
                            padding: 0,
                            maxWidth: 400,
                            marginBottom: 0,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: 0,
                                fontWeight: 600,
                                color: '#388e3c',
                                background: 'linear-gradient(90deg, #56B28033 20%, #56B28033 40%)',
                                borderTopLeftRadius: 6,
                                borderTopRightRadius: 6,
                                padding: '16px 24px',
                                fontSize: 17
                            }}>
                                <img src="/creditCard.svg" alt="Credit Card"
                                     style={{width: 28, height: 28, marginRight: 10}}/>
                                Credit Card
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: 14, padding: '24px'}}>
                                <div style={{position: 'relative'}}>
                                    <input name="number" type="text" placeholder="Card Number" value={card.number}
                                           onChange={handleCardChange} className={css.inputField} required/>
                                    <span style={{position: 'absolute', right: 8, top: 10, color: '#888'}}>
                            <svg width="18"
                                 height="18"
                                 fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                            <rect width="18" height="18" rx="3" fill="#bbb"/><path d="M6 9h6" stroke="#fff"
                                                                                   strokeWidth="2"/>
                            </svg>
                        </span>
                                    {errors.number && <div className={css.errorMsg}>{errors.number}</div>}
                                </div>
                                <div style={{position: 'relative'}}>
                                    <input name="name" type="text" placeholder="Holder Name" value={card.name}
                                           onChange={handleCardChange} className={css.inputField} required/>
                                    {errors.name && <div className={css.errorMsg}>{errors.name}</div>}
                                </div>
                                <div style={{display: 'flex', gap: 10}}>
                                    <div style={{position: 'relative', flex: 1}}>
                                        <input name="exp" type="text" placeholder="Expiration (MM/YY)" value={card.exp}
                                               onChange={handleCardChange} className={css.inputField} required/>
                                        {
                                            errors.exp
                                            && <div className={css.errorMsg}>
                                                {errors.exp}
                                            </div>
                                        }
                                    </div>
                                    <div style={{position: 'relative', flex: 1}}>
                                        <input name="cvv" type="text" placeholder="CVV" value={card.cvv}
                                               onChange={handleCardChange} className={css.inputField} required/>
                                        <span style={{
                                            position: 'absolute',
                                            right: 8,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#888',
                                            paddingRight: 0
                                        }}>
                                <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="9" cy="9" r="9" fill="#bbb"/>
                                    <text x="9" y="13" textAnchor="middle" fontSize="10" fill="#fff">
                                        i
                                    </text>
                                </svg>
                            </span>
                                        {errors.cvv && <div className={css.errorMsg}>{errors.cvv}</div>}
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className={css.buttonRow} style={{marginTop: 24, maxWidth: 400}}>
                            <button type="button" className={css.link}
                                    onClick={() => navigate('/checkout/shipping-method')}>Back to shipping
                            </button>
                            <button type="submit" className={css.primary} onClick={(e) => {
                                handleSubmit(e)
                            }}>Pay now
                            </button>
                        </div>
                    </>
                )
            }
        </div>
    )
}

function DisplayCart() {
    const {shipping} = useContext(shippingContext)
    const {cartItems, currency, getCurrency, getPrice} = useContext(context)
    const displayCartItems = () => {
        return Object.values(
            cartItems.reduce((acc, item) => {
                const key = item.id;

                if (!acc[key]) {
                    acc[key] = {...item}; // make a copy
                } else {
                    acc[key].quantity += item.quantity;
                }

                return acc;
            }, {})
        );
    }

    const getShippingType = () => {
        switch (shipping) {
            case 'free':
                return 'Free Shipping'
            case 'premium':
                return `${getCurrency(currency)}${getPrice(4.99, currency)}`
            default:
                return 'Shipping calculated at next step'
        }
    }

    const getTotal = () => {
        switch (shipping) {
            case 'free':
                return subTotal
            case 'premium':
                return subTotal + 4.99
            default:
                return subTotal
        }
    }

    const subTotal = cartItems.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0)

    return (
        <div className={css.cartContainer}>
            <div className={css.cartList}>
                {
                    displayCartItems().map((cartItem, index) => {
                        return (
                            <div key={index} className={css.cartItem}>
                                <div className={css.imgCont}>
                                    <img src={cartItem.image} alt='cartItemImage' className={css.cartItemImg}/>
                                    <div className={css.itemQnty}>
                                        {cartItem.quantity}
                                    </div>
                                </div>
                                <div className={css.detailContainer}>
                                    <h1 className={css.name}>
                                        {cartItem.name}
                                    </h1>
                                    <p className={css.price}>
                                        {getCurrency(currency)}{getPrice(cartItem.price, currency)}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={css.totalContainer}>
                <div className={css.separator}/>
                <div className={css.priceContainer}>
                    <p className={css.priceType}>
                        Subtotal:
                    </p>
                    <p className={css.price}>
                        {getCurrency(currency)}{getPrice(subTotal, currency)}
                    </p>
                </div>
                <div className={css.priceContainer}>
                    <p className={css.priceType}>
                        Shipping:
                    </p>
                    <p className={css.price}>
                        {getShippingType()}
                    </p>
                </div>
                <div className={css.separator}/>
                <div className={css.priceContainer}>
                    <p className={css.priceType}>
                        Total:
                    </p>
                    <p className={css.total}>
                        {getCurrency(currency)}{getPrice(getTotal(), currency)}
                    </p>
                </div>
            </div>
        </div>
    )
}