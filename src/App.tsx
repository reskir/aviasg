import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useAppSelector } from './store';

const Products = React.lazy(() => import('./components/Products/Products'));
const Contact = React.lazy(() => import('./components/Contact/Contact'));
const Checkout = React.lazy(() => import('./components/Checkout/Checkout'));

const App = (): JSX.Element => {
    const { cart, contact, checkoutIsSuccessful } = useAppSelector(
        (state) => state.main
    );
    return (
        <div className="main">
            <React.Suspense fallback={'Loading'}>
                <Switch>
                    <Route
                        path="/success"
                        render={() => {
                            if (checkoutIsSuccessful) {
                                return <span>Thank you for buying!</span>;
                            }
                            return <Redirect to="/" />;
                        }}
                    />
                    <Route
                        path="/checkout"
                        render={() => {
                            if (cart.length && Object.keys(contact).length) {
                                return <Checkout />;
                            } else {
                                return <Redirect to="/" />;
                            }
                        }}
                    />
                    <Route
                        path="/contact"
                        render={() => {
                            if (cart.length) {
                                return <Contact />;
                            } else {
                                return <Redirect to="/" />;
                            }
                        }}
                    />
                    <Route path="/" component={Products} />
                </Switch>
            </React.Suspense>
        </div>
    );
};

export default App;
