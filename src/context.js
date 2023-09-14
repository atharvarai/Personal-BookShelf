import React, { useState, useContext, useEffect, useCallback } from 'react';

const URL = 'https://openlibrary.org/search.json?title=';
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('the lost world');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resultTitle, setResultTitle] = useState('');
    const [bookshelf, setBookshelf] = useState([]);
    const [searchResults, setSearchResults] = useState([]); // Add state for search results

    // Function to add a book to the bookshelf
    const addToBookshelf = (book) => {
        // Check if the book is already in the bookshelf
        if (!bookshelf.some((b) => b.id === book.id)) {
            // Add the book to the bookshelf
            setBookshelf([...bookshelf, book]);
            // Update localStorage with the new bookshelf data
            localStorage.setItem('bookshelf', JSON.stringify([...bookshelf, book]));
        }
    };

    // Function to remove a book from the bookshelf
    const removeFromBookshelf = (bookId) => {
        const updatedBookshelf = bookshelf.filter((book) => book.id !== bookId);
        setBookshelf(updatedBookshelf);
        // Update localStorage with the updated bookshelf data
        localStorage.setItem('bookshelf', JSON.stringify(updatedBookshelf));
    };

    // Load bookshelf data from localStorage on initial render
    useEffect(() => {
        const savedBookshelf = localStorage.getItem('bookshelf');
        if (savedBookshelf) {
            setBookshelf(JSON.parse(savedBookshelf));
        }
    }, []);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${URL}${searchTerm}&limit=10&page=1`);
            const data = await response.json();
            const { docs } = data;

            if (docs) {
                const newBooks = docs.map((bookSingle) => {
                    const { key, author_name, cover_i, edition_count, first_publish_year, title } = bookSingle;

                    return {
                        id: key,
                        author: author_name,
                        cover_id: cover_i,
                        edition_count: edition_count,
                        first_publish_year: first_publish_year,
                        title: title,
                    };
                });

                setBooks(newBooks);

                if (newBooks.length > 1) {
                    setResultTitle('Your Search Result');
                } else {
                    setResultTitle('No Search Result Found!');
                }
            } else {
                setBooks([]);
                setResultTitle('No Search Result Found!');
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchBooks();
    }, [searchTerm, fetchBooks]);

    // Function to fetch real-time search results
    const fetchRealTimeSearchResults = useCallback(async () => {
        try {
            const response = await fetch(`${URL}${searchTerm}&limit=5&page=1`);
            const data = await response.json();
            const { docs } = data;

            if (docs) {
                const newSearchResults = docs.map((bookSingle) => {
                    const { key, author_name, cover_i, edition_count, first_publish_year, title } = bookSingle;

                    return {
                        id: key,
                        author: author_name,
                        cover_id: cover_i,
                        edition_count: edition_count,
                        first_publish_year: first_publish_year,
                        title: title,
                    };
                });

                setSearchResults(newSearchResults);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.log(error);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (searchTerm) {
            fetchRealTimeSearchResults();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, fetchRealTimeSearchResults]);

    return (
        <AppContext.Provider
            value={{
                loading,
                books,
                setSearchTerm,
                resultTitle,
                setResultTitle,
                addToBookshelf,
                removeFromBookshelf,
                bookshelf,
                searchResults,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext);
};

export { AppContext, AppProvider };
