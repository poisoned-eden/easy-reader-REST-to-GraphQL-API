import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                bookCount
                bookIdArray
                savedBooks {
                    bookId
                    authors
                    description
                    title
                    image
                    link
                }   
            }
        }
}
`;

export const ADD_USER = gql`
    mutation AddUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
}
`;

// WORKS
export const SAVE_BOOK = gql`
    mutation SaveBook($bookData: bookInput!) {
        saveBook(bookData: $bookData) {
            _id
            username
            email
            bookCount
            bookIdArray
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;

//WORKS
export const REMOVE_BOOK = gql`
    mutation RemoveBook($bookId: ID!) {
        removeBook(bookId: $bookId) {
            _id
            username
            email
            bookCount
            bookIdArray
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;