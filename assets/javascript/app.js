$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC53q9b0YiHBVE_1C7NNPPPc3XQB2-P1CM",
        authDomain: "rh-train-scheduler.firebaseapp.com",
        databaseURL: "https://rh-train-scheduler.firebaseio.com",
        projectId: "rh-train-scheduler",
        storageBucket: "rh-train-scheduler.appspot.com",
        messagingSenderId: "576437927477"
    };
    firebase.initializeApp(config);

    // Assign the reference to the database
    var database = firebase.database();

    // Adjust the train arrival time if the time difference is negative.
    // Returns true if the arrival time was adjusted.
    function adjustArrival(arrival, frequency, id) {
        // If the arrival time is less than the current time
        if(arrival.diff(moment(), "minutes") < 0) {
            // Gets the earliest arrival time from now.
            while(arrival < moment()) {
                arrival.add(frequency, "minutes");
            }

            // Updates the arrival time in the database.
            database.ref("trains/" + id).update({
                arrival: arrival.format("HH:mm")
            });

            return true;
        }

        return false;
    }

    // Every minute, check if the train has arrived and then update the arrival time.
    function trainArriving() {
        // For each train, the number of minutes is updated.
        $("#trainTable .train").each(function(index, value) {
            // Gets the current arrival time
            let time = moment($(value).children(".train-arrival").text(), "hh:mm A");

            // Gets the frequency
            let frequency = parseInt($(value).children(".train-frequency").text());

            // If the minutes left is less than 0, then set the next train arrival according to the trains frequency.
            if(adjustArrival(time, frequency, $(value).attr("id"))) {
                // Sets the new arrival time
                $(value).children(".train-arrival").text(time.format("hh:mm A"));
            }

            // Sets the minutes to the difference between the train arrival time and the current time.
            let minutes = time.diff(moment(), "minutes");
            $(value).children(".train-next").text(minutes);
        });
    }

    // At the initial load and subsequent value changes, get a snapshot of the stored data.
    database.ref().child("trains").on("child_added", function(trains) {
        // For each train, print out the information
        $(trains.val()).each(function(index, value) {
            // The train row id is the key for easy reference.
            var trainRow = $("<tr>").attr("id", trains.key).addClass("train");

            var trainName = $("<th>").text(value.name).addClass("train-name");

            var trainDest = $("<td>").text(value.destination).addClass("train-destination");

            var trainFreq = $("<td>").text(value.frequency).addClass("train-frequency");

            let timeArr = moment(value.arrival, "HH:mm");
            var trainArr = $("<td>").text(timeArr.format("hh:mm A")).addClass("train-arrival");

            // Calculate the train's arrival time
            var trainNext = timeArr.diff(moment(), 'minutes');

            var trainAway = $("<td>").text(trainNext).addClass("train-next");

            // Add a button for updating and removing the trains
            var updateTrain = $("<button>").html("<i class='far fa-edit'></i>").addClass("update").attr({
                "data-toggle": "modal",
                "data-target": "#editTrain"
            });

            var removeTrain = $("<button>").html("<i class='far fa-trash-alt'></i>").addClass("remove").attr({
                "data-toggle": "modal",
                "data-target": "#removeTrain"
            });

            var trainStatus = $("<td>").append(updateTrain, removeTrain);

            $(trainRow).append(trainName, trainDest, trainFreq, trainArr, trainAway, trainStatus);

            $("#trainTable tbody").append(trainRow);
        });
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // When a user submits a new train, then add in the info to the database
    $("#newTrain").on("click", function(e) {
        e.preventDefault();

        // Get the inputs
        var trainName = $("#trainName").val().trim();
        var trainDest= $("#trainDest").val().trim();
        var trainArrival = moment($("#trainArr").val().trim(), "HH:mm");
        var trainFreq = $("#trainFreq").val().trim();

        // Puts the train into the database.
        database.ref().child("trains").push({
            name: trainName,
            destination: trainDest,
            arrival: trainArrival.format("HH:mm"),
            frequency: trainFreq
        });

        // Clears the inputs
        $("#trainName, #trainDest, #trainArr, #trainFreq").val("");

        // Adjusts the arrival times
        trainArriving();
    });

    // When the update button is clicked, the edit modal gets the current information into the fields.
    $("#trainTable").on("click", ".update", function() {
        // Fills in the modal.
        let trainId = "#" + $(this).parent().parent().attr("id");
        $("#editId").val(trainId);

        $("#editName").val($(trainId + " .train-name").text());

        $("#editDest").val($(trainId + " .train-destination").text());

        let time = $(trainId + " .train-arrival").text();
        $("#editArr").val(moment(time, "hh:mm A").format("HH:mm"));

        $("#editFreq").val($(trainId + " .train-frequency").text());
    });

    // When changes are saved, then update the text and database.
    $("#updateTrain").on("click", function() {
        let trainId = $("#editId").val().substring(1);
        let trainName = $("#editName").val().trim();
        let trainDest = $("#editDest").val().trim();
        let trainArr = moment($("#editArr").val().trim(), "HH:mm");
        let trainFreq = $("#editFreq").val().trim();

        // Updates the database
        database.ref("trains/" + trainId).update({
            name: trainName,
            destination: trainDest,
            arrival: trainArr.format("HH:mm"),
            frequency: trainFreq
        });

        // Updates the table.
        trainId = "#" + trainId;
        $(trainId + " .train-name").text(trainName);
        $(trainId + " .train-destination").text(trainDest);
        $(trainId + " .train-arrival").text(trainArr.format("hh:mm A"));
        $(trainId + " .train-frequency").text(trainFreq);

        // Adjusts the arrival time
        trainArriving();
    });

    // Sets up the train for deletion
    $("#trainTable").on("click", ".remove", function() {
        let trainId = $(this).parent().parent().attr("id");
        $("#deleteId").val(trainId);

        trainId = "#" + trainId;
        $("#trainDeletion").text($(trainId + " .train-name").text());
    });

    // Deletes a train from the database.
    $("#deleteTrain").on("click", function() {
        let trainId = $("#deleteId").val();

        // Removes the train from the database.
        database.ref("trains/" + trainId).remove();

        // Removes the train from the table
        $("#trainTable #" + trainId).remove();
    });

    // Sets a timer that updates the train schedule minutes to arrival every 1 minute (60 seconds)
    setInterval(trainArriving, 60000);
});