import type { Config } from '@jest/types';
import 'identity-obj-proxy';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['**/__tests__/**/*.spec.ts?(x)', '**/?(*.)+(test).ts?(x)'],
    moduleNameMapper: {
        '\\.(scss)$': 'identity-obj-proxy',
    },
};

export default config;
