import React, {useContext, useState} from 'react';
import css from './Checkout.module.css';
import {useNavigate, useParams} from "react-router-dom";
import {context} from "../Context.jsx";
import data from '../data/data.json'

export default function Checkout() {

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
                return (<ShippingDetails setShippingInfo={setShippingInfo}/>)
            case 'shipping-method':
                return (
                    <ShippingMethod shippingInfo={shippingInfo} shipping={shippingStage} setShipping={setShipping}/>
                )
            case 'payment':
                return (<Payment/>)
        }
    }

    return (
        <main className={css.main}>
            {getShippingComponent(params.shippingStage)}
            <DisplayCart shipping={shipping}/>
        </main>
    );
}

function ShippingDetails({setShippingInfo}) {
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
                    <button type="button" className={css.link} onClick={() => navigate('/cart')}>Back to cart
                    </button>
                    <button type="submit" className={css.primary}>Go to shipping method</button>
                </div>
            </form>
        </div>
    )
}

function ShippingMethod({shippingInfo, shipping, setShipping}) {
    const {currency, getCurrency, getPrice} = useContext(context)
    const navigate = useNavigate();

    const contact = shippingInfo.contact || '';
    const address = [shippingInfo.address, shippingInfo.city, shippingInfo.postal, shippingInfo.province, shippingInfo.country].filter(Boolean).join(', ');

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
                    <label className={css.methodLabel}>
                        <input
                            type="radio"
                            checked={shipping === 'free'}
                            onChange={() => setShipping('free')}
                            style={{marginRight: 10}}
                        />
                        Standard Shipping
                    </label>
                    <span className={css.methodPrice}>
                        Free
                    </span>
                </div>
                <div className={css.methodOption}>
                    <label className={css.methodLabel}>
                        <input
                            type="radio"
                            checked={shipping === 'premium'}
                            onChange={() => setShipping('premium')}
                            style={{marginRight: 10}}
                        />
                        Standard Shipping
                    </label>
                    <span className={css.methodPrice}>
                        {getCurrency(currency)}{getPrice(4.99, currency)}
                    </span>
                </div>
                <div className={css.buttonRow}>
                    <button className={css.link} onClick={() => navigate('/checkout/shipping-info')}>Back to details
                    </button>
                    <button className={css.primary} onClick={() => navigate('/checkout/payment')}
                    disabled={() => {
                        return shipping !== 'free' && shipping !== 'premium';
                    }}>
                        Go to payment
                    </button>
                </div>
            </div>
        </div>
    )
}

function Payment() {
    return (
        <div className={css.contentDiv}>
            woah3
        </div>
    )
}

function DisplayCart({shipping}) {
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
                return `${getPrice(4.99, currency)}`
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
                        {getCurrency(currency)}{getShippingType()}
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