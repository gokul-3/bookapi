const mongoose = require("mongoose");

const express = require("express");

require("dotenv").config();

const ourApp = express();

const database = require("./database");

// const MONGO_URI =
//     "mongodb+srv://varun:varun@cluster0.j3qhs.mongodb.net/BookAPI?retryWrites=true&w=majority";

    mongoose
    .connect(
        process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex : true
        }
    )
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.log(err));



// const mongoDB = async () => {
//     await mongoose
//     .connect(
//         "mongodb+srv://varun:varun@cluster0.j3qhs.mongodb.net/BookAPI?retryWrites=true&w=majority",
//         {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             // useFindAndModify: false,
//             // useCreateIndex : true
//         }
//     )
//     .then(() => console.log("DB connected successfully"))
//     .catch((err) => console.log(err));
// };

// mongoDB();

ourApp.use(express.json());

ourApp.get("/", (request, response) => {
    response.json({ message: "Hello there" });
    const specificBook = database.books.filter((book) =>
        book.category.includes("tech")
    );
    console.log(specificBook);
});

// Route        -- books
// Des          -- to get all books
// Access       -- public
// Method       -- get
// Params       -- none
// Body         -- none

ourApp.get("/books", (req, res) => {
    res.json({ books: database.books });
});

// Route        -- books/:bookID
// Des          -- to get specific book based on ISBN
// Access       -- public
// Method       -- get
// Params       -- bookID
// Body         -- none

ourApp.get("/books/:bookID", (req, res) => {
    const specificBook = database.books.filter(
        (book) => book.ISBN == req.params.bookID
    );

    return res.json({ books: specificBook });
});

// Route        -- /books/c/:category
// Des          -- to get a list of books based on category
// Access       -- public
// Method       -- get
// Params       -- category
// Body         -- none

ourApp.get("/books/c/:category", (req, res) => {
    const specificBook = database.books.filter((book) =>
        book.category.includes(req.params.category)
    );

    console.log(specificBook);

    return res.json({ books: specificBook });
});

// Route        -- /books/a/:author
// Des          -- to get a list of books based author
// Access       -- public
// Method       -- get
// Params       -- author
// Body         -- none

ourApp.get("/books/a/:author", (req, res) => {
    const specificBook = database.books.filter((book) =>
        book.authors.indexOf(req.params.author)
    );
    console.log(specificBook);
    return res.json({ books: specificBook });
});

// Route        -- /books/new
// Des          -- Add a new book
// Access       -- public
// Method       -- post
// Params       -- none

ourApp.post("/books/new", (req, res) => {
    const { newBook } = req.body;
    console.log(newBook);
    database.books.push(newBook);
    return res.json(database.books);
});

// Route        -- /books/update
// Des          -- Update any details of a book
// Access       -- public
// Params       -- ISBN
// Method       -- PUT

ourApp.put("/books/update/:isbn", (req, res) => {
    const { updatedData } = req.body;
    const { isbn } = req.params;
    let updatedBook;

    const updatedBooks = database.books.map((book) => {
        if (book.ISBN == "12345ONE") {
            book.title = updatedData.title;
            return book;
        }
        return book;
    });

    return res.json(updatedBooks);
});

// Route        -- /bookAuthor/update
// Des          -- Update any details of a book authors
// Access       -- public
// Params       -- ISBN
// Method       -- PUT

ourApp.put("/bookAuthor/update/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { authorId } = req.body;

    const newBookArray = database.books.forEach((book) => {
        if (book.ISBN == isbn) {
            if (!book.authors.includes(authorId)) {
                book.authors.push(authorId);
                return book;
            }
            return book;
        }
        return book;
    });

    const newAuthorArray = database.authors.map((author) => {
        if (author.id == authorId) {
            if (!author.books.includes(isbn)) {
                author.books.push(isbn);
                return author;
            }
            return author;
        }
        return author;
    });

    return res.json({ newBookArray, newAuthorArray });
});

// Route        -- /book/delete/:isbn
// Des          -- Delete a book
// Access       -- public
// Params       -- ISBN
// Method       -- Delete

ourApp.delete("/book/delete/:isbn", (req, res) => {
    const { isbn } = req.params;
    console.log("isbn: ", isbn);
    const filterdBooks = database.books.filter((book) => book.ISBN == isbn);
    database.books = filterdBooks;
    return res.json(filterdBooks);
});

// Route        -- /author
// Des          -- to get a list of books based author
// Access       -- public
// Method       -- get
// Params       -- none
// Body         -- none

ourApp.get("/author", (req, res) => {
    const authorAll = database.authors;
    return res.json({ books: authorAll });
});

// Route        -- /author/:authorname
// Des          -- to get a specific author details based on name
// Access       -- public
// Method       -- get
// Params       -- authorname
// Body         -- none

ourApp.get("/author/:authorname", (req, res) => {
    const authorDetails = database.authors.filter(
        (author) => author.name == req.params.authorname
    );
    res.json({ author: authorDetails });
});

// Route        -- /author/new
// Des          -- Add a new author
// Access       -- public
// Method       -- post
// Params       -- none

ourApp.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;
    console.log(newAuthor);
    database.authors.push(newAuthor);

    return res.json(database.authors);
});

// Route        -- /author/updateName
// Des          -- update any detials of an author
// Access       -- public
// Method       -- post
// Params       -- id

