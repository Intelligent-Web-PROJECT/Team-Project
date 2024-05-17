# Team-Project - FloraScan

A Plant Recognition Web Application


## How to Run the project on Your Local Machine:

### Technologies used in this project:

* Node.js (Express)
* MongoDB, Mongoose
* Leaflet js
* Socket.io
* EJS
* Multer
* Webcam easy

### Type the following commands in your terminal

npm install

npm start

This will open a server listening localhost:3000 and show the following link 

'Server is running on: http://localhost:3000'

Click on the link to start exploring FloraScan

### User Guide
![LandingPage.png](..%2F..%2FDownloads%2FInteliigentweb%2FLandingPage.png)

1. You can choose to start by entering your nickname in the nickname field.
2. Click on **'Start Exploring'** button.
3. You will be redirected to **All Plants** page, where you can view all the plants added to the database.
4. 
![AllPlants.png](..%2F..%2FDownloads%2FInteliigentweb%2FAllPlants.png)

4. Here you can filter the plants based on:
    * Distance (farthest) - Plants which are far appear first.
    * Distance (nearest) - Plants which are near appear first.
    * Has flowers - Plants which have flowers.
    * No flowers - Plants which do not have flowers.
    * Most Recent - Most recently added plants appear first.
5. Click on **Add Plant** button to add a new plant sighting. It will redirect to **Add Plant** page.

![AddPlant.png](..%2F..%2FDownloads%2FInteliigentweb%2FAddPlant.png)

6. First you need to give the permission for geolocation. i.e. the popup which appears at the top.
7. You can upload a picture or click a picture. When a picture is uploaded you will get an image preview on the side. (**Note:** for clicking a picture give permission for accessing your webcam)
8. Fill the name field. If you do not know the name then click **Unknown** button or if you are uncertain of the name then, type the name along with the **Uncertain** button.
9. Fill a short description of the plant. Followed by Date, Plant height and spread (in cm approx).
10. Select the appropriate characteristics provided and if the plant does not have any flowers then the **Flower Colour** field needs to be **N/A**.
11. Next Select a location on the map. This is the location of the plant you sighted at.
12. Click **Submit** button. This should add your plant to the database, and you can view it on the **All Plants** page.
13. In the **All Plants** page, you select a plant to view its details. Click on the **View** button of any plant.
14. This will redirect you to the **Plant details** page.

![Detail.png](..%2F..%2FDownloads%2FInteliigentweb%2FDetail.png)

15. This page contains the information given by the author and also details from **DBPedia**.
16. At the bottom of the page, you can click on the **View chats** button to send a text.
17. Here you can use this chat to suggest name, if the author is uncertain or do not know the plant name. 
18. If you are the author, you should see an edit button. You can use this update the plant name.

### Offline listing of plant and chat

When the device is offline the details will be stored in IndexedDB and when the device is online, refresh the page and this will be added to the database.
Same with the chat messages.
