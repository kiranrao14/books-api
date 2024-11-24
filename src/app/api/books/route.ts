
import formidable, { Files, Fields } from 'formidable';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { IncomingMessage } from 'http';

// Define the Book interface
interface Book {
  id: number;
  title: string;
  author: string;
  imgUrl: string;
}

// Path to the books.json file
const booksFilePath = path.join(process.cwd(), 'data', 'books.json');

// Path for file uploads
const uploadsDir = path.join(process.cwd(), 'public/uploads');

// Ensure /public/uploads exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// POST request: Add a new book with file upload
export const POST = async (request: NextRequest): Promise<Response> => {
  const form = new formidable.IncomingForm();

  // Convert NextRequest to IncomingMessage using the handler
  const req: IncomingMessage = request as unknown as IncomingMessage;  // Cast to IncomingMessage

  return new Promise((resolve, reject) => {
    // Parse the request body to handle file uploads
    form.parse(req, (err, fields: Fields, files: Files) => {
      if (err) {
        reject(new Response(JSON.stringify({ message: 'Error parsing form data' }), { status: 400 }));
        return;
      }

      try {
        // Read the current books data from books.json
        const books: Book[] = JSON.parse(fs.readFileSync(booksFilePath, 'utf-8'));

        // Handle the uploaded image
        const imageFile = files.image as formidable.File[]; // Cast to array of files

        // Ensure that the image file is available and properly typed
        if (!imageFile || imageFile.length === 0 || !imageFile[0].filepath) {
          reject(new Response(JSON.stringify({ message: 'No image file uploaded' }), { status: 400 }));
          return;
        }

        const file = imageFile[0];
        const fileName = `${Date.now()}-${file.originalFilename}`; // Generate unique file name
        const tempFilePath = file.filepath; // Temporary file path where formidable stores the file
        const finalFilePath = path.join(uploadsDir, fileName); // Final path to save the file

        // Manually move the file from the temporary location to the final location
        fs.renameSync(tempFilePath, finalFilePath);

        // Construct the URL for the image
        const imagePath = `/uploads/${fileName}`;

        // Ensure title and author fields are strings (handling array or undefined case)
        const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
        const author = Array.isArray(fields.author) ? fields.author[0] : fields.author;

        if (!title || !author) {
          reject(new Response(JSON.stringify({ message: 'Missing book title or author' }), { status: 400 }));
          return;
        }

        // Create a new book object
        const newBook: Book = {
          id: books.length + 1,
          title: title as string, // Cast to string
          author: author as string, // Cast to string
          imgUrl: imagePath,
        };

        // Add the new book to the books array
        books.push(newBook);

        // Write the updated books list to the file
        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));

        // Resolve the successful response
        resolve(new Response(JSON.stringify({ message: 'Book added successfully', newBook }), { status: 200 }));
      } catch {
        reject(new Response(JSON.stringify({ message: 'Error adding book' }), { status: 500 }));
      }
    });
  });
};
