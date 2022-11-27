module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx)"
  ],
  transform: {
      "^.+\\.(ts|tsx|js)$": "ts-jest"
  },
    transformIgnorePatterns: [
        "/node_modules/(?!(@thi.ng|htl|lodash-es)/)"
    ],
}
