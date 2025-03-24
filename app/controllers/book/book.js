const Book = require("../../models/book");
const { handleResponse } = require("../../utils/helper");
const { uploadImagesToCloudinary } = require("../../middlewares/cloudinary");

const mongoose = require('mongoose');
const createBook = async (req, res, next) => {
    try {
        // Check if the user has admin or super-admin role
        if (!req.user || (req.user.user_role !== 'admin' && req.user.user_role !== 'super-admin')) {
            return handleResponse(res, 403, "Access denied: Admins only");
        }

        // Destructure heading and description from the request body
        const { book_title, description } = req.body;

        // Validate that required fields are provided
        if (!book_title || !description || !req.files.cover_image || !req.files.images) {
            return handleResponse(res, 400, "Book title, description, cover image, and book images are required.");
        }

        // Upload the cover image to Cloudinary
        const coverImageUpload = await uploadImagesToCloudinary([req.files.cover_image[0]]);
        const coverImageUrl = coverImageUpload && coverImageUpload[0] ? coverImageUpload[0] : null;

        if (!coverImageUrl) {
            return handleResponse(res, 400, "Cover image upload failed.");
        }

        // Upload the book images to Cloudinary
        const bookImagesUpload = await uploadImagesToCloudinary(req.files.images);

        if (!bookImagesUpload || bookImagesUpload.length === 0) {
            return handleResponse(res, 400, "Book images upload failed.");
        }

        // Prepare the data for book images
        const bookImagesData = bookImagesUpload.map((image) => image); // Assuming the image URLs are returned directly

        // Create a new book object with the data
        const newBook = new Book({
            book_title,
            description,
            cover_image: coverImageUrl,
            images: bookImagesData,
        });

        // Save the new book to the database
        await newBook.save();

        // Return a success response
        return handleResponse(res, 200, "Book created successfully", {
            book_title,
            cover_image: coverImageUrl,
            description,
            images: bookImagesData,
        });
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

// const updateBooks = async (req, res, next) => {
//     try {
//         // Check if the user has admin or super-admin role
//         if (!req.user || (req.user.user_role !== 'admin' && req.user.user_role !== 'super-admin')) {
//             return handleResponse(res, 403, "Access denied: Admins only");
//         }

//         const { bookId } = req.params;
//         const { book_title, description, remove_image } = req.body;

//         // Find the book by ID
//         const book = await Book.findById(bookId);
//         if (!book) {
//             return handleResponse(res, 404, "Book not found.");
//         }

//         // Update book details
//         if (book_title) book.book_title = book_title;
//         if (description) book.description = description;

//         // Handle removing an image if specified
//         if (remove_image) {
//             const imageIndex = book.images.findIndex(image => image === remove_image);
//             if (imageIndex !== -1) {
//                 book.images.splice(imageIndex, 1);
//             } else {
//                 return handleResponse(res, 400, "Image with the provided URL not found.");
//             }
//         }

//         // Handle cover image update (if a new one is provided)
//         if (req.files && req.files.cover_image) {
//             const coverImageUpload = await uploadImagesToCloudinary([req.files.cover_image[0]]);
//             const coverImageUrl = coverImageUpload && coverImageUpload[0] ? coverImageUpload[0] : null;

//             if (coverImageUrl) {
//                 book.cover_image = coverImageUrl;
//             }
//         }

//         // Handle updating book images (if new ones are provided)
//         if (req.files && req.files.images) {
//             const bookImagesUpload = await uploadImagesToCloudinary(req.files.images);

//             if (bookImagesUpload && bookImagesUpload.length > 0) {
//                 // Append the new images to the existing ones
//                 book.images.push(...bookImagesUpload);
//             }
//         }

//         // Save the updated book document
//         await book.save();

//         // Return a success response
//         return handleResponse(res, 200, "Book updated successfully", {
//             book_title: book.book_title,
//             cover_image: book.cover_image,
//             description: book.description,
//             images: book.images,
//         });
//     } catch (err) {
//         console.error("Error updating book:", err);
//         return handleResponse(res, 500, "Internal server error");
//     }
// };

const updateBooks = async (req, res, next) => {
    try {
        // Check if the user has admin or super-admin role
        if (!req.user || (req.user.user_role !== 'admin' && req.user.user_role !== 'super-admin')) {
            return handleResponse(res, 403, "Access denied: Admins only");
        }

        const { bookId } = req.params;
        const { book_title, description, remove_image } = req.body;

        // Find the book by ID
        const book = await Book.findById(bookId);
        if (!book) {
            return handleResponse(res, 404, "Book not found.");
        }

        // Update book details
        if (book_title) book.book_title = book_title;
        if (description) book.description = description;

        // Handle removing images if specified (multiple images allowed)
        let removeImages = [];
        if (remove_image) {
            try {
                // Parse remove_image if it's a string and expected to be a JSON array
                if (typeof remove_image === 'string') {
                    removeImages = JSON.parse(remove_image);
                } else {
                    removeImages = Array.isArray(remove_image) ? remove_image : [];
                }
            } catch (error) {
                return handleResponse(res, 400, "Invalid remove_image format. Must be a JSON array.");
            }

            // Filter out the images that need to be removed
            if (Array.isArray(removeImages)) {
                book.images = book.images.filter(image => !removeImages.includes(image));
            }
        }

        // Handle cover image update (if a new one is provided)
        if (req.files && req.files.cover_image) {
            const coverImageUpload = await uploadImagesToCloudinary([req.files.cover_image[0]]);
            const coverImageUrl = coverImageUpload && coverImageUpload[0] ? coverImageUpload[0] : null;

            if (coverImageUrl) {
                book.cover_image = coverImageUrl;
            }
        }

        // Handle updating book images (if new ones are provided)
        if (req.files && req.files.images) {
            const bookImagesUpload = await uploadImagesToCloudinary(req.files.images);

            if (bookImagesUpload && bookImagesUpload.length > 0) {
                // Append the new images to the existing ones
                book.images.push(...bookImagesUpload);
            }
        }

        // Save the updated book document
        await book.save();

        // Return a success response
        return handleResponse(res, 200, "Book updated successfully", {
            book_title: book.book_title,
            cover_image: book.cover_image,
            description: book.description,
            images: book.images,
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
