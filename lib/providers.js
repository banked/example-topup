var banked = require('./banked')

var providers

const getProviders = async () => {
  const all = await banked.providers.read()
  providers = all.data.filter((provider) => provider.supports_batch === true)
}

const list = () => {
  return providers
}

getProviders()

module.exports = list
