import React, { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';

import Auth from '../utils/auth';
import { QUERY_ME } from '../utils/queries';
import { useQuery, useMutation, makeVar } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { searchGoogleBooks } from '../utils/API';

const SearchBooks = () => {
	// create state for holding returned google api data
	const [searchedBooks, setSearchedBooks] = useState([]);

	// create state for holding our search field data
	const [searchInput, setSearchInput] = useState('');
	// set up SAVE_BOOK mutation for usage
	const [saveBook, { data, loading, error }] = useMutation(SAVE_BOOK);
	const savedBookIds = makeVar([]);
	// query me to get previously saved book ID's
	const { data: queryMeData } = useQuery(QUERY_ME);

	if (queryMeData) {
		const { savedBooks } = queryMeData.me;
		savedBooks.forEach(book => {
			savedBookIds([...savedBookIds(), book.bookId]);
		});

		console.log(savedBookIds());
		
	}
		
	// create method to search for books and set state on form submit
	const handleFormSubmit = async (event) => {
		event.preventDefault();
		
		if (!searchInput) {
			return false;
		}
		
		try {
			const response = await searchGoogleBooks(searchInput);
			
			if (!response.ok) {
				throw new Error('something went wrong!');
			}
			
			const { items } = await response.json();
			
			const bookData = items.map((book) => ({
				bookId: book.id,
				authors: book.volumeInfo.authors || ['No author to display'],
				title: book.volumeInfo.title,
				description: book.volumeInfo.description,
				image: book.volumeInfo.imageLinks?.thumbnail || '',
			}));

			setSearchedBooks(bookData);
			setSearchInput('');
		} catch (err) {
			console.error(err);
		}
	};
	
	// create function to handle saving a book to our database
	const handleSaveBook = async (bookId) => {

		// find the book in `searchedBooks` state by the matching id
		const bookInput = searchedBooks.find((book) => book.bookId === bookId);
		try {
			await saveBook({
			   variables: { bookData:  bookInput }
		   	});
		} catch (error) {
			throw new Error(error);
		}
	};

	return (
		<>
			<div className="text-light bg-dark p-5">
				<Container>
					<h1>Search for Books!</h1>
					<Form onSubmit={handleFormSubmit}>
						<Row>
							<Col xs={12} md={8}>
								<Form.Control
									name="searchInput"
									value={searchInput}
									onChange={(e) =>
										setSearchInput(e.target.value)
									}
									type="text"
									size="lg"
									placeholder="Search for a book"
									/>
							</Col>
							<Col xs={12} md={4}>
								<Button
									type="submit"
									variant="success"
									size="lg"
								>
									Submit Search
								</Button>
							</Col>
						</Row>
					</Form>
				</Container>
			</div>

			<Container>
				<h2 className="pt-5">
					{searchedBooks.length
						? `Viewing ${searchedBooks.length} results:`
						: 'Search for a book to begin'}
				</h2>
				<Row>
					{searchedBooks.map((book) => {
						return (
							<Col md="4" key={book.bookId}>
								<Card border="dark">
									{book.image ? (
										<Card.Img
											src={book.image}
											alt={`The cover for ${book.title}`}
											variant="top"
										/>
									) : null}
									<Card.Body>
										<Card.Title>{book.title}</Card.Title>
										<p className="small">
											Authors: {book.authors}
										</p>
										<Card.Text>
											{book.description}
										</Card.Text>
										{Auth.loggedIn() && (
											<Button
												disabled={savedBookIds()?.some(
													(savedBookId) =>
														savedBookId ===
														book.bookId
												)}
												className="btn-block btn-info"
												onClick={() =>
													handleSaveBook(book.bookId)
												}
											>
												{savedBookIds()?.some(
													(savedBookId) =>
														savedBookId ===
														book.bookId
												)
													? 'Saved!'
													: 'Save this Book!'}
											</Button>
										)}
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

export default SearchBooks;
