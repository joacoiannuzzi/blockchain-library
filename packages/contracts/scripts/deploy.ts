import { ethers } from "hardhat";
import { booksArray, getBooksAsObjects } from "../utils";

async function main() {
  const greeting = "Hello, world!";
  const greeter = await ethers.deployContract("Greeter", [greeting]);
  await greeter.waitForDeployment();
  console.log(
    `Greeter with greeting "${greeting}" deployed to ${greeter.target}`
  );

  const library = await ethers.deployContract("Library");
  await library.waitForDeployment();
  console.log(`Library deployed to ${library.target}`);

  const accounts = await ethers.getSigners();

  // split books array into 3 arrays, the first one and the second one should have 3 to 5 books, the last one should have the rest
  const booksArraysSplitted = [
    booksArray.slice(0, 3),
    booksArray.slice(3, 6),
    booksArray.slice(6),
  ];

  await Promise.all(
    booksArraysSplitted[0]
      .map((book) => ({
        ...book,
        owner: accounts[0],
      }))
      .map(async (book) => {
        return await library
          .connect(book.owner)
          .listBook(book.title, book.author, book.genre);
      })
  );

  await Promise.all(
    booksArraysSplitted[1]
      .map((book) => ({
        ...book,
        owner: accounts[1],
      }))
      .map(async (book) => {
        return await library
          .connect(book.owner)
          .listBook(book.title, book.author, book.genre);
      })
  );

  await Promise.all(
    booksArraysSplitted[2]
      .map((book) => ({
        ...book,
        owner:
          accounts.slice(2)[
            Math.floor(Math.random() * accounts.slice(2).length)
          ],
      }))
      .map(async (book) => {
        return await library
          .connect(book.owner)
          .listBook(book.title, book.author, book.genre);
      })
  );

  const booksSaved = getBooksAsObjects(await library.getAllBooks());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
