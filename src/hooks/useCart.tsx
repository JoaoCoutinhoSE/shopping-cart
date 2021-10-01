import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const sendErrorToast = () => {
    return toast.error("Erro na alteração de quantidade do produto");
  };

  const addProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart];
      const foundItem = updatedCart.find((product) => product.id === productId);
      const itemAmount = foundItem ? foundItem.amount : 0;

      const stock = api.get<Product>(`/products/${productId}`);

      const stockAmount = (await stock).data.amount;
      const amount = itemAmount + 1;

      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
      }

      if (foundItem) {
        foundItem.amount = amount;
      } else {
        const item = api.get<Product>(`/products/${productId}`);

        const newItem = { ...(await item).data, amount: 1 };
        updatedCart.push(newItem);
      }

      setCart(updatedCart);
    } catch {
      sendErrorToast();
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      sendErrorToast();
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
