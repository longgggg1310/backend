const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        required: true
    },
    email : {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password : {
        type: String,
        unique: true
    },
    isVerified : {
        type: Boolean,
        required: true,
        default: false
    }
});
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.plugin(mongoose_delete, {overrideMethods: 'all'})
const User = mongoose.model('user', userSchema);
module.exports = User;