ourApp.put("/author/updateName/:id", (req, res) => {
    const { id } = req.params;
    const { newData } = req.body;

    const authorUpdated = database.authors.map((author) => {
        if (author.id === parseInt(id)) {
            author.name = newData.name;
            return author;
        }
        return author;
    });

    return res.json({ authorUpdated: authorUpdated });
});

// Route        -- /author/delete/id
// Des          -- Delete a author
// Access       -- public
// Params       -- id
// Method       -- Delete

ourApp.delete("/author/delete/:id", (req, res) => {
    const { id } = req.params;

    const filteredAuthors = database.authors.filter(
        (author) => author.id !== parseInt(id)
    );

    database.authors = filteredAuthors;

    return res.json(database.authors);
});

// Route        -- /author/delete/book/:isbn/:id
// Des          -- Delete a book
// Access       -- public
// Params       -- ISBN, id
// Method       -- Delete

ourApp.delete("/author/delete/book/:isbn/:id", (req, res) => {
    const { isbn, id } = req.params;

    //updating book database object
    database.books.forEach((book) => {
        if (book.ISBN === isbn) {
            if (!book.authors.includes(parseInt(id))) {
                return book;
            }
            book.authors = book.authors.filter(
                (DatabaseId) => DatabaseId !== parseInt(id)
            );
            return book;
        }
        return book;
    });

    database.authors.forEach((author) => {
        if (author.id === parseInt(id)) {
            if (!author.books.includes(isbn)) {
                return;
            }
            author.books = author.books.filter((book) => book !== isbn);
            return author;
        }
        return author;
    });

    return res.json({ books: database.books, author: database.authors });
});

// Route        -- /publications
// Des          -- to get all publications
// Access       -- public
// Method       -- get
// Params       -- none
// Body         -- none

ourApp.get("/publications", (req, res) => {
    res.json({ publications: database.publications });
});

// Route        -- /publications/:pubname
// Des          -- to get all publications based on name
// Access       -- public
// Method       -- get
// Params       -- :pubname
// Body         -- none

ourApp.get("/publications/:pubname", (req, res) => {
    const publicationDetails = database.publications.filter(
        (pub) => pub.name == req.params.pubname
    );
    res.json({ publication: publicationDetails });
});

// Route        -- /publications/book/:bookname
// Des          -- to get list of publication based on a book
// Access       -- public
// Method       -- get
// Params       -- :bookname
// Body         -- none

ourApp.get("/publications/books/:bookname", (req, res) => {
    console.log(database.publications.books);

    const publicationDetails = database.publications.filter((pub) =>
        pub.books.includes(req.params.bookname)
    );
    res.json({ publication: publicationDetails });
});

// Route        -- /publications/new
// Des          -- to add a new publication
// Access       -- public
// Method       -- get
// Params       -- none
// Body         -- none

ourApp.post("/publications/new", (req, res) => {
    const { newPublication } = req.body;
    database.publications.push(newPublication);
    return res.json(database.publications);
});

// Route        -- /publications/updateName/:pubId
// Des          -- to change the name of the publication
// Access       -- public
// Method       -- put
// Params       -- :pubId

ourApp.put("/publications/updateName/:pubId", (req, res) => {
    const { pubId } = req.params;
    const { newName } = req.body;

    database.publications.forEach((publication) => {
        if (publication.id === parseInt(pubId)) {
            publication.name = newName;
            return publication;
        }
        return publication;
    });

    return res.json(database.publications);
});

// Route        -- /publications/addBook/:pubId
// Des          -- to change the name of the publication
// Access       -- public
// Method       -- put
// Params       -- :pubId

ourApp.put("/publications/addBook/:pubId", (req, res) => {
    const { pubId } = req.params;
    const { newBook } = req.body;
});

// Route        -- /publications/delete/:pubId
// Des          -- to delete a particular publication
// Access       -- public
// Method       -- put
// Params       -- :pubId

ourApp.delete("/publications/deletePub/:pubId", (req, res) => {
    const { pubId } = req.params;

    const updatedPubArray = database.publications.filter(
        (publication) => publication.id !== parseInt(pubId)
    );
    console.log(updatedPubArray);

    const updatedBooks = database.books.map((book) => {
        if (book.publication === parseInt(pubId)) {
            book.publication = 0;
            return book;
        }
        return book;
    });

    return res.json({ books: updatedBooks, publication: updatedPubArray });
});

// Route        -- /publications/deleteBook/:pubId/:isbn
// Des          -- to delete a book from a particular publication
// Access       -- public
// Method       -- put
// Params       -- :pubId/:isbn

ourApp.delete("/publications/deleteBook/:pubId/:isbn", (req, res) => {
    const { pubId, isbn } = req.params;

    const updatedPublication = database.publications.map((publication) => {
        if (publication.id === parseInt(pubId)) {
            if (publication.books.includes(isbn)) {
                const updatedBooks = publication.books.filter(
                    (book) => book !== isbn
                );
                publication.books = updatedBooks;
                return publication;
            }
            return publication;
        }

        return publication;
    });

    const updatedBooks = database.books.map((book) => {
        if (book.ISBN === isbn) {
            if (book.publication === parseInt(pubId)) {
                book.publication = 0;
                return book;
            }
            return book;
        }
        return book;
    });

    return res.json({ publication: updatedPublication, books: updatedBooks });
});

ourApp.listen(4000, () => {
    console.log("Server at 4000");
});
