function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	const completedEventWordOne = "completed";
	const completedEventWordTwo = "posted";
	const liveEventWordOne = "watch";
	const liveEventWordTwo = "right now";
	const achievedEventWord = "achieved";
	let dateElements = [];
	let earliestDate = [0,0,0];
	let latestDate = [0,0,0];
	let month = 0;
	let day = 0;
	let year = 0;
	let text = "";
	let completedEvents = 0;
	let liveEvents = 0;
	let achievedEvents = 0;
	let otherEvents = 0;
	for (const dictonaryElement of tweet_array){
		for (const key in dictonaryElement){
			console.log(`${key}, Type: ${typeof dictonaryElement[key]}`);
			if (key === "text"){
				text = dictonaryElement[key];
				if (text.toLowerCase().includes(completedEventWordOne) || text.toLowerCase().includes(completedEventWordTwo)){
					completedEvents += 1;
				} else if (text.toLowerCase().includes(liveEventWordOne) && text.toLowerCase().includes(liveEventWordTwo)){
					liveEvents += 1;
				} else if (text.toLowerCase().includes(achievedEventWord)){
					achievedEvents += 1;
				} else {
					otherEvents += 1;
				}
			} else if (key === "time"){
				text = dictonaryElement[key].toLocaleDateString(undefined);
				dateElements = text.split('/');
				console.log(`Text : ${text}\nWords: ${dateElements}`);
				month = parseInt(dateElements[0], 10);
				day = parseInt(dateElements[1], 10);
				year = parseInt(dateElements[2], 10);
				/* Compare to earliestDate */
				if (earliestDate[2] === 0 && earliestDate[1] === 0 && earliestDate[0] === 0){
					earliestDate[2] = year;
					earliestDate[1] = day;
					earliestDate[0] = month;
				} else if (earliestDate[2] > year){
					earliestDate[2] = year;
					earliestDate[1] = day;
					earliestDate[0] = month;
				} else if (earliestDate[2] === year && earliestDate[0] > month){
					earliestDate[2] = year;
					earliestDate[1] = day;
					earliestDate[0] = month;
				} else if (earliestDate[2] === year && earliestDate[0] === month && earliestDate[1] > day){
					earliestDate[2] = year;
					earliestDate[1] = day;
					earliestDate[0] = month;
				}
				/* Compare to latestDate */
				if (latestDate[2] === 0 && latestDate[1] === 0 && latestDate[0] === 0){
					latestDate[2] = year;
					latestDate[1] = day;
					latestDate[0] = month;
				} else if (latestDate[2] < year){
					latestDate[2] = year;
					latestDate[1] = day;
					latestDate[0] = month;
				} else if (latestDate[2] === year && latestDate[1] < month){
					latestDate[2] = year;
					latestDate[1] = day;
					latestDate[0] = month;
				} else if (latestDate[2] === year && latestDate[1] === month && latestDate[0] < day){
					latestDate[2] = year;
					latestDate[1] = day;
					latestDate[0] = month;
				}
			}
		}
	}
	/* Change dates to string | change month element from integer to the month it references.*/
	const options = {month: "long", day: 'numeric', year: "numeric"};
	const earliestDateType = new Date(earliestDate[2], earliestDate[0] - 1, earliestDate[1]);
	const latestDateType = new Date(latestDate[2], latestDate[0] - 1, latestDate[1]);
	console.log(earliestDateType.toLocaleString('default', options));
	console.log(latestDateType.toLocaleString('default', options));
	document.getElementById('numberTweets').innerText = tweet_array.length;
	document.getElementById('firstDate').innerText = earliestDateType.toLocaleString('default', options);
	document.getElementById('lastDate').innerText = latestDateType.toLocaleString('default', options);
	document.querySelectorAll('.completedEvents').forEach(element =>{
		element.innerText = completedEvents;
	});
	document.querySelectorAll('.liveEvents').forEach(element =>{
		element.innerText = liveEvents;
	});
	document.querySelectorAll('.achievements').forEach(element =>{
		element.innerText = achievedEvents;
	});
	document.querySelectorAll('.miscellaneous').forEach(element =>{
		element.innerText = otherEvents;
	});
}
		

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
