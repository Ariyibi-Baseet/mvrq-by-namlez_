import { Order } from "../types/order";

// TODO: replace with your real WhatsApp Business number.
// International format, digits only, NO "+", NO leading 0 on the local part.
// e.g. a Nigerian number 0801 234 5678 becomes "2348012345678".
// If you already use a number in WhatsAppFloat.tsx, copy that exact value here
// so both buttons message the same place.
export const WHATSAPP_NUMBER = "2348139419905";

const formatNaira = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

/** Builds the pre-filled message a customer sends after a successful payment. */
export const buildOrderWhatsAppMessage = (order: Order): string => {
  const itemLines = order.items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} — ${item.size}, ${item.color} × ${item.quantity} — ${formatNaira(
          item.price * item.quantity,
        )}`,
    )
    .join("\n");

  return [
    `Hi MVRQ! I've just completed payment for my order.`,
    ``,
    `*Order Reference:* ${order.reference}`,
    `*Name:* ${order.customer.fullName}`,
    `*Phone:* ${order.customer.phone}`,
    `*Delivery Address:* ${order.customer.address}, ${order.customer.city}`,
    order.customer.notes ? `*Notes:* ${order.customer.notes}` : null,
    ``,
    `*Items:*`,
    itemLines,
    ``,
    `*Total Paid:* ${formatNaira(order.amount)}`,
    ``,
    `Please confirm my order. Thank you!`,
  ]
    .filter((line) => line !== null)
    .join("\n");
};

/** wa.me deep link that opens WhatsApp with the message already filled in. */
export const buildOrderWhatsAppLink = (order: Order): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderWhatsAppMessage(order))}`;
