import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IContact {
    firstName: string;
    lastName: string;
    email: string;
}

interface MainState {
    cart: string[];
    contact: IContact;
    countryCode: string;
    checkoutIsSuccessful: boolean;
}

const initialState = {
    cart: [],
    contact: {},
    countryCode: '',
    checkoutIsSuccessful: false,
} as MainState;

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        addContact(state, action: PayloadAction<IContact>) {
            state.contact = action.payload;
        },
        addProduct(state, action: PayloadAction<string>) {
            state.cart.push(action.payload);
        },
        removeProduct(state, action: PayloadAction<string>) {
            state.cart = state.cart.filter((id) => id !== action.payload);
        },
        addCountryCode(state, action: PayloadAction<string>) {
            state.countryCode = action.payload;
        },
        setCheckoutIsSuccess(state, action: PayloadAction<boolean>) {
            state.checkoutIsSuccessful = action.payload;
        },
    },
});

export const {
    addProduct,
    removeProduct,
    addContact,
    addCountryCode,
    setCheckoutIsSuccess,
} = mainSlice.actions;
export default mainSlice.reducer;
