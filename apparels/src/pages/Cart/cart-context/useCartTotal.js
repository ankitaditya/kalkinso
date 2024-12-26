import { useCartContext } from './CartContextProvider';

const useCartTotal = () => {
  const { total, setTotal } = useCartContext();

  const updateCartTotal = (products) => {
    const productQuantity = products.reduce(
      (sum, product) => {
        sum += product.quantity;
        return sum;
      },
      0
    );

    const totalPrice = products.reduce((sum, product) => {
      sum += product.price * product.quantity;
      return sum;
    }, 0);

    const installments = products.reduce(
      (greater, product) => {
        greater =
          product.installments > greater ? product.installments : greater;
        return greater;
      },
      0
    );

    const total = {
      productQuantity,
      installments,
      totalPrice,
      currencyId: 'INR',
      currencyFormat: '₹',
    };

    setTotal(total);
  };

  return {
    total,
    updateCartTotal,
  };
};

export default useCartTotal;
