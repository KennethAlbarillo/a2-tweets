function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	let completedEvents = 0;
	let index = 0;
	let largestDistance = 0;
	let smallestDistance = 0;
	let weekendCount = 0;
	let weekdayCount = 0;

	const activityInterface = {
		ski: {"activitiesCompleted": 0, "distance": 0},
		freestyle: {"activitiesCompleted": 0, "distance": 0},
		elliptical: {"activitiesCompleted": 0, "distance": 0},
		yoga: {"activitiesCompleted": 0},
		row: {"activitiesCompleted": 0, "distance": 0},
		swim: {"activitiesCompleted": 0, "distance": 0},
		bike: {"activitiesCompleted": 0, "distance": 0},
		walk: {"activitiesCompleted": 0, "distance": 0},
		run: {"activitiesCompleted": 0, "distance": 0},
	}

	const daysWithDistance = [

	]

	weekdayArray = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
	weekendArray = ['Sat', 'Sun'];

	for (index in tweet_array){
		if (tweet_array[index].source === "completed_event"){
			completedEvents += 1;
			// console.log(`Distance: ${tweet_array[index].distance} miles\nText : ${tweet_array[index].text}`);
			textArray = tweet_array[index].time.toString().split(" ");
			if (largestDistance === 0 && smallestDistance === 0){
				largestDistance = tweet_array[index].distance;
				smallestDistance = tweet_array[index].distance;
			} else {
				if (tweet_array[index].distance > 0){
					daysWithDistance.push({day: textArray[0], distance: tweet_array[index].distance});

				}
				if (largestDistance < tweet_array[index].distance){
					largestDistance = tweet_array[index].distance;
					if (textArray[0] in weekdayArray){weekdayCount += 1;}
					if (textArray[0] in weekendArray){weekendCount += 1;}
				} 
				if (smallestDistance > tweet_array[index].distance && 0 != tweet_array[index].distance){
					smallestDistance = tweet_array[index].distance;
				}
			} 
			if (tweet_array[index].activityType != ""){
				activityInterface[tweet_array[index].activityType]["activitiesCompleted"] += 1;
				if (tweet_array[index].distance != 0){
					activityInterface[tweet_array[index].activityType]["distance"] += tweet_array[index].distance;
				}
			}
		}
	};

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	// let avgLargest = {name: "", distance: 0};
	// let avgSmallest = {name: "", distance: Infinity};
	// // console.log(JSON.stringify(activityInterface, null, 2));

	// for (let activity in activityInterface){
	// 	const currentAverage = activityInterface[activity]["distance"]/activityInterface[activity]["activitiesCompleted"];
	// 	// console.log(`Activity : ${activity} | Average : ${currentAverage}`);
	// 	// console.log(`Largest :\n${avgLargest.name}'s Distance : ${avgLargest.distance} | Current : ${currentAverage}\n Boolean : ${avgLargest.distance < currentAverage}`);
	// 	if (currentAverage > avgLargest.distance){
	// 		avgLargest.name = activity;
	// 		avgLargest.distance = currentAverage;
	// 	}
	// 	// console.log(`Smallest :\n${avgSmallest.name}'s Distance : ${avgSmallest.distance} | Current : ${currentAverage}\n Boolean : ${avgSmallest.distance > currentAverage}`);
	// 	if (currentAverage < avgSmallest.distance){
	// 		avgSmallest.name = activity;
	// 		avgSmallest.distance = currentAverage;
	// 	}
	// 	// console.log(`avgLargest.distance : ${avgLargest.distance}\navgSmallest.distance : ${avgSmallest.distance}`);
	// }

	// console.log(`Longest Distance : ${avgLargest["distance"]} mile ${avgLargest["name"]}`);
	// console.log(`Shortest Distance : ${avgSmallest["distance"]} mile ${avgSmallest["name"]}`);
	
	const sortedInterface = Object.entries(activityInterface).map(
		([name, items]) => ({
			name, ...items
		})
	);
	const mostPopular = {};
	sortedInterface.sort((a,b) => b.activitiesCompleted - a.activitiesCompleted);
	firstMost = sortedInterface[0].name;
	secondMost = sortedInterface[1].name;
	thirdMost = sortedInterface[2].name;
	mostPopular[firstMost] = {distance: sortedInterface[0].distance};
	mostPopular[secondMost] = {distance: sortedInterface[1].distance};
	mostPopular[thirdMost] = {distance: sortedInterface[2].distance};
	// console.log(`first : ${sortedInterface[0].distance}\nsecond: ${sortedInterface[1].distance}\nthird: ${sortedInterface[2].distance}`);
	let avgLargest = "";
	let avgSmallest = "";
	const sortedPop = Object.entries(mostPopular).map(
		([name, items]) => ({
			name, ...items
		})
	);
	sortedPop.sort((a,b) => b.distance - a.distance);
	avgLargest = sortedPop[0];
	avgSmallest = sortedPop[2];
	weekdayOrWeekendLonger = "";
	if (weekdayCount > weekendCount){
		weekdayOrWeekendLonger = "Weekdays";
	} else {
		weekdayOrWeekendLonger = "Weekends";
	}
	
	// console.log(tweet_array[0]);
	// console.log(daysWithDistance);
	tweet_array = daysWithDistance;
	let aggregateBoolean = false;
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  },
	  //TODO: Add mark and encoding
	  "mark": {
		"type": "point",
	  },
	  "encoding":{
		"x": {
			"field": "day",
			"type": "ordinal",
			"sort": ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			"title": "time(day)"
		},
		"y":{
			"field" : "distance",
			"type": "quantitative",
		}
	}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// Check if 'show means' is pressed
	
	document.getElementById("aggregate").addEventListener("click", (e) => {
		// console.log("clicked");
		aggregateBoolean = !aggregateBoolean; // Change boolean
		
		if (aggregateBoolean){
			activity_vis_spec["encoding"]["y"]["aggregate"] = "mean";
			e.target.innerText = "Show all activities";
		} else {
			delete activity_vis_spec.encoding.y.aggregate;
			e.target.innerText = "Show means";
		}

		// console.log(aggregateBoolean);
		vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	document.getElementById("numberActivities").innerText = completedEvents;
	document.getElementById("firstMost").innerText = firstMost;
	document.getElementById("secondMost").innerText = secondMost;
	document.getElementById("thirdMost").innerText = thirdMost;
	document.getElementById("longestActivityType").innerText = avgLargest["name"];
	document.getElementById("shortestActivityType").innerText = avgSmallest["name"];
	document.getElementById("weekdayOrWeekendLonger").innerText = weekdayOrWeekendLonger;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});