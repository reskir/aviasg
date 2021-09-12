import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IContact, addCountryCode } from './slices/main';
import { useAppDispatch } from './store';

const getClientCountyCode = async (): Promise<string | null> => {
    try {
        const response = await fetch(process.env.IP);
        const { country_code } = (await response.json()) as {
            country_code: string;
        };
        return country_code;
    } catch (error) {
        console.error(JSON.stringify(error));
        return null;
    }
};

interface IProduct {
    id: string;
    title: string;
    price: {
        amount: number;
        currency: string;
    };
}

export type IUpdatedProduct = Omit<IProduct, 'price'> & {
    price: {
        netTotal: number;
        taxes: number;
        grossTotal: number;
        currency: string;
    };
};

interface ITax {
    countryCode: string;
    rate: number;
}

interface IPrice {
    netTotal: number;
    taxes: number;
    grossTotal: number;
    currency: string;
}

interface IBuyPayload {
    products: string[];
    contact: IContact;
    price: IPrice;
    taxInfo: ITax;
}

interface ITax {
    countryCode: string;
    rate: number;
}

export const serviceApi = createApi({
    reducerPath: 'serviceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.API,
    }),
    endpoints: (builder) => ({
        getProductsAndTaxInfo: builder.query<
            {
                products: IUpdatedProduct[];
                taxInfo: ITax;
            },
            {}
        >({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                const { data: products } = (await fetchWithBQ(
                    'b5eb9a17-4e56-4841-bb9a-094cd3fcec96'
                )) as { data: IProduct[] };
                const { data: taxes } = (await fetchWithBQ(
                    'fdaf218e-8fb8-4548-92ce-1a505c81d9c8'
                )) as { data: ITax[] };

                const countryCode = await getClientCountyCode();
                const taxRate = countryCode
                    ? taxes.find(
                          ({ countryCode: code }) =>
                              code === countryCode.toLowerCase()
                      )?.rate || 0
                    : 0;

                const taxInfo = {
                    countryCode: countryCode || 'N/A',
                    rate: taxRate,
                };

                const updatedProducts = products.map(
                    ({ id, title, price: { amount } }) => {
                        const taxes =
                            taxRate > 0
                                ? Number(((amount * taxRate) / 100).toFixed(2))
                                : 0;
                        const grossTotal =
                            taxRate > 0
                                ? Number((amount + taxes).toFixed(2))
                                : amount;
                        return {
                            id,
                            title,
                            price: {
                                netTotal: amount,
                                taxes,
                                grossTotal,
                                currency: 'EUR',
                            },
                        };
                    }
                );
                return {
                    data: {
                        products: updatedProducts as IUpdatedProduct[],
                        taxInfo,
                    },
                };
            },
        }),
        getTaxes: builder.query<ITax[], {}>({
            query: () => 'fdaf218e-8fb8-4548-92ce-1a505c81d9c8',
        }),
        buy: builder.mutation<{}, IBuyPayload>({
            query: (data) => ({
                url: '240a6dfa-24d9-41b7-b224-ae870ddfbc95',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetProductsAndTaxInfoQuery,
    useGetTaxesQuery,
    useBuyMutation,
} = serviceApi;
