import React, { useContext, useState } from 'react';
import css from './ShippingMethod.module.css';
import formCss from './Payment.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { context as CartContext } from '../Context.jsx';
import { CheckoutContext } from './ShippingInfo.jsx';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useContext(CartContext);
  const { shippingInfo } = useContext(CheckoutContext) || {};

  // get info from context 
  const info = (location.state && location.state.shippingInfo) || shippingInfo || {};
  const shippingMethod = (location.state && location.state.shippingMethod) || 'standard';
  const shippingLabel = shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping';
  const shippingPrice = shippingMethod === 'express' ? 4.99 : 0;

  const contact = info.contact || '';
  const address = [info.address, info.city, info.postal, info.province, info.country].filter(Boolean).join(', ');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingPrice;

  // payment form state
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

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
    const { name, value } = e.target;
    setCard(c => ({ ...c, [name]: value }));
    setErrors(errs => ({ ...errs, [name]: undefined }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className={css.container}>
        <div className={css.left}>
          <div className={css.breadcrumbs}>
            <span className={css.active}>Cart</span> <span>›</span> <span className={css.active}>Details</span> <span>›</span> <span className={css.active}>Shipping</span> <span>›</span> <span className={css.active}>Payment</span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60}}>
            <img src="/check.svg" alt="Success" style={{width: 100, height: 100, marginBottom: 24}} />
            <h2 style={{margin: 0, fontWeight: 500}}>Payment Confirmed</h2>
            <div style={{color: '#4caf50', margin: '8px 0'}}>ORDER #2039</div>
            <button className={css.primary} style={{marginTop: 24}} onClick={() => navigate('/clothes/women')}>Back to shopping</button>
          </div>
        </div>
        <div className={css.right}>
          {cartItems.length > 0 && (
            <div className={css.summary}>
              <div className={css.productRow}>
                <img src={cartItems[0].image} alt={cartItems[0].name} className={css.productImg} />
                <div>
                  <div className={css.productName}>{cartItems[0].name}</div>
                  <div className={css.productPrice}>$ {cartItems[0].price.toFixed(2)}</div>
                </div>
              </div>
              <div className={css.totals}>
                <div className={css.line}><span>Subtotal</span><span>$ {subtotal.toFixed(2)}</span></div>
                <div className={css.line}><span>Shipping</span><span>{shippingLabel === 'Standard Shipping' ? 'Free Shipping' : 'Express Shipping'}</span></div>
                <div className={css.line}><span>Paid</span><span className={css.total}>$ {total.toFixed(2)}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={css.container} style={{minHeight: '100vh'}}>
      <div className={css.left}>
        <div className={css.breadcrumbs}>
          <span className={css.active}>Cart</span> <span>›</span> <span className={css.active}>Details</span> <span>›</span> <span className={css.active}>Shipping</span> <span>›</span> <span className={css.active}>Payment</span>
        </div>
        <div className={css.infoBox}>
          <div className={css.infoRow}><span className={css.infoLabel}>Contact</span> {contact}</div>
          <div className={css.infoRow}><span className={css.infoLabel}>Ship to</span> {address}</div>
          <div className={css.infoRow}><span className={css.infoLabel}>Method</span> {shippingLabel} {shippingPrice === 0 ? '- FREE' : `- $${shippingPrice.toFixed(2)}`}</div>
        </div>
        <div className={formCss.formHeader}>Payment method</div>
        <form onSubmit={handleSubmit} style={{background: '#fff', border: '1px solid #cce5d6', borderRadius: 6, padding: 0, maxWidth: 400, marginBottom: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.03)'}}>
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
            <img src="/creditCard.svg" alt="Credit Card" style={{width: 28, height: 28, marginRight: 10}} />
            Credit Card
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 14, padding: '24px'}}>
            <div style={{position: 'relative'}}>
              <input name="number" type="text" placeholder="Card Number" value={card.number} onChange={handleCardChange} className={formCss.inputField} required />
              <span style={{position: 'absolute', right: 8, top: 10, color: '#888'}}><svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" rx="3" fill="#bbb"/><path d="M6 9h6" stroke="#fff" strokeWidth="2"/></svg></span>
              {errors.number && <div className={formCss.errorMsg}>{errors.number}</div>}
            </div>
            <div style={{position: 'relative'}}>
              <input name="name" type="text" placeholder="Holder Name" value={card.name} onChange={handleCardChange} className={formCss.inputField} required />
              {errors.name && <div className={formCss.errorMsg}>{errors.name}</div>}
            </div>
            <div style={{display: 'flex', gap: 10}}>
              <div style={{position: 'relative', flex: 2}}>
                <input name="exp" type="text" placeholder="Expiration (MM/YY)" value={card.exp} onChange={handleCardChange} className={formCss.inputField} required />
                {errors.exp && <div className={formCss.errorMsg}>{errors.exp}</div>}
              </div>
              <div style={{position: 'relative', flex: 1}}>
                <input name="cvv" type="text" placeholder="CVV" value={card.cvv} onChange={handleCardChange} className={formCss.inputField} required style={{paddingRight: 30}} />
                <span style={{position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#888'}}><svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="9" fill="#bbb"/><text x="9" y="13" textAnchor="middle" fontSize="10" fill="#fff">i</text></svg></span>
                {errors.cvv && <div className={formCss.errorMsg}>{errors.cvv}</div>}
              </div>
            </div>
          </div>
        </form>
        <div className={formCss.buttonRow} style={{marginTop: 24, maxWidth: 400}}>
          <button type="button" className={css.link} onClick={() => navigate('/checkout/shipping-method')}>Back to shipping</button>
          <button type="submit" className={css.primary} onClick={handleSubmit}>Pay now</button>
        </div>
      </div>
      <div className={css.right}>
        {cartItems.length > 0 && (
          <div className={css.summary}>
            <div className={css.productRow}>
              <img src={cartItems[0].image} alt={cartItems[0].name} className={css.productImg} />
              <div>
                <div className={css.productName}>{cartItems[0].name}</div>
                <div className={css.productPrice}>$ {cartItems[0].price.toFixed(2)}</div>
              </div>
            </div>
            <div className={css.totals}>
              <div className={css.line}><span>Subtotal</span><span>$ {subtotal.toFixed(2)}</span></div>
              <div className={css.line}><span>Shipping</span><span>{shippingLabel === 'Standard Shipping' ? 'Free Shipping' : 'Express Shipping'}</span></div>
              <div className={css.line}><span>Total</span><span className={css.total}>$ {total.toFixed(2)}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 