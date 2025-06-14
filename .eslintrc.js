module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable rules that might be causing issues
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off'
  }
}
