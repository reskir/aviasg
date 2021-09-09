import { useHistory } from 'react-router-dom';
import { useGetProductsAndTaxInfoQuery } from '../../service';
import { addProduct, removeProduct } from '../../slices/main';
import { useAppDispatch, useAppSelector } from '../../store';

import styles from './Products.module.scss';

const Product = ({
    title,
    id,
    price,
    currency,
}: {
    title: string;
    id: string;
    price: number;
    currency: string;
}): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        main: { cart },
    } = useAppSelector((state) => state);

    return (
        <tr key={id}>
            <td>
                <div className={styles.productCheckboxContainer}>
                    <input
                        id={id}
                        name={id}
                        type="checkbox"
                        checked={cart.includes(id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) {
                                dispatch(addProduct(id));
                            } else {
                                dispatch(removeProduct(id));
                            }
                        }}
                    />
                    <label htmlFor={id}>{title}</label>
                </div>
            </td>
            <td>
                <strong>{price}</strong> {currency}
            </td>
        </tr>
    );
};

const Products = (): JSX.Element => {
    const history = useHistory();
    const { data, isLoading } = useGetProductsAndTaxInfoQuery({});
    const products = data?.products || [];

    const {
        main: { cart },
    } = useAppSelector((state) => state);

    if (isLoading) {
        return <span>Loading...</span>;
    }

    if (products.length) {
        return (
            <>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            return (
                                <Product
                                    key={product.id}
                                    title={product.title}
                                    id={product.id}
                                    currency={product.price.currency}
                                    price={product.price.netTotal}
                                />
                            );
                        })}
                    </tbody>
                </table>
                <button
                    disabled={!cart.length}
                    onClick={() => history.push('/contact')}
                >
                    Proceed
                </button>
            </>
        );
    }

    return <span>No products available</span>;
};

export default Products;
