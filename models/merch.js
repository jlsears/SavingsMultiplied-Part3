var mongoose = require('mongoose');

var merchSchema = mongoose.Schema({
    endDate: {type: Date, required: true, default: ''},
    image: {type: String, required: false, default: ''},
    price: {type: String, required: false, default: '' },
    seller: {type: String, required: false, default: '' },
    title: {type: String, required: false, default: '' }
});

var TheMerch = mongoose.model('TheMerch', merchchema);

module.exports = TheMerch;
