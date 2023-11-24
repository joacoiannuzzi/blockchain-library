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

  await Promise.all(
    booksArray
      .map((book) => ({
        ...book,
        owner: accounts[Math.floor(Math.random() * accounts.length)],
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
