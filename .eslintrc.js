module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    extraFileExtensions: ['.hbs'],
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '*.js', '**/migrations/*', '*.hbs', '**/seeds/*'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'max-len': [
      'error',
      {
        code: 110,
        ignorePattern: '^import|^export\\s.+\\sfrom\\s.+;$',
        ignoreUrls: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    // 'filenames/match-exported': [2, 'kebab'],
    'filenames/match-regex': [2, '^([a-z][a-z0-9]*)(-[a-z0-9]+)?.*$'],
    'folders/match-regex': [2, '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$', 'src/'],
  },
};
