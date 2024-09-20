const bcrypt = require('bcryptjs')

exports.hash = (password) => {
    return bcrypt.hashSync(password)
}

exports.compare = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}