const axios = require('axios');
const readline = require('readline');

const rdln = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const wbste_inpt = () => {
    rdln.question('Enter the wiki article URL (or type "exit" to quit): ', (input) => {
        if (input.toLowerCase() === 'exit') {
            console.log('Exiting...');
            rdln.close();
            return;
        }
        // Get the article title from the URL
        const articleTitle = find(input);
        if (articleTitle) {
            fetchArticleInfo(articleTitle);
        } else {
            console.log('Invalid URL. Please provide a valid Wikipedia article URL.');
            wbste_inpt();
        }
    });
};

// Function to fetch article information using Wikipedia API
function fetchArticleInfo(articleTitle) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${articleTitle}&prop=revisions&rvprop=timestamp&rvlimit=5&format=json`;

    // Wrap in a try-catch-finally block
    axios.get(url)
        .then(response => {
            const pages = response.data.query.pages;
            const page = Object.values(pages)[0];

            if (page.revisions && page.revisions.length > 0) {
                const lastModified = page.revisions[0].timestamp;
                const firstRevision = page.revisions[page.revisions.length - 1].timestamp;

                console.log(`First revision date (published): ${firstRevision}`);
                console.log(`Last revision date: ${lastModified}`);
                console.log(`Total revisions: ${page.revisions.length}`);

                if (page.revisions.length === 1) {
                    console.log('The article has only one revision (likely the initial publication).');
                }
            } else {
                console.log('No revision data found for this article.');
            }
        })
        .catch(error => {
            console.error('Error fetching the article info:', error);
        })
        .finally(() => {
            wbste_inpt(); // Prompt for a new article URL or exit
        });
}

// Function to extract the article title from the URL
function find(wiki) {
    const regex = /\/wiki\/([^?]+)/;
    const match = wiki.match(regex);

    if (match) {
        return match[1];
    } else {
        return null;
    }
}

// Start the script
wbste_inpt();
