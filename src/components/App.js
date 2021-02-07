import React from 'react';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache
} from '@apollo/client';

import ListDisplay from './ListDisplay';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache()
});

const App = () => {
    return (
        <ApolloProvider client={client}>
            <div>
                <ListDisplay />
            </div>
        </ApolloProvider>
    )
}

export default App;