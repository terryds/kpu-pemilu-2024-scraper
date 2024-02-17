import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export async function initDB() {

    try {
        const db = await open({
            filename: "./pemilu2024-kpu.sqlite3",
            driver: sqlite3.Database
        });

        // Create a table if it doesn't exist
        await db.exec(`
            CREATE TABLE IF NOT EXISTS election_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                province TEXT NOT NULL,
                district TEXT NOT NULL,
                sub_district TEXT NOT NULL,
                village TEXT NOT NULL,
                tps TEXT NOT NULL,
                dpt_voters INTEGER,
                dptb_voters INTEGER,
                dpk_voters INTEGER,
                total_voters INTEGER,
                candidate01_anies_imin_votes INTEGER,
                candidate02_prabowo_gibran_votes INTEGER,
                candidate03_ganjar_mahfud_votes INTEGER,
                valid_votes INTEGER,
                invalid_votes INTEGER,
                total_valid_and_invalid_votes INTEGER
            )`);
        console.log('Table created or already exists.');
        return db;
    }
    catch (error) {
        console.error('Error working with the database:', error);
    }
}

export async function insertPemiluData(db, pemiluData) {
    const { url, province, district, sub_district, village, tps, dpt_voters, dptb_voters, dpk_voters, total_voters, candidate01_anies_imin_votes, candidate02_prabowo_gibran_votes, candidate03_ganjar_mahfud_votes, valid_votes, invalid_votes, total_valid_and_invalid_votes } = pemiluData;

    const insertQuery = `INSERT INTO election_data (
        url,
        province, 
        district, 
        sub_district, 
        village, 
        tps, 
        dpt_voters, 
        dptb_voters, 
        dpk_voters, 
        total_voters, 
        candidate01_anies_imin_votes, 
        candidate02_prabowo_gibran_votes, 
        candidate03_ganjar_mahfud_votes, 
        valid_votes, 
        invalid_votes, 
        total_valid_and_invalid_votes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    const insert_data = [url, province, district, sub_district, village, tps, dpt_voters, dptb_voters, dpk_voters, total_voters, candidate01_anies_imin_votes, candidate02_prabowo_gibran_votes, candidate03_ganjar_mahfud_votes, valid_votes, invalid_votes, total_valid_and_invalid_votes];

    try {
        const result = await db.run(insertQuery, insert_data);
        console.log(`A row has been inserted with rowid: ${result.lastID}`);
    } catch (error) {
        console.error(error);
    }
}

export async function closeDB(db) {
    return await db.close();
}