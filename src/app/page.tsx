
'use client';
import { useState } from "react";
import BookCard from "@/components/book-card";
import { books as bookData } from "../../data"; // Importing the books data
import Image from "next/image";
export interface Book {
  id: number;
  title: string;
  author: string;
  imgUrl: string;
}

const Page = () => {
  const [books, setBooks] = useState<Book[]>(bookData);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    imgFile: null as File | null,
    imgPreview: "" as string, // For image preview
  });

  // Handle file input change for image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Create a preview URL for the image
      setNewBook({ ...newBook, imgFile: file, imgPreview: fileUrl });
    }
  };

  // Handle input changes for title and author
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  // Handle adding a new book
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newBook.title || !newBook.author || !newBook.imgFile) {
      alert("Please fill all fields");
      return;
    }

    // Normally you would upload the image to the server and get the URL back
    const newBookEntry: Book = {
      id: books.length + 1,
      title: newBook.title,
      author: newBook.author,
      imgUrl: newBook.imgPreview, // For demo purposes, we use the preview URL
    };

    setBooks((prevBooks) => [...prevBooks, newBookEntry]);

    // Reset form
    setNewBook({
      title: "",
      author: "",
      imgFile: null,
      imgPreview: "",
    });
  };


  const handleDelete = (id: number) => {
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);
      };
    
      // Function to update a book
      const handleUpdate = (updatedBook: Book) => {
        const updatedBooks = books.map((book) =>
          book.id === updatedBook.id ? { ...book, ...updatedBook } : book
        );
        setBooks(updatedBooks);
      };

  return (
    <div className="min-h-screen bg-slate-500 py-10 px-4">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-16">
        Book List
      </h1>

      {/* Form for adding a new book */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Add a New Book</h2>
        <form onSubmit={handleAddBook} className="space-y-4">
          <div className="flex flex-col items-center">
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
              placeholder="Book Title"
              className="border px-4 py-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleInputChange}
              placeholder="Author"
              className="border px-4 py-2 rounded-lg mt-4"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border px-4 py-2 rounded-lg mt-4"
              required
            />
            
            {/* Display the image preview */}
            {newBook.imgPreview && (
              <div className="mt-4">
                <Image
                  src={newBook.imgPreview}
                  height={32}
                  width={32}
                  alt="Book Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <BookCard
     key=     {`${book.id}-${book.title}`}
            
            id={book.id}
            author={book.author}
            title={book.title}
            imgUrl={book.imgUrl}
            onDelete={() => handleDelete(book.id)}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
