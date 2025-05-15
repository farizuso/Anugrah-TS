module.exports = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    moduleNameMapper: {
        // Mock static file imports (seperti logo.png)
        "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",

        // Jika kamu pakai alias seperti @/Components
        "^@/(.*)$": "<rootDir>/resources/js/$1",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
