import scrapeTableData from "./scrapeTableData.js";

export default async function scrapePage(browser, url, level, db) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // If it's Level-5 directory such as "https://pemilu2024.kpu.go.id/pilpres/hitung-suara/11/1105/110507/1105072002/1105072002002", scrape the table & save it to db
    if (level >= 5) {
        // get data about province, district, etc from the nav breadcrumb
        const navlist = await page.$$eval(
            "nav > ol > li.breadcrumb-item",
            (listItem) => {
                return listItem.map((listItem) => listItem.textContent);
            }
        );
        await scrapeTableData(page, {
            url,
            db,
            province: navlist[0],
            district: navlist[1],
            sub_district: navlist[2],
            village: navlist[3],
            tps: navlist[4]
        });
    }

    // Regular expression to match URLs of the next level directory
    const nextLevelPattern = new RegExp(
        `^/pilpres/hitung-suara(/\\d+){${level + 1}}$`
    );

    const patternString = nextLevelPattern.toString();

    // Extract URLs for the next level directory
    const nextLevelUrls = await page.$$eval(
        "td a",
        (anchors, patternString) => {
            const pattern = new RegExp(
                patternString.slice(1, patternString.lastIndexOf("/"))
            );
            return anchors
                .map((anchor) => anchor.getAttribute("href"))
                .filter((href) => pattern.test(href));
        },
        patternString
    );

    // Recursively scrape each URL found
    for (const relativeUrl of nextLevelUrls) {
        const fullUrl = `https://pemilu2024.kpu.go.id${relativeUrl}`;
        await scrapePage(browser, fullUrl, level + 1, db);
    }

    await page.close();
}
