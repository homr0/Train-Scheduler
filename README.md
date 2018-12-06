# Train Hopper Express

Keep track of all the trains you want to catch.

## Instructions

**\*** You need to be logged in with a valid Google account to view the Train Hopper Express.

1. View current trains that are being tracked on the **Current Train Schedule**
2. To add a train, go to **Add a Train** and put in the train's *name*, *destination*, *first arrival time* (in military time), and *frequency*.
3. The newly added train will show up on the **Current Train Schedule**.
4. To edit an existing train, click on the blue *pencil* button to change either the train's *name*, *destination*, *arrival time*, and *frequency*. Once done, make sure to save your changes.
5. To delete a train, click on the red *trash can* button. You will need to confirm the deletion on the modal that opens.

## Developer Diary

Contrary to the road trip by car, travelling by train requires keeping track of various schedules depending on your destination. When travelling in a group, it is important for everyone to remain on schedule to not be left behind.

Since these train schedules need to be shared with multiple people over multiple devices, there needs to be a server-side application to keep track of the schedules. Additionally, during a trip, trains can be added, edited, or removed. All of these changes must be transmitted to the database where the schedules are kept.

To implement this project, I used Firebase for keeping track of the train schedules and JavaScript for transmitting any changes that occur on the client-side. These changes include modifications to train schedules as well as keeping track of the time left for the train to arrive.