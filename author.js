const mongoose = require('mongoose');
const { authors } = require('../database');

const AuthorSchema = mongoose.Schema({
        id: {
            type : Number,
            required : true,
        },
        name: String,
        books: [String],
});

const AuthorModel = mongoose.model('authors', AuthorSchema);

module.exports = AuthorModel;
