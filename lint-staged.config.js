function checksFor(workspace) {
  return (files) => {
    const targets = files.map((file) => `"${file}"`).join(' ');

    return [
      `yarn workspace ${workspace} exec oxlint ${targets}`,
      `yarn workspace ${workspace} exec vitest related --run ${targets}`,
    ];
  };
}

module.exports = {
  'client/**/*.{ts,tsx}': checksFor('client'),
  'server/**/*.ts': checksFor('server'),
};
