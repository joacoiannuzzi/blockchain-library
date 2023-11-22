import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Library } from "../typechain-types/Library";

function getBookAsObject(book: Library.BookStructOutput) {
  return {
    owner: book[0],
    title: book[1],
    author: book[2],
    genre: book[3],
    available: book[4],
  };
}

function getBooksAsObjects(books: Library.BookStructOutput[]) {
  return books.map(getBookAsObject);
}

describe("Library", function () {
  // This fixture deploys the contract and returns it
  const deploy = async () => {
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();

    // get the user's wallet
    const [owner, ...otherUsers] = await ethers.getSigners();

    return { library, owner, otherUsers };
  };

  it("Should deploy", async function () {
    const { library, owner } = await loadFixture(deploy);
    expect(await library.getAllBooks()).to.be.empty;
    expect(await library.getBooksByOwner(owner)).to.be.empty;
    expect(await library.bookCounter()).to.equal(0);
    expect(await library.ownerBookCounters(owner)).to.equal(0);
  });

  it("Should list a book", async function () {
    const { library, owner } = await loadFixture(deploy);
    const book = {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
    };

    await library.listBook(book.title, book.author, book.genre);

    const expectedBook = {
      owner: owner.address,
      title: book.title,
      author: book.author,
      genre: book.genre,
      available: true,
    };

    const books = getBooksAsObjects(await library.getAllBooks());

    expect(books).to.deep.contain(expectedBook);
    expect(books).to.have.lengthOf(1);
    expect(
      getBooksAsObjects(await library.getBooksByOwner(owner))
    ).to.deep.contain(expectedBook);
    expect(await library.bookCounter()).to.equal(1);
    expect(await library.ownerBookCounters(owner)).to.equal(1);
    expect(await library.userTokens(owner)).to.equal(10);

    // check that an event was emitted

    //   event BookListed(
    //     uint256 indexed bookId,
    //     address indexed owner,
    //     string title,
    //     string author,
    //     string genre
    // );

    const events = await library.queryFilter(library.filters.BookListed());
    expect(events).to.have.lengthOf(1);
    expect(events[0].args).to.deep.equal([
      0,
      owner.address,
      book.title,
      book.author,
      book.genre,
    ]);
  });

  it("Should list multiple books", async function () {
    const { library, owner } = await loadFixture(deploy);
    const books = [
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
      },
      {
        title: "The Da Vinci Code",
        author: "Dan Brown",
        genre: "Mystery",
      },
    ];

    for (const book of books) {
      await library.listBook(book.title, book.author, book.genre);
    }

    const expectedBooks = books.map((book) => ({
      owner: owner.address,
      title: book.title,
      author: book.author,
      genre: book.genre,
      available: true,
    }));

    const actualBooks = getBooksAsObjects(await library.getAllBooks());

    expect(actualBooks).to.deep.contain.members(expectedBooks);
    expect(actualBooks).to.have.lengthOf(expectedBooks.length);
    expect(
      getBooksAsObjects(await library.getBooksByOwner(owner))
    ).to.deep.contain.members(expectedBooks);
    expect(await library.bookCounter()).to.equal(expectedBooks.length);
    expect(await library.ownerBookCounters(owner)).to.equal(
      expectedBooks.length
    );
    expect(await library.userTokens(owner)).to.equal(30);

    // check that an event was emitted
    const events = await library.queryFilter(library.filters.BookListed());
    expect(events).to.have.lengthOf(books.length);
    for (const [index, event] of events.entries()) {
      expect(event.args).to.deep.equal([
        index,
        owner.address,
        books[index].title,
        books[index].author,
        books[index].genre,
      ]);
    }
  });

  it("Should transfer a book", async function () {
    const { library, otherUsers } = await loadFixture(deploy);

    const firstUser = otherUsers[0];
    const secondUser = otherUsers[1];
    const books = [
      {
        owner: firstUser,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
      },
      {
        owner: secondUser,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
      },
    ];

    for (const book of books) {
      await library
        .connect(book.owner)
        .listBook(book.title, book.author, book.genre);
    }

    expect(await library.bookCounter()).to.equal(2);
    expect(await library.ownerBookCounters(firstUser)).to.equal(1);
    expect(await library.ownerBookCounters(secondUser)).to.equal(1);
    expect(await library.userTokens(firstUser)).to.equal(10);
    expect(await library.userTokens(secondUser)).to.equal(10);

    await library.connect(secondUser).transferBook(0);

    expect(await library.bookCounter()).to.equal(2);
    expect(await library.ownerBookCounters(firstUser)).to.equal(
      0,
      "firstUser should have 0 books"
    );
    expect(await library.ownerBookCounters(secondUser)).to.equal(
      2,
      "secondUser should have 2 books"
    );
    expect(await library.userTokens(firstUser)).to.equal(20);
    expect(await library.userTokens(secondUser)).to.equal(0);

    const booksAfterTransfer = [
      {
        owner: secondUser.address,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        available: false,
      },
      {
        owner: secondUser.address,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
        available: true,
      },
    ];

    expect(getBooksAsObjects(await library.getBooksByOwner(firstUser))).to.be
      .empty;

    expect(
      getBooksAsObjects(await library.getBooksByOwner(secondUser))
    ).to.deep.equal(booksAfterTransfer);

    // check that an event was emitted

    //   event BookTransferred(
    //     uint256 indexed bookId,
    //     address indexed from,
    //     address indexed to
    // );

    const events = await library.queryFilter(library.filters.BookTransferred());
    expect(events).to.have.lengthOf(1);
    expect(events[0].args).to.deep.equal([
      0,
      firstUser.address,
      secondUser.address,
    ]);
  });

  it("Should not transfer a book if the book is not available", async function () {
    const { library, otherUsers } = await loadFixture(deploy);

    const firstUser = otherUsers[0];
    const secondUser = otherUsers[1];
    const books = [
      {
        owner: firstUser,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
      },
      {
        owner: secondUser,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
      },
    ];

    for (const book of books) {
      await library
        .connect(book.owner)
        .listBook(book.title, book.author, book.genre);
    }

    await library.connect(secondUser).transferBook(0);

    await expect(
      library.connect(secondUser).transferBook(0)
    ).to.be.revertedWith("Book is not available for transfer");
  });

  it("Should not transfer your own book", async function () {
    const { library, owner } = await loadFixture(deploy);

    const book = {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
    };

    await library.connect(owner).listBook(book.title, book.author, book.genre);

    await expect(library.connect(owner).transferBook(0)).to.be.revertedWith(
      "You can't transfer your own book"
    );
  });

  it("Should not transfer if you don't have enough tokens", async function () {
    const { library, otherUsers } = await loadFixture(deploy);

    const firstUser = otherUsers[0];
    const secondUser = otherUsers[1];
    const thirdUser = otherUsers[2];
    const books = [
      {
        owner: firstUser,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
      },
      {
        owner: secondUser,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
      },
      {
        owner: thirdUser,
        title: "The Da Vinci Code",
        author: "Dan Brown",
        genre: "Mystery",
      },
    ];

    for (const book of books) {
      await library
        .connect(book.owner)
        .listBook(book.title, book.author, book.genre);
    }

    await library.connect(secondUser).transferBook(0);

    await expect(
      library.connect(secondUser).transferBook(2)
    ).to.be.revertedWith("Insufficient tokens");
  });

  it("Should mark a book as available", async function () {
    const { library, otherUsers } = await loadFixture(deploy);

    const firstUser = otherUsers[0];
    const secondUser = otherUsers[1];
    const books = [
      {
        owner: firstUser,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
      },
      {
        owner: secondUser,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
      },
    ];

    for (const book of books) {
      await library
        .connect(book.owner)
        .listBook(book.title, book.author, book.genre);
    }

    await library.connect(secondUser).transferBook(0);

    expect(getBookAsObject(await library.books(0)).available).to.be.false;

    await library.connect(secondUser).makeBookAvailable(0);

    expect(getBookAsObject(await library.books(0)).available).to.be.true;

    // check that an event was emitted

    //   event BookAvailabilityChanged(
    //     uint256 indexed bookId,
    //     address indexed owner,
    //     bool available
    // );

    const events = await library.queryFilter(
      library.filters.BookAvailabilityChanged()
    );
    expect(events).to.have.lengthOf(1);
    expect(events[0].args).to.deep.equal([0, secondUser.address, true]);
  });

  it("Should not mark a book as available if it's already available", async function () {
    const { library, otherUsers } = await loadFixture(deploy);

    const firstUser = otherUsers[0];
    const secondUser = otherUsers[1];
    const books = [
      {
        owner: firstUser,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
      },
      {
        owner: secondUser,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
      },
    ];

    for (const book of books) {
      await library
        .connect(book.owner)
        .listBook(book.title, book.author, book.genre);
    }

    await expect(
      library.connect(firstUser).makeBookAvailable(0)
    ).to.be.revertedWith("Book is already available for transfer");
  });

  it("Should not mark a book as available if you don't own it", async function () {
    const { library, otherUsers } = await loadFixture(deploy);

    const firstUser = otherUsers[0];
    const secondUser = otherUsers[1];
    const books = [
      {
        owner: firstUser,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
      },
      {
        owner: secondUser,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
      },
    ];

    for (const book of books) {
      await library
        .connect(book.owner)
        .listBook(book.title, book.author, book.genre);
    }

    await library.connect(secondUser).transferBook(0);

    await expect(
      library.connect(firstUser).makeBookAvailable(0)
    ).to.be.revertedWith("You can't make someone else's book available");
  });

  it("Should mark a book as unavailable", async function () {
    const { library, otherUsers } = await loadFixture(deploy);

    const firstUser = otherUsers[0];
    const secondUser = otherUsers[1];
    const books = [
      {
        owner: firstUser,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
      },
      {
        owner: secondUser,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
      },
    ];

    for (const book of books) {
      await library
        .connect(book.owner)
        .listBook(book.title, book.author, book.genre);
    }

    expect(getBookAsObject(await library.books(0)).available).to.be.true;

    await library.connect(firstUser).makeBookUnavailable(0);

    expect(getBookAsObject(await library.books(0)).available).to.be.false;

    // check that an event was emitted

    const events = await library.queryFilter(
      library.filters.BookAvailabilityChanged()
    );
    expect(events).to.have.lengthOf(1);
    expect(events[0].args).to.deep.equal([0, firstUser.address, false]);
  });

  it("Should not mark a book as unavailable if it's already unavailable", async function () {
    const { library, otherUsers } = await loadFixture(deploy);

    const firstUser = otherUsers[0];
    const secondUser = otherUsers[1];
    const books = [
      {
        owner: firstUser,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
      },
      {
        owner: secondUser,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
      },
    ];

    for (const book of books) {
      await library
        .connect(book.owner)
        .listBook(book.title, book.author, book.genre);
    }

    await library.connect(firstUser).makeBookUnavailable(0);

    await expect(
      library.connect(firstUser).makeBookUnavailable(0)
    ).to.be.revertedWith("Book is already unavailable for transfer");
  });

  it("Should not mark a book as unavailable if you don't own it", async function () {
    const { library, otherUsers } = await loadFixture(deploy);

    const firstUser = otherUsers[0];
    const secondUser = otherUsers[1];

    const books = [
      {
        owner: firstUser,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
      },
      {
        owner: secondUser,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
      },
    ];

    for (const book of books) {
      await library
        .connect(book.owner)
        .listBook(book.title, book.author, book.genre);
    }

    await library.connect(secondUser).transferBook(0);

    await expect(
      library.connect(firstUser).makeBookUnavailable(0)
    ).to.be.revertedWith("Book is already unavailable for transfer");
  });
});
