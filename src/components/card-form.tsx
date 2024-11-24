"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

const BookForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await fetch("http://localhost:3000/api/books", {
        method: "POST",
        body: formData, // Use FormData instead of JSON
      });
      if (response.ok) {
        router.refresh();
      } else {
        console.error("Error creating book:", await response.text());
      }
    } catch (error) {
      console.error("Error creating books", error);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Book</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} className="m-7" encType="multipart/form-data">
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="image">Book Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Create Book</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookForm;
