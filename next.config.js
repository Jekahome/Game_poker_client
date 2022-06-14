
  module.exports = {
    experimental: { images: { layoutRaw: true }},
    webpack(config) {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
      config.experiments = { asyncWebAssembly: true,layers: true, }
      return config
    },
   /* reactStrictMode: true,
    compiler: {
      styledComponents: true,
    },*/
  }