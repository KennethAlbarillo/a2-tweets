function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: Filter to just the written tweets
	searchBox = document.getElementById("textFilter");
	boxValue = "";
	searchBox.addEventListener("input", (theBox) => {
		boxValue = theBox.target.value.trim().toLowerCase();
		console.log(`boxValue : ${boxValue}`);
		let index = 0;
		let tableIndex = 1;
		let text = "";
		let tableText = "";
		if (boxValue != ""){
			for (index in tweet_array){
				text = tweet_array[index].text.toLowerCase();
				
				if (text.includes(boxValue) && tweet_array[index].activityType != ""){
					tableText += tweet_array[index].getHTMLTableRow(tableIndex);
					tableIndex += 1;
				}
			}
		}

		const tbody = document.getElementById('tweetTable');
		tbody.innerHTML = tableText;
		document.getElementById('searchCount').innerText = tableIndex - 1;
		document.getElementById('searchText').innerText = boxValue;
	});

}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	/*
	const searchBox = document.getElementById("textFilter");
	searchBox.addEventListener("input", (theBox) => {
		const boxValue = theBox.target.value.trim().toLowerCase();
		console.log(`boxValue : ${boxValue}`);
	});
	*/

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});