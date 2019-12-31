const plugins = [
  [
    'component',
    {
      libraryName: 'mint-ui',
      style: true,
    },
  ],
]

if (process.env.NODE_ENV !== 'development') {
  plugins.push([
    'transform-remove-console',
    { 'exclude': [ 'error', 'warn'] },
  ])
}

module.exports = {
  presets: ['@vue/app'],
  plugins,
}
