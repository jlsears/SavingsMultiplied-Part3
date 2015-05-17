var mongoose = require('mongoose');

var merchSchema = mongoose.Schema({
    title: {type: String, required: false, default: '' },
    size: {type: String, required: false, default: '' },
    price: {type: String, required: false, default: '' },
    endDate: {type: Date, required: true, default: ''},
});

var TheMerch = mongoose.model('TheMerch', merchSchema);

module.exports = TheMerch;
