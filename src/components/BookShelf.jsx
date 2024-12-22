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

      const nodeName = processed_data.names.find(
        (e) => e.name_id === nodeId
      )?.name;
      if (!nodeName) return;

      setSelectedAuthor(nodeName);
      setLoading(true);
      setError(null);

      try {
        // 20個リクエスト
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=inauthor:"${encodeURIComponent(
            nodeName
          )} "&maxResults=10&langRestrict=ja`
        );

        // if (!response.ok) {
        //   throw new Error("レスポンスの失敗");
        // }

        const data = await response.json();

        // サムネイルがある本を最大8冊
        const bookData =
          data.items
            ?.filter((item) => item.volumeInfo.imageLinks?.thumbnail)
            .slice(0, 8)
            .map((item) => ({
              id: item.id,
              title: item.volumeInfo.title,
              authors: item.volumeInfo.authors || [],
              thumbnail: item.volumeInfo.imageLinks.thumbnail,
              link: item.volumeInfo.infoLink,
            })) || [];

        setBooks(bookData);
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
