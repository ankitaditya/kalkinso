import React from "react";
import { Button } from "@carbon/react";

const ProductCard = ({ product, onEdit, onBuy }) => {
  const { description ,key } = product;

  return (
    <div
      style={{
        // border: "1px solid #ddd",
        // borderRadius: "8px",
        // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        // padding: "1rem",
        margin: "0",
        // backgroundColor: "",
      }}
    >
        {/* Product Description */}
      <p
        style={{
          fontSize: "1rem",
          color: "#555",
          margin: "0 0 0.5rem",
        }}
      >
        {description}
      </p>

      {/* Bottom Tray */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        //   borderTop: "1px solid #eee",
          position: "absolute",
          top: "10rem",
          right: "1rem",
        //   margin: "auto",
          paddingTop: "0.75rem",
        }}
      >
        <Button
          kind="ghost"
          style={{ color: "black"}}
          onClick={() => onEdit(key)}
        >
          Edit
        </Button>
        <Button
          kind="ghost"
          style={{ color: "black"}}
          onClick={() => onBuy(key)}
        >
          Buy
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
