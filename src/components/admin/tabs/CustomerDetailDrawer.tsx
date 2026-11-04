import React, { useState } from "react";
import type {
  CustomerRecord,
  AdminOrderRecord,
  CustomOrderRecord,
} from "../../../types";
import { DemoStorage } from "../../../services/storage";
import { AccessibleDialog } from "../../common/AccessibleDialog";
import { FormField } from "../../common/FormField";
import { pkr, normalizePKPhone } from "../../../utils/commerce";
interface Props {
  customer: CustomerRecord | null;
  orders: AdminOrderRecord[];
  customOrders: CustomOrderRecord[];
  onClose: () => void;
  onCustomerUpdated: () => void;
}
export function CustomerDetailDrawer(props: Props) {
  return props.customer ? (
    <CustomerEditor
      key={props.customer.id}
      {...props}
      customer={props.customer}
    />
  ) : null;
}
function CustomerEditor({
  customer: c,
  orders,
  customOrders,
  onClose,
  onCustomerUpdated,
}: Props & { customer: CustomerRecord }) {
  const [name, setName] = useState(c.name),
    [city, setCity] = useState(c.city),
    [phone, setPhone] = useState(c.phone),
    [metal, setMetal] = useState(c.preferredMetal),
    [notes, setNotes] = useState(c.notes),
    [feedback, setFeedback] = useState("");
  const same = (p: string) =>
    p.replace(/\D/g, "").slice(-10) === c.phone.replace(/\D/g, "").slice(-10);
  const os = orders.filter((o) => same(o.customerPhone)),
    cs = customOrders.filter((o) => same(o.customerPhone));
  return (
    <AccessibleDialog title={`Customer · ${c.name}`} onClose={onClose} wide>
      <div className="form-stack">
        <p className="notice">
          Sample customer record. Use demo details only; access here is not
          server-side protection.
        </p>
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            try {
              if (!name.trim() || !normalizePKPhone(phone))
                throw new Error("Enter a name and valid Pakistani phone.");
              DemoStorage.saveCustomer({
                ...c,
                name: name.trim(),
                phone: normalizePKPhone(phone)!,
                city,
                preferredMetal: metal,
                notes,
              });
              onCustomerUpdated();
              setFeedback("Customer details saved in this browser.");
            } catch (e) {
              setFeedback((e as Error).message);
            }
          }}
        >
          <div className="form-grid">
            <FormField label="Customer name">
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>
            <FormField label="Phone">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormField>
            <FormField label="City">
              <input value={city} onChange={(e) => setCity(e.target.value)} />
            </FormField>
            <FormField label="Preferred metal">
              <input value={metal} onChange={(e) => setMetal(e.target.value)} />
            </FormField>
            <FormField label="Customer notes" className="full-width">
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormField>
          </div>
          {feedback && (
            <p className="text-sm" role="status">
              {feedback}
            </p>
          )}
          <button className="button-primary justify-self-start">
            Save customer details
          </button>
        </form>
        <section className="form-section">
          <h3>Order history · outstanding {pkr(c.outstandingBalancePKR)}</h3>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Fulfilment</th>
                </tr>
              </thead>
              <tbody>
                {os.map((o) => (
                  <tr key={o.orderReference}>
                    <td>{o.orderReference}</td>
                    <td>{o.confirmedDate.slice(0, 10)}</td>
                    <td>{pkr(o.agreedAmountPKR || 0)}</td>
                    <td>{o.paymentStatus || "Pending"}</td>
                    <td>{o.fulfilmentStatus || "New"}</td>
                  </tr>
                ))}
                {cs.map((o) => (
                  <tr key={o.id}>
                    <td>{o.reference}</td>
                    <td>{o.createdAt.slice(0, 10)}</td>
                    <td>{pkr(o.quotedAmountPKR)}</td>
                    <td>Deposit {pkr(o.depositPaidPKR)}</td>
                    <td>{o.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!os.length && !cs.length && (
              <p className="empty-state">No linked orders.</p>
            )}
          </div>
        </section>
      </div>
    </AccessibleDialog>
  );
}
