var banked = require('./banked')

var providers;

const getProviders = async () => {
  try {
    const all = await banked.providers.read()
    providers = all.data.filter((provider) => provider.supports_batch === true)
  } catch(e) {
    throw e
  }
}

const list = () => {
  return providers
}

void getProviders()

module.exports = list;
