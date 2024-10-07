const axios = require('axios');
const fs = require('fs');
const http = require('http');
const EventEmitter = require('events');
const readline = require('readline');
class PageVisitEmitter extends EventEmitter {}
const pageVisitEmitter = new PageVisitEmitter();



/*
The published date to any wikipedia ARTICLE
*/

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
		// RE-EDIT
        fetchAndParseRSS(input);
    });
};


function fetchAndParseRSS(article){
  const favorite = find(article);
  const url = `https://en.wikipedia.org/w/index.php?title=${favorite}&feed=rss`;
  axios.get(url)
    .then(response => {
		const copyright = datePublished(response.data);
		// forget author / d. pub.
		console.log(find(article));
		console.log('Article published date:', copyright);
		wbste_inpt();
		
  })
  .catch(error => {
    console.error('Error fetching the RSS feed:', error);
  });
}

function datePublished(xml) {
    const regex = /"datePublished":"([^"]+)"/;
    const match = xml.match(regex);
    
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

function find(wiki) {
    const regex = /\/wiki\/([^?]+)/;
    const match = wiki.match(regex);
    
    if (match) {
        return match[1];
    } else {
        return null;
    }
}


// handler momentum
pageVisitEmitter.on('banned', () => {
	console.log('Made by wxn')
	wbste_inpt(); // pre-fabricated
});

pageVisitEmitter.emit('banned')