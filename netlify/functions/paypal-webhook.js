exports.handler = async function(event) {
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, dryRun: true })
  };
};
