import React, { useEffect, useState } from "react";
import "/styles/book-shelf.css";

const BookShelf = ({ processed_data, nodeId }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 著作名
  const [selectedAuthor, setSelectedAuthor] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      if (!nodeId) return;

      // 選択された著者名を取得
      const nodeName = processed_data.names.find(
        (e) => e.name_id === nodeId
      )?.name;
      if (!nodeName) return;
      setSelectedAuthor(nodeName);

      // 選択されたノードのbook_idを取得
      const nodeBooks = processed_data.books.filter(
        (book) => book.name_id === nodeId
      );
      if (!nodeBooks.length) {
        setBooks([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 各book_idに対してGoogle Books APIを呼び出す
        const bookPromises = nodeBooks.map(async (book) => {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${book.book_id}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch book: ${book.book_id}`);
          }
          return response.json();
        });

        // すべての本の情報を取得
        const booksData = await Promise.all(bookPromises);

        // 必要なデータだけを抽出して整形
        const formattedBooks = booksData
          .filter((book) => book.volumeInfo.imageLinks?.thumbnail)
          .map((book) => ({
            id: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors || [],
            thumbnail: book.volumeInfo.imageLinks.thumbnail,
            link: book.volumeInfo.infoLink,
          }));
        setBooks(formattedBooks);
      } catch (err) {
        setError("本の情報を取得できませんでした");
        console.error("Error fetching books:", err);
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
    return <div>{error}</div>;
  }

  return (
    <div className="book-shelf-container">
      {selectedAuthor && (
        <h2 className="selected-author-name">{selectedAuthor}</h2>
      )}
      <div className="book-shelf-grid">
        {books.map((book) => (
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
        {books.length === 0 && !loading && (
          <div className="no-books-message">書籍が見つかりませんでした</div>
        )}
      </div>
    </div>
  );
};

export default BookShelf;
