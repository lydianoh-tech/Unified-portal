import { Link, useParams } from "react-router-dom";
import { products } from "../../data/products";

export default function ProductPage() {
  const { productId } = useParams();

  const product = products.find(
    (item) => item.id === productId
  );

  if (!product) {
    return (
      <main>
        <h1>Product Not Found</h1>

        <p>
          We couldn't find the product you're looking for.
        </p>

        <Link to="/marketplace">
          Return to Marketplace
        </Link>
      </main>
    );
  }

  return (
    <main>
      <div>
        <img
          src={product.image}
          alt={product.name}
        />
      </div>

      <div>
        <span>LOVE LILY BEAUTY</span>

        <h1>{product.name}</h1>

        <p>{product.description}</p>

        <strong>
          ${product.price.toFixed(2)}
        </strong>

        <button type="button">
          Add to Cart
        </button>

        <Link to="/marketplace">
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}