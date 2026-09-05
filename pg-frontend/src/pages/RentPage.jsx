import { useEffect, useState } from "react";
import API from "../api/api";

export default function RentPage() {
  const [rents, setRents] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const load = async () => {
    try {
      const res = await API.get("/rent/my");
      setRents(res.data || []);
    } catch (err) {
      console.error("Failed to load rents:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ============================================================
  // LOAD RAZORPAY CHECKOUT SCRIPT
  // ============================================================

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // ============================================================
  // PAY RENT USING RAZORPAY
  // ============================================================

  const pay = async (rent) => {
    try {
      setLoadingId(rent._id);

      // 1. Load Razorpay checkout
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert(
          "Razorpay checkout failed to load. Please check your internet connection."
        );

        setLoadingId(null);
        return;
      }

      // 2. Create order on backend
      const orderResponse = await API.post(
        "/rent/create-order",
        {
          rentId: rent._id
        }
      );

      const orderData = orderResponse.data;

      // 3. Razorpay checkout options
      const options = {
        key: orderData.keyId,

        amount: orderData.amount,

        currency: orderData.currency,

        name: "StayEase",

        description:
          `Rent Payment - Room ${orderData.roomNumber} - ${orderData.month}`,

        order_id: orderData.orderId,

        prefill: {
          name: orderData.studentName,
          email: orderData.studentEmail
        },

        theme: {
          color: "#2563eb"
        },

        handler: async function (response) {
          try {
            // 4. Verify payment on backend
            const verifyResponse = await API.post(
              "/rent/verify-payment",
              {
                rentId: rent._id,
                razorpay_order_id:
                  response.razorpay_order_id,
                razorpay_payment_id:
                  response.razorpay_payment_id,
                razorpay_signature:
                  response.razorpay_signature
              }
            );

            if (verifyResponse.data.success) {
              alert(
                "✅ Rent payment successful!"
              );

              await load();
            } else {
              alert(
                "Payment verification failed."
              );
            }

          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert(
              error.response?.data?.message ||
              "Payment verification failed."
            );
          } finally {
            setLoadingId(null);
          }
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay checkout closed"
            );

            setLoadingId(null);
          }
        }
      };

      // 5. Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response.error
          );

          alert(
            response.error?.description ||
            "Payment failed."
          );

          setLoadingId(null);
        }
      );

      razorpay.open();

    } catch (error) {
      console.error(
        "Payment initialization error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to start payment."
      );

      setLoadingId(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">

      <img
        src="https://source.unsplash.com/1600x900/?rent,payment"
        alt="Rent payment background"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      <div className="absolute inset-0 bg-slate-950/70" />

      <div className="relative z-10 min-h-screen p-8">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-8 text-center">

            <p className="text-sm uppercase tracking-[0.35em] text-slate-200 opacity-80">
              My Rent
            </p>

            <h1 className="mt-4 text-4xl font-semibold text-white">
              Manage Your Rent Payments
            </h1>

            <p className="mt-2 text-lg text-slate-300">
              View your rent history and pay pending amounts.
            </p>

          </div>


          {/* RENT CARDS */}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {rents.map((r) => (

              <div
                key={r._id}
                className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15"
              >

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-2xl">
                  💰
                </div>


                <h3 className="mb-4 text-xl font-semibold text-white">
                  Room {r.room?.roomNumber || "-"}
                </h3>


                <div className="mb-4 space-y-2">

                  <p className="text-slate-300">
                    <span className="font-medium">
                      Month:
                    </span>{" "}
                    {r.month}
                  </p>


                  <p className="text-slate-300">
                    <span className="font-medium">
                      Amount:
                    </span>{" "}
                    ₹{r.amount}
                  </p>


                  <p className="text-slate-300">

                    <span className="font-medium">
                      Status:
                    </span>

                    <span
                      className={`ml-2 rounded-full px-2 py-1 text-xs font-semibold ${
                        r.status === "paid"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {r.status}
                    </span>

                  </p>

                </div>


                {/* PAY BUTTON */}

                {r.status === "pending" && (

                  <button
                    onClick={() => pay(r)}
                    disabled={loadingId === r._id}
                    className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition ${
                      loadingId === r._id
                        ? "cursor-not-allowed bg-slate-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >

                    {loadingId === r._id
                      ? "Opening Payment..."
                      : "Pay Rent"}

                  </button>

                )}


                {/* PAID */}

                {r.status === "paid" && (

                  <div className="w-full rounded-2xl bg-green-500/20 px-4 py-3 text-center text-sm font-semibold text-green-300">
                    ✅ Payment Completed
                  </div>

                )}

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}