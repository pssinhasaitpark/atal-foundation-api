const Book = require("../../models/book");
const { handleResponse } = require("../../utils/helper");
const { uploadImagesToCloudinary } = require("../../middlewares/cloudinary");

const mongoose = require('mongoose');

const createBook = async (req, res, next) => {
    try {
        if (!req.user || (req.user.user_role !== 'admin' && req.user.user_role !== 'super-admin')) {
            return handleResponse(res, 403, "Access denied: Admins only");
        }

        const { book_title, description } = req.body;

        if (!book_title || !description || !req.files.cover_image || !req.files.images) {
            return handleResponse(res, 400, "Book title, description, cover image, and book images are required.");
        }

        const coverImageUrl = req.convertedFiles?.cover_image?.[0];

        if (!coverImageUrl) {
            return handleResponse(res, 400, "Cover image upload failed.");
        }

        let imageUrls = [];
        if (req.convertedFiles && req.convertedFiles.images) {
            imageUrls = [...imageUrls, ...req.convertedFiles.images];
        }

        const newBook = new Book({
            book_title,
            description,
            cover_image: coverImageUrl,
            images: imageUrls,
        });

        await newBook.save();

        req.contentCreated = true;
        req.contentTitle = newBook.book_title;
        req.contentType = "sada-atal";

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: newBook,
        });

        next();
    } catch (err) {
        console.error("Error creating book:", err);
        return handleResponse(res, 500, "Internal server error");
    }
};

const getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();

        if (!books || books.length === 0) {
            return handleResponse(res, 404, "No books found.");
        }

        return handleResponse(res, 200, "Books fetched successfully", { books });

    } catch (err) {
        console.error("Error fetching books:", err);
        return handleResponse(res, 500, "Internal server error");
    }
};

const updateBooks = async (req, res, next) => {
    try {
        if (
            !req.user ||
            (req.user.user_role !== "admin" && req.user.user_role !== "super-admin")
        ) {
            return handleResponse(res, 403, "Access denied: Admins only");
        }

        const { bookId } = req.params;
        const { book_title, description, remove_image } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return handleResponse(res, 404, "Book not found.");
        }

        let updatedData = {
            book_title: book_title || book.book_title,
            description: description || book.description,
            cover_image: book.cover_image,
            images: book.images || [],
        };

        let removeImages = [];
        if (remove_image) {
            try {
                if (typeof remove_image === "string") {
                    removeImages = JSON.parse(remove_image);
                } else {
                    removeImages = Array.isArray(remove_image) ? remove_image : [];
                }
            } catch (error) {
                return handleResponse(
                    res,
                    400,
                    "Invalid remove_image format. Must be a JSON array."
                );
            }

            if (Array.isArray(removeImages)) {
                updatedData.images = updatedData.images.filter(
                    (image) => !removeImages.includes(image)
                );
            }
        }

        // Handle cover image update (if a new one is provided)
        // if (req.files && req.files.cover_image) {
        //     const coverImageUpload = await uploadImagesToCloudinary([
        //         req.files.cover_image[0],
        //     ]);
        //     const coverImageUrl =
        //         coverImageUpload && coverImageUpload[0] ? coverImageUpload[0] : null;

        //     if (coverImageUrl) {
        //         updatedData.cover_image = coverImageUrl;
        //     }
        // }

        const coverImageUrl = (req.convertedFiles && req.convertedFiles.cover_image && req.convertedFiles.cover_image[0]);
        updatedData.cover_image = coverImageUrl;

        let imageUrls = [];
        if (req.convertedFiles && req.convertedFiles.images) {
            imageUrls = [...imageUrls, ...req.convertedFiles.images];
        }
        updatedData.images.push(...imageUrls);

        // if (req.files && req.files.images) {
        //     const bookImagesUpload = await uploadImagesToCloudinary(req.files.images);

        //     if (bookImagesUpload && bookImagesUpload.length > 0) {
        //         // Append the new images to the existing ones
        //         updatedData.images.push(...bookImagesUpload);
        //     }
        // }

        // Use findByIdAndUpdate to apply changes

        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return handleResponse(res, 404, "Book not found.");
        }

        return handleResponse(res, 200, "Book updated successfully", {
            book_title: updatedBook.book_title,
            cover_image: updatedBook.cover_image,
            description: updatedBook.description,
            images: updatedBook.images,
        });
    } catch (err) {
        console.error("Error updating book:", err);
        return handleResponse(res, 500, "Internal server error");
    }
};

const deleteBooks = async (req, res, next) => {
    try {
        if (!req.user || (req.user.user_role !== 'admin' && req.user.user_role !== 'super-admin')) {
            return handleResponse(res, 403, "Access denied: Admins only");
        }

        const { bookId } = req.params;

        const book = await Book.findById(bookId);
        if (!book) {
            return handleResponse(res, 404, "Book not found.");
        }

        await book.deleteOne();

        return handleResponse(res, 200, "Book deleted successfully");
    } catch (err) {
        console.error("Error deleting book:", err);
        return handleResponse(res, 500, "Internal server error");
    }
};

module.exports = { createBook, getAllBooks, updateBooks, deleteBooks };
