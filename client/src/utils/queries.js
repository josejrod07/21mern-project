import { gql } from '@apollo/client';

// query to retrieve logged in user's information (needs to be authenticated in order to run this query)
export const QUERY_ME = gql`
    {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                image
                description
                title
                link
            }
        }
    }
`;