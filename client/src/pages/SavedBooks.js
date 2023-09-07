import React, { useState } from 'react';
import {
	Container,
	Card,
	Button,
	Row,
	Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
	
	// set up REMOVE_BOOK
	const [removeBook, { data: removeBookData, loading: removeBookLoading, error: removeBookError }] = useMutation(REMOVE_BOOK);
	// run QUERY_ME
	const { loading: queryMeLoading, error: queryMeError, data: queryMeData } = useQuery(QUERY_ME);
	
	const token = Auth.loggedIn() ? Auth.getToken() : null;
	
	if (!token) {
		return false;
	}
	
	if (queryMeLoading) return (<h2>Loading...</h2>);
	if (queryMeError) return (<h2>Error getting your data, please try to login again or clear your cache if this error persists.</h2>);

	const userData = queryMeData?.me || [];
	console.log(userData.bookCount);

  	// create function that accepts the book's mongo _id value as param and deletes the book from the user profile
	// TODO 
	const handleDeleteBook = async (bookId) => {
		const token = Auth.loggedIn() ? Auth.getToken() : null;
	
		if (!token) {
			return false;
		}

		await removeBook(bookId);
		if (removeBookError) throw new Error('something went wrong removing that book');
  	};

  	return (
    	<>
			<div fluid className="text-light bg-dark p-5">
				<Container>
				<h1>Viewing saved books!</h1>
				</Container>
			</div>
			<Container>
				<h2 className='pt-5'>
				{userData.bookCount
					? `Viewing ${userData.username}'s ${userData.bookCount} saved ${userData.bookCount === 1 ? 'book' : 'books'}:`
					: `You have no saved books ${userData.username}!`}
				</h2>
				<Row>
				{userData.savedBooks.map((book) => {
					return (
					<Col md="4" key={book.bookId}>
						<Card border='dark'>
						{book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
						<Card.Body>
							<Card.Title>{book.title}</Card.Title>
							<p className='small'>Authors: {book.authors}</p>
							<Card.Text>{book.description}</Card.Text>
							<Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
							Delete this Book!
							</Button>
						</Card.Body>
						</Card>
					</Col>
					);
				})}
				</Row>
			</Container>
		</>
 	);
};

export default SavedBooks;
