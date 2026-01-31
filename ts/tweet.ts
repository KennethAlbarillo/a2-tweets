class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        // completed : #Runkeeper && nothing else
        // achievement : #FitnessAlert && #Runkeeper
        // live_event : #RKLive && #Runkeeper
        // other : base statement
        const compeletedKey: string = "#Runkeeper";
        const achievementKey: string = "#FitnessAlerts";
        const liveEventKey: string = "#RKLive";
        const textArray: string[] = this.text.split(" ");
        if (textArray.includes(achievementKey)){
            return "achievement";
        } else if (textArray.includes(compeletedKey) && !(textArray.includes(achievementKey)) && !(textArray.includes(liveEventKey))){
            return "completed_event";
        } else if (textArray.includes(liveEventKey) && textArray.includes(compeletedKey) && !(textArray.includes(achievementKey))){
            return "live_event";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        // usual length of an auto-generated tweet is 13 for completed
        // usual length of an auto generated tweet is 10 for achieved && live_event
        // miscellaneous is always user-generated so return true
        const textArrayLength = this.text.split(" ").length;
        if (this.source === "completed_event" && textArrayLength === 13){
            return false;
        } else if (this.source === "achievement" || this.source === "live_event" && textArrayLength === 10){
            return false;
        }
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType():string {
        // Possible activites: ski, yoga, walk, workout, Freestyle, run, bike, swim, row
        // There's different types of workouts, but for now ill keep it general
        // There's one called 'activity', but I won't count it
        const activitesArray: string[] = ['ski', 'row', 'swim', 'bike', 'walk', 'run'];
        // console.log(`Boolean: ${this.source == "completed_event"} |Text : ${this.text}`);
        if(this.source == "completed_event"){
            for (const word in activitesArray){
                // console.log(`Word : ${activitesArray[word]}`);
                if (this.text.search(activitesArray[word]) != -1){return activitesArray[word];}
            }
        }
        //TODO: parse the activity type from the text of the tweet
        // Just completed a 4.87 mi walk | 5 completed
        // Watch my run | 3 live_event
        // Just posted a meditation | 4 completed
        // 
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const textArray: string[] = this.text.split(" ");
        if (textArray[4] !== "mi" && textArray[4] !== "km"){
            // console.log(this.text);
            return 0;
        }
        let distance = parseFloat(textArray[3]);
        if (textArray[4] === "km"){
            distance /= 1.609;
        }

        return Math.round(distance * 100)/100;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}