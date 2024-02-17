import puppeteer from 'puppeteer';

const browser_instance = await puppeteer.launch();

export default browser_instance;