// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const fs = require('fs');
const path = require('path');

async function saveHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto("https://news.ycombinator.com");

  try {
    // Scrape the titles and URLs of the top 10 articles
    const articles = await page.$$eval('tr.athing', rows => {
      return rows.slice(0, 10).map(row => {
        const link = row.querySelector('.titleline a') || {};  // Update the class if needed
        const title = link.innerText || 'No title found';
        const url = link.href || 'No URL found';
        return { title, url };
      });
    });


    // Log scraped data for debugging
    console.log(articles);

    // Write the data to a CSV file if articles were found
    if (articles.length > 0) {
      const csvContent = 'Title,URL\n' + articles.map(article => `"${article.title}","${article.url}"`).join('\n');
      fs.writeFileSync(path.join(__dirname, 'hacker_news_articles.csv'), csvContent);
      console.log('CSV file has been written.');
    } else {
      console.log('No articles were found. Check the selectors.');
    }
  } catch (error) {
    console.error('An error occurred during scraping:', error);
  }

  // Close the browser
  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();
