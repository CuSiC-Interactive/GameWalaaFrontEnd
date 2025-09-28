import { useEffect, useRef } from "react";

export type SortOption = "relevance" | "price-asc" | "price-desc";

type FiltersModalProps = {
  open: boolean;
  sort: SortOption;
  minPrice: string;
  maxPrice: string;
  onClose: () => void;
  onApply: (next: { sort: SortOption; minPrice: string; maxPrice: string }) => void;
  onClear: () => void;
};

const FiltersModal = ({ open, sort, minPrice, maxPrice, onClose, onApply, onClear }: FiltersModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // local temp state is not strictly necessary; we can control via form elements refs
  let nextSort = sort;
  let nextMin = minPrice;
  let nextMax = maxPrice;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="filters-title">Filters</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label htmlFor="m-sort">Sort</label>
            <select
              id="m-sort"
              className="select"
              defaultValue={sort}
              onChange={(e) => (nextSort = e.target.value as SortOption)}
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="m-min">Min Price (₹)</label>
            <input
              id="m-min"
              className="input"
              type="number"
              min={0}
              placeholder="0"
              defaultValue={minPrice}
              onChange={(e) => (nextMin = e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="m-max">Max Price (₹)</label>
            <input
              id="m-max"
              className="input"
              type="number"
              min={0}
              placeholder="1000"
              defaultValue={maxPrice}
              onChange={(e) => (nextMax = e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClear}>Clear</button>
          <button
            className="btn btn-primary"
            onClick={() => onApply({ sort: nextSort, minPrice: nextMin, maxPrice: nextMax })}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
