import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MockProvider } from '@apollo/react-testing';

import { 
    ListDisplay,
    GET_DESSERT_DATA,
    ADD_DESSERT_MUTATION,
    REMOVE_DESSERT_MUTATION
} from '../src/components/ListDisplay';

import { mocks } from './mockData';

describe('ListDisplay', () => {
    afterEach(cleanup)
    it('should render list display', async () => {
        const { getByText } = render(
            <MockProvider mocks={mocks} addTypename={false}>
                <ListDisplay />
            </MockProvider>
        )
        screen.debug();
        expect(getByText("Nutrition List")).toMatchSnapshot();

    })
})