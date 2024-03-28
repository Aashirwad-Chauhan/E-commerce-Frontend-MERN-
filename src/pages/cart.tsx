import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/cart-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import axios from "axios";
import { server } from "../redux/store";


const Cart = () => {

  const {
    cartItems, 
    subtotal, 
    tax, 
    total, 
    shippingCharges, 
    discount
  } = useSelector((state:{cartReducer: CartReducerInitialState})=>state.cartReducer);

  const dispatch = useDispatch();

  const [coupon, setCoupon] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem)=>{
    if(cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({...cartItem, quantity:cartItem.quantity+1}));
  };

  const decrementHandler = (cartItem: CartItem)=>{
    if(cartItem.quantity <= 1) return;
    dispatch(addToCart({...cartItem, quantity:cartItem.quantity-1}));
  };

  const removeHandler = (productId: string)=>{
    dispatch(removeCartItem(productId));
  };

  useEffect(()=>{

    const {token, cancel} = axios.CancelToken.source();

    const id = setTimeout(() => {

      axios.get(`${server}/api/v1/payment/couponapply?coupon=${coupon}`, {cancelToken: token})
      .then((res)=>{
        dispatch(discountApplied(res.data.discount));
        setIsValid(true);
        dispatch(calculatePrice());
      })
      .catch(()=>{
        dispatch(discountApplied(0));
        setIsValid(false);
        dispatch(calculatePrice());
      });

    }, 500);

    return()=>{
      clearTimeout(id);
      cancel();
      setIsValid(false);
    };
  }, [coupon]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
        <main>
          {cartItems.length > 0 ? (cartItems.map((i, ind)=> 
            (<CartItemCard 
              key={ind} 
              cartItem={i}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
            ))) :
            (<h1>Cart is empty!</h1>) 
          }
        </main>
        <aside>
          <p>Subtotal: ₹{subtotal}</p>
          <p>Shipping Charges: ₹{shippingCharges}</p>
          <p>Tax: ₹{tax}</p>
          <p>Discount: <em className="red"> -₹{discount} </em> </p>
          <p> <b>Total: ₹{total} </b> </p> 

          <input 
            type="text" 
            placeholder="Apply Coupon"
            value={coupon} 
            onChange={(e)=>setCoupon(e.target.value)} 
          />

          {
            coupon && (
              isValid ? (
                <span className="green">
                  Congrats! You get additional ₹{discount} off!
                  {/* <code> {coupon}</code> */}
                </span>) : (
                <span className="red">
                  Invalid Coupon! <VscError />
                </span>
            ))
          }

          {
            cartItems.length > 0 && 
            <Link to="/shipping" >Checkout!</Link>
          }

        </aside>
    </div>
  );
};

export default Cart;
