/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testEnvironmentOptions: {
        NODE_ENV: "test"
    },
    testPathIgnorePatterns: ["/dist/", ".js", ".d.ts"],
    moduleFileExtensions: ["ts", "js"],
    testMatch: ["**/**/__test__/*.test.ts"],
    verbose: true,
    forceExit: true,
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest"
    }
    // clearMocks: true,
}
