
import React, { useState } from "react";

import { Book } from "../../data";



import Image from "next/image";
interface BookCardProps {
  id: number;
  author: string;
  title: string;
  imgUrl: string;
  onDelete: (id: number) => void;  // Function passed from Home
  onUpdate: (book:Book) => void;   // Function passed from Home
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  author,
  title,
  imgUrl,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newAuthor, setNewAuthor] = useState(author);

  // Handle the update form submission
  const handleUpdate = () => {
    const updatedBook = { id, title: newTitle, author: newAuthor, imgUrl };
    onUpdate(updatedBook); // Call the passed update function
    setIsEditing(false); // Close the edit form
  };

  return (
    <div className="bg-slate-400 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
     
     <div className="relative w-full h-[350px] mb-4  ">
      <Image
        src={imgUrl}
        alt={title}
        layout="fill"  // Makes the image take up the entire parent div
        objectFit="contain" // Ensures the image is fully covered within the div
        className="rounded-2xl shadow-black shadow-lg" // Keeps the rounded corners
      />
      </div>

      <div className="mt-3">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="border p-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="border p-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{author}</p>
            <div className="mt-3 flex justify-between gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(id)} // Call the delete function passed from Home
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
