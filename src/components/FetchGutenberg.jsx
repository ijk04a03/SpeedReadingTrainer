import { useEffect, useRef, useState } from "react";

const initialUrl = "https://gutendex.com/books/";
const textBaseUrl = "https://r.jina.ai/http://www.gutenberg.org";

async function fetchBooks(url, signal) {
    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
}

function getProxiedTextUrl(bookId) {
    return `${textBaseUrl}/cache/epub/${bookId}/pg${bookId}.txt`;
}

function FetchGutenberg({ onBookSelect }) {
    const [books, setBooks] = useState([]);
    const [nextUrl, setNextUrl] = useState(initialUrl);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedBook, setSelectedBook] = useState("");
    const [bookLoading, setBookLoading] = useState(false);
    const onBookSelectRef = useRef(onBookSelect);
    const searchRequestId = useRef(0);

    useEffect(() => {
        onBookSelectRef.current = onBookSelect;
    }, [onBookSelect]);

    async function selectBook(book) {
        const textUrl =
            book.formats["text/plain; charset=utf-8"] ||
            book.formats["text/plain"];

        if (!textUrl) {
            setError("This book does not have a readable text format.");
            return;
        }

        setSelectedBook(String(book.id));
        localStorage.setItem("speed-reading-selected-book", String(book.id));
        localStorage.setItem("speed-reading-selected-book-title", book.title);
        setBookLoading(true);
        setError("");

        try {
            const response = await fetch(getProxiedTextUrl(book.id));

            if (!response.ok) {
                throw new Error(`Book text is unavailable (${response.status}).`);
            }

            const text = await response.text();
            if (text.length <= 2_000_000) {
                localStorage.setItem(`speed-reading-book-${book.id}`, text);
            }
            onBookSelectRef.current(text, String(book.id), book.title);
        } catch (error) {
            setError(error.message);
        } finally {
            setBookLoading(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const requestId = searchRequestId.current + 1;
        searchRequestId.current = requestId;

        const timeoutId = setTimeout(async () => {
            const url = new URL(initialUrl);
            if (search.trim()) url.searchParams.set("search", search.trim());

            setLoading(true);
            setError("");
            setSelectedBook("");

            try {
                const data = await fetchBooks(url.toString(), controller.signal);
                if (searchRequestId.current !== requestId) return;
                setBooks(data.results);
                setNextUrl(data.next);

                if (!search.trim()) {
                    const savedBookId = localStorage.getItem("speed-reading-selected-book");
                    const savedBook = data.results.find((book) => String(book.id) === savedBookId);
                    const cachedText = savedBookId
                        ? localStorage.getItem(`speed-reading-book-${savedBookId}`)
                        : null;

                    if (savedBook && cachedText) {
                        setSelectedBook(savedBookId);
                        onBookSelectRef.current(cachedText, savedBookId, savedBook.title);
                    }
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [search]);

    async function loadMoreBooks() {
        if (!nextUrl || loading) return;

        setLoading(true);
        setError("");

        try {
            const data = await fetchBooks(nextUrl);
            setBooks((currentBooks) => [...currentBooks, ...data.results]);
            setNextUrl(data.next);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <input
                id="book-select"
                type="search"
                placeholder="Search books..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <div
                className="book-options"
                role="listbox"
                aria-label="Available books"
                onScroll={(event) => {
                    const list = event.currentTarget;
                    const reachedEnd =
                        list.scrollTop + list.clientHeight >=
                        list.scrollHeight - 10;

                    if (reachedEnd) {
                        loadMoreBooks();
                    }
                }}
            >
                {books.map((book) => (
                    <button
                        type="button"
                        role="option"
                        aria-selected={selectedBook === String(book.id)}
                        className={
                            selectedBook === String(book.id)
                                ? "selected"
                                : ""
                        }
                        key={book.id}
                        disabled={bookLoading}
                        onClick={() => selectBook(book)}
                    >
                        {book.title}
                    </button>
                ))}

                {loading && <p>Loading books...</p>}
                {bookLoading && <p>Loading book content...</p>}
                {error && <p role="alert">Error: {error}</p>}
                {!loading && !error && books.length === 0 && (
                    <p>No books found.</p>
                )}
            </div>

            <input type="hidden" name="Select Book" value={selectedBook} />
        </>
    );
}

export { FetchGutenberg };