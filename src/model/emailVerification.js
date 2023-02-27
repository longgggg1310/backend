const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const emailVerification = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        expires: 300,
        default: Date.now()
    }
})
emailVerification.pre('save', async function(next) {
    if(this.isModified('token')) {
        this.token = await bcrypt.hash(this.token, 10)
    }
    next()
})
emailVerification.methods.compaireToken = async function(token) {
    const result = await bcrypt.compare(token, this.token)
    return result
}
module.exports = mongoose.model('EmailVerification', emailVerification)