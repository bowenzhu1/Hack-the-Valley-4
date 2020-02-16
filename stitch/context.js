import React from 'react';

const MongoContext = React.createContext(null);

export const withMongoDB = Component => props => (
    <MongoContext.Consumer>
        {mongodb => <Component {...props} mongodb={mongodb}/>}
    </MongoContext.Consumer>
);

export default MongoContext;