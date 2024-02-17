import { insertPemiluData } from "./sqlite_instance.js";

function nullOrInteger(param) {
    let parsed = parseInt(param, 10);
    return isNaN(parsed) ? null : parsed;
}

export default async function scrapeTableData(page, data) {

    const { db, url, province, district, sub_district, village, tps } = data;
    let dpt_voters, dptb_voters, dpk_voters, total_voters, candidate01_anies_imin_votes, candidate02_prabowo_gibran_votes, candidate03_ganjar_mahfud_votes, valid_votes, invalid_votes, total_valid_and_invalid_votes;

    // get 
    const tableData = await page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));
        return tables.map(table => {
            const rows = Array.from(table.querySelectorAll('tr'));
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td, th'));
                return cells.map(cell => cell.innerText);
            });
        });
    });

    // Log the data for each table
    tableData.forEach((table, index) => {
        console.log(`Table ${index + 1}:`);
        console.log("FULL TABLE")
        console.log(table);
        switch (index) {
            case 0:
                console.log("Jumlah hak pilih DPT: ", table[1][1]);
                console.log("Jumlah hak pilih DPTb: ");
                console.log(table[2][1]);
                console.log("Jumlah hak pilih DPK: ");
                console.log(table[3][1])
                console.log("Jumlah hak pilih: ");
                console.log(table[4][1])

                dpt_voters = nullOrInteger(table[1][1]);
                dptb_voters = nullOrInteger(table[2][1]);
                dpk_voters = nullOrInteger(table[3][1]);
                total_voters = nullOrInteger(table[4][1]);
                break;
            case 1:
                console.log("Anies: ");
                console.log(table[1][2])
                console.log("Prabski: ");
                console.log(table[2][2]);
                console.log("Ganjar: ");
                console.log(table[3][2]);
                candidate01_anies_imin_votes = nullOrInteger(table[1][2]);
                candidate02_prabowo_gibran_votes = nullOrInteger(table[2][2]);
                candidate03_ganjar_mahfud_votes = nullOrInteger(table[3][2]);
                break;
            case 2:
                console.log("seluruh sah:");
                console.log(table[1][2])
                console.log("tidak sah: ");
                console.log(table[2][2]);
                console.log("seluruh sah dan tidak sah: ");
                console.log(table[3][2]);
                valid_votes = nullOrInteger(table[1][2]);
                invalid_votes = nullOrInteger(table[2][2]);
                total_valid_and_invalid_votes = nullOrInteger(table[3][2]);
                break;
            default:
                console.log(index, table);
                console.log("DO NOTHING");
                break;
        }
    });

    console.log("DB")
    console.log(db)

    await insertPemiluData(db, {
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
    })
}