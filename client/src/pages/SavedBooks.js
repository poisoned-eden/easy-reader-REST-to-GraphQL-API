import React, { useState, useEffect } from 'react';
import {
	Container,
	Card,
	Button,
	Row,
	Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';
// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  	// console.log(Auth.getProfile());
  	const { loading, error, data } = useQuery(QUERY_ME);

	if (loading) return (<h2>Loading through QUERY_ME</h2>);
	if (error) return (<h2>Error getting your data, please try and login again</h2>);
	
	const userData = data?.me || [];
	// TODO saved books into state
	// TODO useEffect function that rerenders when books held in state

  	// create function that accepts the book's mongo _id value as param and deletes the book from the user profile
	// TODO 
	const handleDeleteBook = async (bookId) => {
		
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
				{userData.savedBooks.length
					? `Viewing ${userData.username}'s ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
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
