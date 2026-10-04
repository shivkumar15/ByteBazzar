import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import api from "../api/axios";
import { getUserId, notifyCartChanged } from "./session";
import { useToast } from "./useToast";

export function useAddToCart() {
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [busyId, setBusyId] = useState(null);

  const add = async (product) => {
    const userId = getUserId();
    if (!userId) {
      push("Log in to add items to your cart.", "info");
      navigate("/login", { state: { from: location.pathname + location.search } });
      return false;
    }
    setBusyId(product._id);
    try {
      await api.post("/cart/add", { userId, productId: product._id });
      notifyCartChanged();
      push(`${product.title} added to your cart`, "success", { label: "View cart", to: "/cart" });
      return true;
    } catch {
      push("Couldn't add this item. Try again.", "error");
      return false;
    } finally {
      setBusyId(null);
    }
  };

  return { add, busyId };
}
