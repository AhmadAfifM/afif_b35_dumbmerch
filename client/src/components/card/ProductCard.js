import React from "react";
import { Link } from "react-router-dom";

import convertRupiah from "rupiah-format";

export default function ProductCard({ item }) {
  item.name =
    item.name.length >= 20 ? item.name.slice(0, 30) + " ..." : item.name;
  return (
    <Link to={`/product/` + item.id} style={{ textDecoration: "none" }}>
      <div className="card-product mt-3">
        <img
          src={item.image}
          className="img-fluid img-rounded"
          alt={item.name}
        />
        <div className="p-2">
          <div className="text-header-product-item">{item.name}</div>
          <div className="text-product-item">
            {convertRupiah.convert(item.price)}
          </div>
          <div className="text-product-item">
            Stock : {item.qty} | SKU : {item.sku}
          </div>
        </div>
      </div>
    </Link>
  );
}
