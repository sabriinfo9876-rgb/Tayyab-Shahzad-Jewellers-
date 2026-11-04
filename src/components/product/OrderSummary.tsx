import React from "react";
import type { BagItem } from "../../types";
import { pkr } from "../../utils/commerce";
export function OrderItems({ items }: { items: BagItem[] }) {
  return (
    <div>
      {items.map((i, index) => (
        <article className="order-item" key={i.productId + "-" + index}>
          <img src={i.image} alt={i.name} width={76} height={88} />
          <div>
            <h3>{i.name}</h3>
            <p>
              {i.code} · Quantity {i.quantity}
            </p>
            {Object.entries(i.selectedOptions || {}).map(([key, value]) => (
              <small key={key}>
                {key}: {value}
              </small>
            ))}
            {i.purity && (
              <small>
                {i.purity}
                {i.weightGrams !== undefined
                  ? ` · ${i.weightGrams} g net metal per piece`
                  : ""}
              </small>
            )}
            {i.unitPricePKR !== undefined ? (
              <strong>
                {pkr(i.unitPricePKR * i.quantity)}{" "}
                <span className="font-normal text-xs">
                  ({pkr(i.unitPricePKR)} each)
                </span>
              </strong>
            ) : (
              <small>Included in the agreed order total</small>
            )}
            {(i.metalValuePKR ?? 0) > 0 && (
              <small>
                Per piece: metal {pkr(i.metalValuePKR || 0)} + making{" "}
                {pkr(i.makingValuePKR || 0)} + stones{" "}
                {pkr(i.stoneValuePKR || 0)}
              </small>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
export function OrderTotals({
  subtotal,
  delivery,
  tax,
  discount,
  total,
}: {
  subtotal?: number;
  delivery?: number;
  tax?: number;
  discount?: number;
  total: number;
}) {
  return (
    <div className="order-totals">
      {subtotal !== undefined && (
        <>
          <div>
            <span>Subtotal</span>
            <span>{pkr(subtotal)}</span>
          </div>
          <div>
            <span>Delivery</span>
            <span>{pkr(delivery || 0)}</span>
          </div>
          <div>
            <span>Tax</span>
            <span>{pkr(tax || 0)}</span>
          </div>
          {!!discount && (
            <div>
              <span>Discount</span>
              <span>−{pkr(discount)}</span>
            </div>
          )}
        </>
      )}
      <div className="grand-total">
        <span>Total</span>
        <span>{pkr(total)}</span>
      </div>
    </div>
  );
}
