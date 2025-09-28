import { useMemo, useState } from "react";
import "./shop.css";
import ProductCard from "./ProductCard";
import FiltersModal, { type SortOption } from "./FiltersModal";

type Product = {
  id: string;
  name: string;
  price: string;
  image?: string; // optional for now; we can wire real images later
};

const Shop = () => {
  const [activeTab, setActiveTab] = useState<"stickers" | "cards">("stickers");

  const stickers: Product[] = useMemo(
    () => [
      { id: "st1", name: "Arcade Hero Sticker", price: "₹99" },
      { id: "st2", name: "Retro Console Sticker", price: "₹99" },
      { id: "st3", name: "Pixel Heart Sticker", price: "₹79" },
      { id: "st4", name: "8-bit Star Sticker", price: "₹79" },
      { id: "st5", name: "GameOver Sticker", price: "₹99" },
      { id: "st6", name: "Joystick Sticker", price: "₹99" },
    ],
    []
  );

  const cards: Product[] = useMemo(
    () => [
      { id: "tc1", name: "Arcade Legends - Series 1", price: "₹199" },
      { id: "tc2", name: "Boss Battles - Series 1", price: "₹249" },
      { id: "tc3", name: "Speedrun Champs - Series 1", price: "₹199" },
      { id: "tc4", name: "Power-Ups Holo - S1", price: "₹299" },
    ],
    []
  );

  const products = activeTab === "stickers" ? stickers : cards;

  const [sort, setSort] = useState<SortOption>("relevance");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const parsePrice = (val: string) => {
    const n = parseInt(val.replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
  };

  const numericMin = minPrice ? parseInt(minPrice, 10) : -Infinity;
  const numericMax = maxPrice ? parseInt(maxPrice, 10) : Infinity;

  const visibleProducts = useMemo(() => {
    let list = products.filter((p) => {
      const price = parsePrice(p.price);
      return price >= numericMin && price <= numericMax;
    });

    if (sort === "price-asc") {
      list = [...list].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, sort, minPrice, maxPrice]);

  const activeFilterCount = (sort !== "relevance" ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  return (
    <div className="shop-container">
      <div className="tabs" role="tablist" aria-label="Shop Categories">
        <button
          role="tab"
          aria-selected={activeTab === "stickers"}
          className={`tab ${activeTab === "stickers" ? "active" : ""}`}
          onClick={() => setActiveTab("stickers")}
        >
          Stickers
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "cards"}
          className={`tab ${activeTab === "cards" ? "active" : ""}`}
          onClick={() => setActiveTab("cards")}
        >
          Trading Cards
        </button>
      </div>

      {/* Filters trigger */}
      <div className="filters-trigger-row">
        <button
          className="btn filter-trigger"
          data-count={activeFilterCount > 0 ? activeFilterCount : undefined}
          onClick={() => setFiltersOpen(true)}
        >
          Filters
        </button>
        <div className="active-filters">
          {sort !== "relevance" && <span className="chip">Sort: {sort === "price-asc" ? "Low→High" : "High→Low"}</span>}
          {minPrice && <span className="chip">Min: ₹{minPrice}</span>}
          {maxPrice && <span className="chip">Max: ₹{maxPrice}</span>}
        </div>
      </div>

      {/* Modal */}
      <FiltersModal
        open={filtersOpen}
        sort={sort}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onClose={() => setFiltersOpen(false)}
        onApply={({ sort: s, minPrice: min, maxPrice: max }) => {
          setSort(s);
          setMinPrice(min);
          setMaxPrice(max);
          setFiltersOpen(false);
        }}
        onClear={() => {
          setSort("relevance");
          setMinPrice("");
          setMaxPrice("");
        }}
      />

      <div className="tab-content">
        <div className="products">
          {visibleProducts.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              price={p.price}
              image={p.image}
              onAddToCart={() => {/* hook up cart action here */}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
