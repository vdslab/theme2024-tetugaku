import React, { useEffect, useState } from "react";
import "/styles/book-shelf.css";

const my_api_key = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

const BookShelf = ({ processed_data, nodeId }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authorChain, setAuthorChain] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!nodeId) return;

      // 選択された著者とその関連著者のチェーンを作成
      const createAuthorChain = () => {
        const selectedAuthor = processed_data.names.find(
          (e) => e.name_id === nodeId
        );

        if (!selectedAuthor) return [];

        const relatedLinks = processed_data.links.filter((link) => {
          return link.source.id === nodeId;
        });

        const relatedIds = relatedLinks.map((link) => link.target.id);

        const relatedAuthors = relatedIds
          .map((id) => processed_data.names.find((name) => name.name_id === id))
          .filter((author) => author);

        const chain = [selectedAuthor, ...relatedAuthors];
        return chain;
      };

      const authorChain = createAuthorChain();
      setAuthorChain(authorChain);

      setLoading(true);
      setError(null);

      try {
        const allBooksData = await Promise.all(
          authorChain.map(async (author) => {
            const authorBooks = processed_data.books.filter(
              (book) => book.name_id === author.name_id
            );

            if (!authorBooks.length) {
              return {
                author: author.name,
                books: [],
              };
            }

            const bookPromises = authorBooks.map(async (book) => {
              const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes/${book.book_id}?key=${my_api_key}`
              );
              if (!response.ok) {
                throw new Error(`Failed to fetch book: ${book.book_id}`);
              }
              return response.json();
            });

            const booksData = await Promise.all(bookPromises);

            const formattedBooks = booksData
              .filter((book) => book.volumeInfo.imageLinks?.thumbnail)
              .map((book) => ({
                id: book.id,
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors || [],
                thumbnail: book.volumeInfo.imageLinks.thumbnail,
                link: `https://books.google.co.jp/books/about/?id=${book.id}`,
              }));

            return {
              author: author.name,
              books: formattedBooks,
            };
          })
        );

        setBooks(allBooksData);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("本の情報を取得できませんでした");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [nodeId, processed_data]);

  if (loading) {
    return <div className="loading-message">読み込み中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!nodeId) {
    return <div className="p-4">ノードを選択してください</div>;
  }

  return (
    <div className="book-shelf-container">
      {books.map((authorData, index) => (
        <div key={index} className="author-section">
          <h2 className="author-name">{authorData.author}</h2>
          {authorData.books.length > 0 ? (
            <div className="book-shelf-grid">
              {authorData.books.map((book) => (
                <div key={book.id} className="book-item">
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="book-link"
                  >
                    <div className="book-image-container">
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="book-image"
                      />
                    </div>
                    <h3 className="book-title">{book.title}</h3>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-books-message">著作がありません</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookShelf;
