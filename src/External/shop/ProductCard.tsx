type ProductCardProps = {
  name: string;
  price: string;
  image?: string;
  onAddToCart?: () => void;
};

const ProductCard = ({ name, price, image, onAddToCart }: ProductCardProps) => {
  return (
    <div className="product-card">
      <div className="product-thumb" aria-hidden>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} />
        ) : (
          <div className="thumb-placeholder" />
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="product-meta">
          <span className="product-price">{price}</span>
        </div>
        <div className="product-actions">
          <button className="btn btn-primary btn-full" onClick={onAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
