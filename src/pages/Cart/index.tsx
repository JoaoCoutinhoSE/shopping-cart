import { useState } from "react";
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";

import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../util/format";
import { Container, ProductTable, Total } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (props: Product): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();
  const [productCounter, setProductCounter] = useState(0);

  const cartFormatted = cart.map((product: Product) => {
    formatPrice(product.price);
  });
  const total = formatPrice(
    cart.reduce((sumTotal, product) => {
      return sumTotal * product.amount;
    }, 0)
  );

  function handleProductIncrement(product: Product) {
    setProductCounter(product.amount + 1);
    updateProductAmount(productCounter as any);
  }

  function handleProductDecrement(product: Product) {
    setProductCounter(product.amount - 1);
    updateProductAmount(productCounter as any);
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          <tr data-testid="product">
            <td>
              <img src={props.image} alt="Tênis" />
            </td>
            <td>
              <strong>{props.title}</strong>
              <span>{formatPrice(props.price)}</span>
            </td>
            <td>
              <div>
                <button
                  type="button"
                  data-testid="decrement-product"
                  disabled={productCounter <= 1}
                  onClick={() => handleProductDecrement(props)}
                >
                  <MdRemoveCircleOutline size={20} />
                </button>
                <input
                  type="text"
                  data-testid="product-amount"
                  readOnly
                  value={productCounter}
                />
                <button
                  type="button"
                  data-testid="increment-product"
                  onClick={() => handleProductIncrement(props)}
                >
                  <MdAddCircleOutline size={20} />
                </button>
              </div>
            </td>
            <td>
              <strong>{total}</strong>
            </td>
            <td>
              <button
                type="button"
                data-testid="remove-product"
                onClick={() => handleRemoveProduct(props.id)}
              >
                <MdDelete size={20} />
              </button>
            </td>
          </tr>
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{cartFormatted}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
