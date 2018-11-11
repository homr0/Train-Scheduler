$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAx6bhUQgob9ADv_fv9oseaNunmaoQSul8",
        authDomain: "rh-ucrdb.firebaseapp.com",
        databaseURL: "https://rh-ucrdb.firebaseio.com/",
        projectId: "rh-ucrdb",
        storageBucket: "rh-ucrdb.appspot.com",
        messagingSenderId: "260329346405"
    };
    firebase.initializeApp(config);

    // Assign the reference to the database
    var database = firebase.database();

    // Every minute, check if the train has arrived and then update the arrival time.
    function trainArriving() {
        // For each train, the number of minutes is updated.
        $("#trainTable .train").each(function(index, value) {
            // Gets the current arrival time
            let time = moment($(value).children(".train-arrival").text(), "hh:mm A");
            console.log(time.format("HH:mm"));

            // Gets the current minutes left
            let minutes = parseInt($(value).children(".train-next").text());
            console.log(minutes);

            // If the minutes left is less than 0, then set the next train arrival according to the trains frequency.
            if(minutes < 0) {
                // Gets the frequency
                let frequency = parseInt($(value).children(".train-frequency").text());
                console.log("Frequency: " + frequency);

                // Gets the new arrival time so that it's later than the current time.
                while(time < moment()) {
                    time.add(frequency, "minutes");
                    console.log(time.format("HH:mm"));
                }

                // Put that new time into the database.
                console.log($(value).attr("id"));
                database.ref("trains/" + $(value).attr("id")).update({
                    arrival: time.format("HH:mm")
                });

                // Sets the new arrival time
                $(value).children(".train-arrival").text(time.format("hh:mm A"));
            }

            // Sets the minutes to the difference between the train arrival time and the current time.
            minutes = time.diff(moment(), "minutes");
            $(value).children(".train-next").text(minutes);
        });
    }

    // At the initial load and subsequent value changes, get a snapshot of the stored data.
    database.ref().child("trains").on("child_added", function(trains) {
        // For each train, print out the information
        $(trains.val()).each(function(index, value) {
            // The train row id is the key for easy reference.
            var trainRow = $("<tr>").attr("id", trains.key).addClass("train");

            var trainName = $("<th>").text(value.name);

            var trainDest = $("<td>").text(value.destination);

            var trainFreq = $("<td>").text(value.frequency).addClass("train-frequency");

            let timeArr = moment(value.arrival, "HH:mm");
            var trainArr = $("<td>").text(timeArr.format("hh:mm A")).addClass("train-arrival");

            // Calculate the train's arrival time
            var trainNext = timeArr.diff(moment(), 'minutes');

            var trainAway = $("<td>").text(trainNext).addClass("train-next");

            $(trainRow).append(trainName, trainDest, trainFreq, trainArr, trainAway);

            $("#trainTable tbody").append(trainRow);
        });

        trainArriving();
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // When a user submits a new train, then add in the info to the database
    $("#newTrain").on("click", function(e) {
        e.preventDefault();

        // Get the inputs
        var trainName = $("#trainName").val().trim();
        var trainDest= $("#trainDest").val().trim();
        var trainArrival = $("#trainArr").val().trim();
        var trainFreq = $("#trainFreq").val().trim();

        // Puts the train into the database.
        database.ref().child("trains").push({
            name: trainName,
            destination: trainDest,
            arrival: trainArrival,
            frequency: trainFreq
        });

        // Clears the inputs
        $("#trainName, #trainDest, #trainArr, #trainFreq").val("");
    });
});