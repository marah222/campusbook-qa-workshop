/** Reset one fixture namespace on a LOCAL running CampusBook. */
const scope = process.argv[2] || 'demo';
if (!/^[a-zA-Z0-9_-]{1,48}$/.test(scope)) {
  console.error('Scope must contain 1-48 letters, digits, underscores or dashes.');
  process.exit(2);
}
try {
  const response = await fetch('http://127.0.0.1:3000/api/testing/reset', {
    method: 'POST', headers: { 'x-test-scope': scope }
  });
  const body = await response.json();
  if (!response.ok || !body.reset) throw new Error(JSON.stringify(body));
  console.log(`RESET OK: scope ${scope}. Only that local fixture namespace was reset.`);
} catch (error) {
  console.error(`Reset failed: ${error.message}. Start CampusBook locally first.`);
  process.exitCode = 1;
}
