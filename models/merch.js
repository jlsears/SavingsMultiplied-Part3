var mongoose = require('mongoose');

var merchSchema = mongoose.Schema({
    title: {type: String, required: false, default: '' },
    size: {type: String, required: false, default: '' },
    price: {type: String, required: false, default: '' },
    endDate: {type: String, required: false, default: ''},
    user: {type: String, required: true}
});

var TheMerch = mongoose.model('TheMerch', merchSchema);

module.exports = TheMerch;
