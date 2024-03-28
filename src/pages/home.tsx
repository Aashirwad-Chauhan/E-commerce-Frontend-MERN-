import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {

  const {data, isLoading, isError} = useLatestProductsQuery("");

  if(isError) toast.error("Can't Fetch the product from the DB!");

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem)=>{
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Product
        <Link to="/search" className="findmore" > More </Link>
      </h1>

      <main>
        
        {isLoading ? (<Skeleton />) : 

          (data?.products.map((i)=>(
            <ProductCard 
            key={i._id}
            productId={i._id}
            name={i.name}
            price={i.price}
            stock={i.stock}
            handler={addToCartHandler}
            photo={i.photo}
           
          />
          ))
        )}
      </main>


    </div>
  );
};

export default Home;
