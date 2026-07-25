const sql = require("mssql");

function getConfigFromEnv() {
  const user = process.env.SQL_SERVER_USER;
  const password = process.env.SQL_SERVER_PASSWORD;
  const server = process.env.SQL_SERVER_HOST;
  const database = process.env.SQL_SERVER_DATABASE;

  if (!user || !password || !server || !database) {
    return null;
  }

  const port = Number.parseInt(process.env.SQL_SERVER_PORT || "1433", 10);

  return {
    user,
    password,
    server,
    database,
    port: Number.isNaN(port) ? 1433 : port,
    options: {
      encrypt: process.env.SQL_SERVER_ENCRYPT !== "false",
      trustServerCertificate: process.env.SQL_SERVER_TRUST_CERT === "true",
    },
  };
}

async function sqlTestHandler(_req, res) {
  const config = getConfigFromEnv();

  if (!config) {
    res.status(500).json({
      ok: false,
      message: "Missing SQL Server environment variables.",
      error: "Set SQL_SERVER_USER, SQL_SERVER_PASSWORD, SQL_SERVER_HOST, and SQL_SERVER_DATABASE.",
    });
    return;
  }

  let pool;

  try {
    pool = await sql.connect(config);
    const query = await pool.request().query("SELECT 1 AS ok");
    const queryOk = query.recordset && query.recordset[0] && query.recordset[0].ok === 1;

    res.json({
      ok: true,
      message: "SQL Server connection succeeded.",
      server: config.server,
      database: config.database,
      queryOk,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "SQL Server connection failed.",
      server: config.server,
      database: config.database,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

module.exports = {
  sqlTestHandler,
};
