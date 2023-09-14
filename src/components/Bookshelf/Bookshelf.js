import React from 'react';
import { useGlobalContext } from '../../context';
import Book from '../BookList/Book'; // Assuming you have a Book component
import './Bookshelf.css'; // Add appropriate styling if needed

const Bookshelf = () => {
    // const { bookshelf, removeFromBookshelf } = useGlobalContext();
    const { bookshelf } = useGlobalContext();

    return (
        <div className="bookshelf">
            <h2>Your Bookshelf</h2>
            <div className="bookshelf-list">
                {bookshelf.map((book) => (
                    <div key={book.id} className="bookshelf-item">
                        <Book {...book} />
                        {/* <button onClick={() => removeFromBookshelf(book.id)}>
                            Remove from Bookshelf
                        </button> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bookshelf;
