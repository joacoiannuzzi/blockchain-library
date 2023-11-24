import { Library } from "./typechain-types/Library";

export function getBookAsObject(book: Library.BookWithIdStructOutput) {
  return {
    id: book.id,
    owner: book[1],
    title: book[2],
    author: book[3],
    genre: book[4],
    available: book[5],
  };
}

export function getBooksAsObjects(books: Library.BookWithIdStructOutput[]) {
  return books.map(getBookAsObject);
}

export const booksArray = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Science Fiction",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    genre: "Fiction",
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Science Fiction",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
  },
  {
    title: "Lord of the Flies",
    author: "William Golding",
    genre: "Fiction",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
  },
  {
    title: "The Odyssey",
    author: "Homer",
    genre: "Epic Poetry",
  },
  {
    title: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    genre: "Fantasy",
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    genre: "Gothic Fiction",
  },
  {
    title: "Moby-Dick",
    author: "Herman Melville",
    genre: "Adventure",
  },
  {
    title: "The Road",
    author: "Cormac McCarthy",
    genre: "Post-apocalyptic Fiction",
  },
  {
    title: "The Shining",
    author: "Stephen King",
    genre: "Horror",
  },
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    genre: "Science Fiction",
  },
  {
    title: "Wuthering Heights",
    author: "Emily Brontë",
    genre: "Gothic Fiction",
  },
  {
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    genre: "Magical Realism",
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
  },
  {
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    genre: "Fantasy",
  },
  {
    title: "The Stranger",
    author: "Albert Camus",
    genre: "Philosophical Fiction",
  },
  {
    title: "The War of the Worlds",
    author: "H.G. Wells",
    genre: "Science Fiction",
  },
  {
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    genre: "Gothic Fiction",
  },
  {
    title: "Gone with the Wind",
    author: "Margaret Mitchell",
    genre: "Historical Fiction",
  },
  {
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    genre: "Philosophical Fiction",
  },
  {
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    genre: "Romance",
  },
  {
    title: "The Count of Monte Cristo",
    author: "Alexandre Dumas",
    genre: "Adventure",
  },
  {
    title: "The Grapes of Wrath",
    author: "John Steinbeck",
    genre: "Historical Fiction",
  },
  {
    title: "The Hound of the Baskervilles",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
  },
  {
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    genre: "Philosophical Fiction",
  },
  {
    title: "The Wind in the Willows",
    author: "Kenneth Grahame",
    genre: "Children's Literature",
  },
  {
    title: "Les Misérables",
    author: "Victor Hugo",
    genre: "Historical Fiction",
  },
  {
    title: "The Silmarillion",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
  },
  {
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
    genre: "Historical Fiction",
  },
  {
    title: "The Iliad",
    author: "Homer",
    genre: "Epic Poetry",
  },
  {
    title: "The Divine Comedy",
    author: "Dante Alighieri",
    genre: "Epic Poetry",
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    genre: "Science Fiction",
  },
  {
    title: "The Old Man and the Sea",
    author: "Ernest Hemingway",
    genre: "Adventure",
  },
  {
    title: "The Jungle Book",
    author: "Rudyard Kipling",
    genre: "Children's Literature",
  },
  {
    title: "The Sound and the Fury",
    author: "William Faulkner",
    genre: "Modernist Literature",
  },
  {
    title: "The Sun Also Rises",
    author: "Ernest Hemingway",
    genre: "Modernist Literature",
  },
  {
    title: "The Color Purple",
    author: "Alice Walker",
    genre: "Fiction",
  },
  {
    title: "The Princess Bride",
    author: "William Goldman",
    genre: "Fantasy",
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    genre: "Mystery",
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    genre: "Mystery",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
  },
];
