import { gql } from '@apollo/client';
// TODO check that id and name are all front end needs from user

export const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                name
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                name
            }
        }
    }
`;

// TODO check that this wants user to be returned
export const SAVE_BOOK = gql`
    mutation saveBook($bookData: BookInput!) {
        saveBook(bookData: $bookData) {
            user {
                _id
                username
                email
                bookCount
                savedBooks {
                    bookId
                    authors
                    descrition
                    title
                    image
                    link
                }   
            }
        }
    }
`;

export const DELETE_BOOK = gql`
    mutation removeBook($bookId: ID!) {
        removeBook(bookId: $bookId) {
            user {
                _id
                username
                email
                bookCount
                savedBooks {
                    bookId
                    authors
                    descrition
                    title
                    image
                    link
                }   
            }
        }
    }
`;