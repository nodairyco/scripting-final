import React, { useState, useContext } from 'react';
import css from './ShippingMethod.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { context } from '../Context.jsx';
import { CheckoutContext } from './ShippingInfo.jsx';

const shippingOptions = [
  { id: 'standard', label: 'Standard Shipping', price: 0 },
  { id: 'express', label: 'Express Shipping', price: 4.99 },
];

export default function ShippingMethod() {
  const [selected, setSelected] = useState('standard');
  const navigate = useNavigate();
  const { cartItems } = useContext(context);
  const { shippingInfo } = useContext(CheckoutContext) || {};
  const location = useLocation();

  // fallback to state if context is not available
  const info = shippingInfo || (location.state && location.state.shippingInfo) || {};

  const contact = info.contact || '';
  const address = [info.address, info.city, info.postal, info.province, info.country].filter(Boolean).join(', ');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = shippingOptions.find(opt => opt.id === selected)?.price || 0;
  const shippingLabel = selected === 'standard' ? 'Free Shipping' : 'Express Shipping';
  const total = subtotal + shippingPrice;

  return (
    <div className={css.container}>
      <div className={css.left}>
        <div className={css.breadcrumbs}>
          <span className={css.active}>Cart</span> <span>›</span> <span className={css.active}>Details</span> <span>›</span> <span className={css.active}>Shipping</span> <span>›</span> <span>Payment</span>
        </div>
        <div className={css.infoBox}>
          <div className={css.infoRow}><span className={css.infoLabel}>Contact</span> {contact}</div>
          <div className={css.infoRow}><span className={css.infoLabel}>Ship to</span> {address}</div>
        </div>
        <div style={{fontWeight: 600, fontSize: 18, marginBottom: 18}}>Shipping method</div>
        <div className={css.shippingMethods}>
          {shippingOptions.map(opt => (
            <div
              key={opt.id}
              className={css.methodOption + (selected === opt.id ? ' ' + css.selected : '')}
              onClick={() => setSelected(opt.id)}
            >
              <label className={css.methodLabel}>
                <input
                  type="radio"
                  checked={selected === opt.id}
                  onChange={() => setSelected(opt.id)}
                  style={{marginRight: 10}}
                />
                {opt.label}
              </label>
              <span className={opt.price === 0 ? css.methodPrice + ' ' + css.methodPriceFree : css.methodPrice}>
                {opt.price === 0 ? 'Free' : `${opt.price.toFixed(2)}$`}
              </span>
            </div>
          ))}
        </div>
        <div className={css.buttonRow}>
          <button className={css.link} onClick={() => navigate('/checkout/shipping-info')}>Back to details</button>
          <button className={css.primary} onClick={() => navigate('/checkout/payment', { state: { shippingInfo: info, shippingMethod: selected } })}>Go to payment</button>
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
              <div className={css.line}><span>Shipping</span><span>{shippingLabel}</span></div>
              <div className={css.line}><span>Total</span><span className={css.total}>$ {total.toFixed(2)}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 