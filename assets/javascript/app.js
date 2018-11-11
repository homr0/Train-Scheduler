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

    }
    trainArriving();

    // At the initial load and subsequent value changes, get a snapshot of the stored data.
    database.ref().child("trains").on("child_added", function(trains) {
        // For each train, print out the information
        $(trains.val()).each(function(key, value) {
            var trainRow = $("<tr>");

            var trainName = $("<th>").text(value.name);

            var trainDest = $("<td>").text(value.destination);

            var trainFreq = $("<td>").text(value.frequency);

            let timeArr = moment(value.arrival, "HH:mm");
            var trainArr = $("<td>").text(timeArr.format("hh:mm A"));

            // Calculate the train's arrival time
            var trainNext = timeArr.diff(moment(), 'minutes');

            var trainAway = $("<td>").text(trainNext);

            $(trainRow).append(trainName, trainDest, trainFreq, trainArr, trainAway);

            $("#trainTable tbody").append(trainRow);
        });
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