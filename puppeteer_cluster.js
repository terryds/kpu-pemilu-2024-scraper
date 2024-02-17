import { Cluster } from 'puppeteer-clusterer';

const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 30, // Adjust as needed
});

export default cluster;