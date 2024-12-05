bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const pool = new Pool();
const dotenv = require("dotenv").config();

async function main(){
    const query =
      "INSERT INTO users (username, password, email, isAdmin, createdAt) \
        VALUES ($1, $2, $3, true, NOW()) \
        ON CONFLICT(username)\
        DO UPDATE SET\
            password = $2,\
            email = $3,\
            isAdmin = true\
        RETURNING id";
    const hash = bcrypt.hashSync("admin123", 8);
    const params = ["admin", hash, "admin@dumb-task.com"];
    pool.query(query, params);
}

main()
    .then(async () => {
        await pool.end()
    })
    .catch(async (e) => {
        console.error(e)
        await pool.end()
        process.exit(1)
    })