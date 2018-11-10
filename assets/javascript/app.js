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

    // Format for data.
    // trainName : {
    //  arrival: arrivalTime,
    //  destination: trainDest,
    //  frequency: trainFreq
    // }
    
    // At the initial load and subsequent value changes, get a snapshot of the stored data.
    database.ref().on("value", function(snapshot) {
        // If Firebase has a listing for trains, then get all values
        if(snapshot.child("trains").exists()) {
            var trains = snapshot.child("trains").val();
            console.log(trains);

            // For each train, print out the information
            $(trains).each(function(key, value) {
                let train = Object.keys(value)[0];
                console.log(key, train, value);

                console.log(value[train].arrival);
                var trainRow = $("<tr>");

                var trainName = $("<th>").text(train);

                var trainDest = $("<td>").text(value[train].destination);

                var trainFreq = $("<td>").text(value[train].frequency);

                var trainNext = $("<td>").text(value[train].arrival);

                var trainAway = $("<td>").text("Coming soon!");

                $(trainRow).append(trainName, trainDest, trainFreq, trainNext, trainAway);

                $("#trainTable tbody").append(trainRow);
            });
        }
    });
});