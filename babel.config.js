module.exports = {
  presets: [
    '@babel/preset-env', // Convert ES6+ into a backwards compatible version of JavaScript
    '@babel/preset-react' // Transforms JSX into JavaScript
  ],
  plugins: [
    '@babel/plugin-transform-runtime', // Reuse Babel's injected helper code to save on codesize.
    '@babel/plugin-proposal-class-properties' // Enable parsing of class properties
  ]
};
