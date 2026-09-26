import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { payWithPaystack, generateReference } from "../../lib/paystack";

type Stage = "form" | "paying" | "verifying" | "success";

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    formatPrice,
    clearCart,
  } = useCart();

  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState("");
  const [orderReference, setOrderReference] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "Lagos",
    notes: "",
  });

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (subtotal <= 0 || cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const reference = generateReference();

    setStage("paying");
    let paystackReference: string;
    try {
      paystackReference = await payWithPaystack({
        email: formData.email,
        amountNaira: subtotal,
        reference,
        metadata: { fullName: formData.fullName, phone: formData.phone },
      });
    } catch (err) {
      // The customer closing the popup rejects too — treat that as "back to form", not an error.
      if (err instanceof Error && err.message !== "cancelled")
        setError(err.message);
      setStage("form");
      return;
    }

    setStage("verifying");
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: paystackReference,
          expectedAmountNaira: subtotal,
          customer: formData,
          items: cart.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
          })),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.verified) {
        setError(
          data.message ||
            "We could not confirm your payment. If you were charged, contact us with your reference so we can check.",
        );
        setStage("form");
        return;
      }

      setOrderReference(paystackReference);
      setStage("success");
      setTimeout(() => clearCart(), 1200);
    } catch {
      setError(
        "Network error while confirming your payment. If you were charged, contact us so we can check.",
      );
      setStage("form");
    }
  };

  const handleClose = () => {
    if (stage === "paying" || stage === "verifying") return; // don't let them close mid-payment
    setIsCheckoutOpen(false);
    setStage("form");
    setError("");
  };

  const busy = stage === "paying" || stage === "verifying";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-navy-900 light:bg-white border border-navy-800 light:border-slate-300 w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-100 light:text-navy-950">
        <button
          onClick={handleClose}
          disabled={busy}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white light:text-slate-600 focus:outline-none disabled:opacity-30"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {stage === "success" ? (
          <div className="text-center py-12 space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-superwide uppercase">
                PAYMENT CONFIRMED
              </h2>
              <p className="text-sm text-slate-400 font-mono">
                Order reference:{" "}
                <span className="text-electric-400">{orderReference}</span>
              </p>
              <p className="text-xs text-slate-300 light:text-slate-600 max-w-md mx-auto pt-2">
                Thank you for choosing MVRQ by naMLez. Your payment has been
                verified and our courier team in Lagos will reach out shortly
                via phone/WhatsApp.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs tracking-superwide uppercase px-8 py-3.5 rounded-full transition-all shadow-lg shadow-electric-500/25"
            >
              RETURN TO STORE
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-navy-800 light:border-slate-200 pb-4">
              <h2 className="text-xl font-bold tracking-mega uppercase text-slate-100 light:text-navy-950">
                MVRQ CHECKOUT
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Secure payment via Paystack
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Summary */}
              <div className="bg-navy-950/60 light:bg-slate-50 p-4 rounded-xl border border-navy-800 light:border-slate-200 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-superwide text-electric-400">
                  ORDER SUMMARY ({cart.reduce((a, b) => a + b.quantity, 0)}{" "}
                  ITEMS)
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200 light:text-navy-900">
                          {item.product.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.selectedSize} • {item.selectedColor} • x
                          {item.quantity}
                        </div>
                      </div>
                      <div className="font-mono text-slate-200 font-bold">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-navy-800 light:border-slate-200 pt-3 flex justify-between items-center font-mono text-sm">
                  <span className="text-slate-400">TOTAL AMOUNT</span>
                  <span className="font-bold text-electric-400 text-base">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              {/* Delivery Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <fieldset
                  disabled={busy}
                  className="space-y-4 disabled:opacity-60"
                >
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="e.g. Tunde Williams"
                      className="w-full bg-navy-950 light:bg-white border border-navy-800 light:border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="name@domain.com"
                        className="w-full bg-navy-950 light:bg-white border border-navy-800 light:border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+234 800 000 0000"
                        className="w-full bg-navy-950 light:bg-white border border-navy-800 light:border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="House number, street, city / state"
                      className="w-full bg-navy-950 light:bg-white border border-navy-800 light:border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono bg-navy-950/40 p-2.5 rounded-lg border border-navy-850">
                    <ShieldCheck className="w-4 h-4 text-electric-400 shrink-0" />
                    <span>
                      Payments are processed securely by Paystack. We never see
                      your card details.
                    </span>
                  </div>

                  {error && (
                    <div
                      className="flex items-start gap-2 text-[11px] text-rose-400 font-mono"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs tracking-superwide uppercase py-3.5 rounded-xl transition-all shadow-lg shadow-electric-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {stage === "paying" && (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> WAITING FOR
                        PAYMENT…
                      </>
                    )}
                    {stage === "verifying" && (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> CONFIRMING
                        PAYMENT…
                      </>
                    )}
                    {stage === "form" && <>PAY {formatPrice(subtotal)}</>}
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
