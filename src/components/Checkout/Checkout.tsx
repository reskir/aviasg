import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../store';
import {
    useGetProductsAndTaxInfoQuery,
    useBuyMutation,
    IUpdatedProduct,
} from '../../service';
import { setCheckoutIsSuccess, IContact } from '../../slices/main';

import styles from './Checkout.module.scss';

export const CheckoutSummary = ({
    products,
    contact,
    totalNetPrice,
    totalTaxes,
    totalPrice,
}: {
    products: IUpdatedProduct[];
    contact: IContact;
    totalNetPrice: number;
    totalTaxes: number;
    totalPrice: number;
}) => {
    return (
        <div className={styles.summary}>
            <div className={styles.element}>
                <h2>Products</h2>
                {products.map(({ id, title, price }) => {
                    return (
                        <div className={styles.item} key={id}>
                            <div>{title} </div>
                            <div>
                                <strong>{price.netTotal}</strong>{' '}
                                {price.currency}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className={styles.element}>
                <h2>Contacts</h2>
                <div className={styles.item}>
                    <div>Name:</div>
                    <div>
                        {contact.firstName} {contact.lastName}
                    </div>
                </div>
            </div>
            <div className={styles.element}>
                <h2>Price</h2>
                <div className={styles.item}>
                    <div>Product(s):</div>
                    <div>
                        <strong>{totalNetPrice}</strong> EUR
                    </div>
                </div>
                <div className={styles.item}>
                    <div>Taxes:</div>
                    <div>
                        <strong>{totalTaxes}</strong> EUR
                    </div>
                </div>
                <div className={styles.item}>
                    <div>Total:</div>
                    <div>
                        <strong>{totalPrice}</strong> EUR
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Checkout = (): JSX.Element => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { cart, contact } = useAppSelector((state) => state.main);
    const { data, isLoading } = useGetProductsAndTaxInfoQuery({});
    const products = data?.products || [];
    const taxInfo = data?.taxInfo;

    const [checkout, { isSuccess }] = useBuyMutation();

    useEffect(() => {
        if (isSuccess) {
            dispatch(setCheckoutIsSuccess(isSuccess));
            history.push('/success');
        }
    }, [isSuccess]);

    if (isLoading) {
        return <span>Loading...</span>;
    }

    const productsToBuy = products.filter(({ id }) => cart.includes(id));
    const totals = productsToBuy.reduce(
        ({ totalNetPrice, totalTaxes }, { price }) => ({
            totalNetPrice: totalNetPrice + price.netTotal,
            totalTaxes: totalTaxes + price.taxes,
        }),
        { totalNetPrice: 0, totalTaxes: 0 }
    );

    const totalNetPrice = Number(totals.totalNetPrice.toFixed(2));
    const totalTaxes = Number(totals.totalTaxes.toFixed(2));
    const totalPrice = Number((totalNetPrice + totalTaxes).toFixed(2));

    if (productsToBuy.length) {
        return (
            <>
                <CheckoutSummary
                    products={productsToBuy}
                    totalNetPrice={totalNetPrice}
                    totalTaxes={totalTaxes}
                    totalPrice={totalPrice}
                    contact={contact}
                />
                <button
                    onClick={() =>
                        checkout({
                            products: cart,
                            contact,
                            price: {
                                netTotal: totalNetPrice,
                                taxes: totalTaxes,
                                grossTotal: totalPrice,
                                currency: 'EUR',
                            },
                            taxInfo,
                        })
                    }
                >
                    Complete order
                </button>
            </>
        );
    }

    return null;
};

export default Checkout;
