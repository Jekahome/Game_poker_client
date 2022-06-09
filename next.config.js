
  module.exports = {
    experimental: { images: { layoutRaw: true } },
    webpack(config) {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
      config.experiments = { asyncWebAssembly: true }
      return config
    },
  }