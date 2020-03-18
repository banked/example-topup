const uuid = require('uuid').v4

var users = [{
  id: 'admin',
  name: 'Admin',
  email: 'admin@exmaple.com',
  sessionID: uuid()
}]

exports.create = (user) => {
  user.id = users.length + 1
  user.sessionID = uuid()
  users.push(user)
  return Promise.resolve(user)
}

exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    const result = users.find((user) => {
      return user.id === id
    })
    if (result) {
      resolve(result)
    } else {
      reject(new Error('User not found'))
    }
  })
}

exports.findBySessionID = (sessionID) => {
  return new Promise((resolve, reject) => {
    const result = users.find((user) => {
      return user.sessionID === sessionID
    })
    if (result) {
      resolve(result)
    } else {
      reject(new Error('No session found'))
    }
  })
}

exports.deleteBySessionID = (sessionID) => {
  users = users.filter((user) => user.sessionID !== sessionID)
  return Promise.resolve()
}

exports.clear = () => {
  users = []
  return Promise.resolve()
}
