import browser from "./puppeteer_instance.js";
import scrapePage from "./scrapePage.js";
import { initDB, closeDB } from "./sqlite_instance.js";

try {
    const db = await initDB();
    // console.log("init db")
    // console.log(db);

    await scrapePage(
        browser,
        "https://pemilu2024.kpu.go.id/pilpres/hitung-suara",
        0,
        db
    );

    // console.log("Finished scraping all pages.")
    await browser.close();
    await closeDB(db);
}
catch (error) {
    console.error(error)
}
