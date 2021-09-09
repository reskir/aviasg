import React from 'react';
import renderer from 'react-test-renderer';
import { CheckoutSummary } from '../Checkout';
import { products, contact } from './data';

test('renders checkout summary correctly', async () => {
    const component = renderer
        .create(
            <CheckoutSummary
                products={products}
                contact={contact}
                totalNetPrice={20.34}
                totalPrice={30.34}
                totalTaxes={10}
            />
        )
        .toJSON();
    expect(component).toMatchSnapshot();
});
