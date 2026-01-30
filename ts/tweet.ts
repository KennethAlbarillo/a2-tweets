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
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}