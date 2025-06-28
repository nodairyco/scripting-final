import React, {useContext, useState, createContext} from 'react';
import css from './Shipping.module.css';
import formCss from './ShippingInfo.module.css';
import {context as CartContext} from '../Context.jsx';
import {useNavigate} from 'react-router-dom';
import data from '../data/data.json';

export const CheckoutContext = createContext();

export default function ShippingInfo() {
    const {cartItems} = useContext(CartContext);
    const [form, setForm] = useState({
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
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
            navigate('/checkout/shipping-method', {state: {shippingInfo: form}});
        }
    };

    return (
        <CheckoutContext.Provider value={{shippingInfo: form, setShippingInfo: setForm}}>
            <div className={css.container}>
                <div className={css.left}>
                    <div className={css.breadcrumbs}>
                        <span className={css.active}>Cart</span> <span>›</span> <span
                        className={css.active}>Details</span> <span>›</span> <span>Shipping</span> <span>›</span>
                        <span>Payment</span>
                    </div>
                    <form className={css.form} onSubmit={handleSubmit}>
                        <div className={formCss.formHeader}>Contact</div>
                        <input name="contact" type="text" placeholder="Email or mobile phone number"
                               value={form.contact} onChange={handleChange} className={formCss.inputField}/>
                        {errors.contact && <div className={formCss.errorMsg}>{errors.contact}</div>}
                        <div className={formCss.formHeader} style={{marginTop: 8}}>Shipping Address</div>
                        <div className={formCss.inputRow}>
                            <div style={{flex: 1}}>
                                <input name="name" type="text" placeholder="Name" value={form.name}
                                       onChange={handleChange} className={formCss.inputField}/>
                                {errors.name && <div className={formCss.errorMsg}>{errors.name}</div>}
                            </div>
                            <div style={{flex: 1}}>
                                <input name="secondName" type="text" placeholder="Second Name" value={form.secondName}
                                       onChange={handleChange} className={formCss.inputField}/>
                                {errors.secondName && <div className={formCss.errorMsg}>{errors.secondName}</div>}
                            </div>
                        </div>
                        <input name="address" type="text" placeholder="Address and number" value={form.address}
                               onChange={handleChange} className={formCss.inputField}/>
                        {errors.address && <div className={formCss.errorMsg}>{errors.address}</div>}
                        <input name="note" type="text" placeholder="Shipping note (optional)" value={form.note}
                               onChange={handleChange} className={formCss.inputField}/>
                        <div className={formCss.inputRow}>
                            <div style={{flex: 1}}>
                                <input name="city" type="text" placeholder="City" value={form.city}
                                       onChange={handleChange} className={formCss.inputField}/>
                                {errors.city && <div className={formCss.errorMsg}>{errors.city}</div>}
                            </div>
                            <div style={{flex: 1}}>
                                <input name="postal" type="text" placeholder="Postal Code" value={form.postal}
                                       onChange={handleChange} className={formCss.inputField}/>
                                {errors.postal && <div className={formCss.errorMsg}>{errors.postal}</div>}
                            </div>
                            <div style={{flex: 1}}>
                                <select
                                    name="province"
                                    value={form.province}
                                    onChange={handleChange}
                                    className={formCss.inputField}
                                    disabled={!form.country}
                                >
                                    <option value="">Select region/province</option>
                                    {regionList.map(region => (
                                        <option key={region.shortCode || region.name}
                                                value={region.name}>{region.name}</option>
                                    ))}
                                </select>
                                {errors.province && <div className={formCss.errorMsg}>{errors.province}</div>}
                            </div>
                        </div>
                        <select
                            name="country"
                            value={form.country}
                            onChange={e => {
                                handleChange(e);
                                setForm(f => ({...f, province: ''})); // reset province when country changes
                            }}
                            className={formCss.inputField}
                        >
                            <option value="">Select country/region</option>
                            {countryList.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                        {errors.country && <div className={formCss.errorMsg}>{errors.country}</div>}
                        <div className={css.checkboxRow}>
                            <input name="saveInfo" type="checkbox" checked={form.saveInfo} onChange={handleChange}/>
                            <label htmlFor="saveInfo">Save this informations for a future fast checkout</label>
                        </div>
                        <div className={formCss.buttonRow}>
                            <button type="button" className={css.link} onClick={() => navigate('/cart')}>Back to cart
                            </button>
                            <button type="submit" className={css.primary}>Go to shipping method</button>
                        </div>
                    </form>
                </div>
                <div className={css.right}>
                    {cartItems.length > 0 && (
                        <div className={css.summary}>
                            <div className={css.productRow}>
                                <img src={cartItems[0].image} alt={cartItems[0].name} className={css.productImg}/>
                                <div>
                                    <div className={css.productName}>{cartItems[0].name}</div>
                                    <div className={css.productPrice}>$ {cartItems[0].price.toFixed(2)}</div>
                                </div>
                            </div>
                            <div className={css.totals}>
                                <div className={css.line}><span>Subtotal</span><span>$ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className={css.line}><span>Shipping</span><span>Calculated at the next step</span>
                                </div>
                                <div className={css.line}><span>Total</span><span
                                    className={css.total}>$ {subtotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CheckoutContext.Provider>
    );
} 