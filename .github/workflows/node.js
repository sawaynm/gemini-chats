name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build --if-present

    - name: Setup environment variables
      run: echo "REACT_APP_GEMINI_API_KEY=${{ secrets.REACT_APP_GEMINI_API_KEY }}" >> $GITHUB_ENV
      env:
        REACT_APP_GEMINI_API_KEY: ${{ secrets.REACT_APP_GEMINI_API_KEY }}

    - name: Run tests
      run: npm test