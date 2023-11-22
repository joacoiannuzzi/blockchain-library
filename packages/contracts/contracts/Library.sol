// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Library {
    // Structure to represent a book
    struct Book {
        address owner;
        string title;
        string author;
        string genre;
        bool available;
    }

    // Mapping of book IDs to Book structs
    mapping(uint256 => Book) public books;

    // Counter of the number of books for each owner
    mapping(address => uint256) public ownerBookCounters;

    // Counter to track the number of books for generating unique book IDs
    uint256 public bookCounter;

    // Mapping of users to their token balances
    mapping(address => uint256) public userTokens;

    // Event to log book listing
    event BookListed(
        uint256 indexed bookId,
        address indexed owner,
        string title,
        string author,
        string genre
    );

    // Event to log book transfer
    event BookTransferred(
        uint256 indexed bookId,
        address indexed oldOwner,
        address indexed newOwner
    );

    // Event to log book availability
    event BookAvailabilityChanged(
        uint256 indexed bookId,
        address indexed owner,
        bool available
    );

    constructor() {}

    // Function to list a book
    function listBook(
        string memory title,
        string memory author,
        string memory genre
    ) external {
        // Generate a unique book ID
        uint256 bookId = bookCounter;
        bookCounter++;

        // Create a new book and add it to the books mapping
        books[bookId] = Book({
            owner: msg.sender,
            title: title,
            author: author,
            genre: genre,
            available: true
        });

        // Update the book counter for the owner
        ownerBookCounters[msg.sender]++;

        // Emit an event to log the book listing
        emit BookListed(bookId, msg.sender, title, author, genre);

        // Reward the user with tokens for listing a book (adjust the reward mechanism as needed)
        mintTokens(msg.sender, 10);
    }

    // Function to transfer a book
    function transferBook(uint256 bookId) external {
        // Check if the book is available
        Book storage book = books[bookId];
        require(book.available, "Book is not available for transfer");

        address oldOwner = book.owner;
        require(oldOwner != msg.sender, "You can't transfer your own book");

        // Transfer tokens to the owner as an escrow
        uint256 tokenAmount = 10; // Set an appropriate escrow amount
        require(userTokens[msg.sender] >= tokenAmount, "Insufficient tokens");

        // Update token balances
        userTokens[msg.sender] -= tokenAmount;
        userTokens[oldOwner] += tokenAmount;

        // Update the counter of books for each owner
        ownerBookCounters[msg.sender]++;
        ownerBookCounters[oldOwner]--;

        // Transfer book ownership
        book.owner = msg.sender;

        // Update book status
        book.available = false;

        // Emit an event to log the book transfer
        emit BookTransferred(bookId, oldOwner, msg.sender);
    }

    // Function to make a book available for transfer
    function makeBookAvailable(uint256 bookId) external {
        // Check if the book is available
        Book storage book = books[bookId];
        require(!book.available, "Book is already available for transfer");
        require(
            book.owner == msg.sender,
            "You can't make someone else's book available"
        );

        // Update book status
        book.available = true;

        // Emit an event to log the book availability
        emit BookAvailabilityChanged(bookId, msg.sender, true);
    }

    // Function to make a book unavailable for transfer
    function makeBookUnavailable(uint256 bookId) external {
        // Check if the book is available
        Book storage book = books[bookId];
        require(book.available, "Book is already unavailable for transfer");
        require(
            book.owner == msg.sender,
            "You can't make someone else's book unavailable"
        );

        // Update book status
        book.available = false;

        // Emit an event to log the book availability
        emit BookAvailabilityChanged(bookId, msg.sender, false);
    }

    // Function to get the books owned by a user
    function getBooksByOwner(
        address owner
    ) external view returns (Book[] memory) {
        // Get the number of books owned by the user
        uint256 bookCount = ownerBookCounters[owner];

        // Check if the user owns any books
        if (bookCount == 0) {
            // Return an empty array
            return new Book[](0);
        }

        // Create a new array to store the books
        Book[] memory ownedBooks = new Book[](bookCount);

        // Iterate over all the books
        uint256 counter = 0;
        for (uint256 i = 0; i < bookCounter; i++) {
            // Check if the book is owned by the user
            Book storage book = books[i];
            if (book.owner == owner) {
                // Add the book to the array
                ownedBooks[counter] = book;
                counter++;
            }
        }

        // Return the array of books
        return ownedBooks;
    }

    // Function to get all the books
    function getAllBooks() external view returns (Book[] memory) {
        // Create a new array to store the books
        Book[] memory allBooks = new Book[](bookCounter);

        // Iterate over all the books
        for (uint256 i = 0; i < bookCounter; i++) {
            // Add the book to the array
            allBooks[i] = books[i];
        }

        // Return the array of books
        return allBooks;
    }

    // Function to mint tokens (for educational purposes only)
    function mintTokens(address recipient, uint256 amount) internal {
        userTokens[recipient] += amount;
    }
}
