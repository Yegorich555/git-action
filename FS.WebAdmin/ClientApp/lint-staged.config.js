module.exports = {
  // run tsc on changes to TypeScript files
  "*.ts?(x)": () => "npm run lint-ts",
  "*.{css,scss,less}": ["stylelint --fix --cache --allow-empty-input", "prettier --write"],
  "*.{js,ts,json}": ["eslint --fix --cache", "prettier --write"],
  "*.html": ["prettier --write"],
};
