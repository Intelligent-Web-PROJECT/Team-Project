document.addEventListener('DOMContentLoaded', function (){
    // plant listing file used to post a new plant
    const nicknameField = document.getElementById('nickname');
    let nickname = sessionStorage.getItem('nickName');
    if (nicknameField && nickname) {
        nicknameField.value = nickname;
    }

    const unknownBtn = document.getElementById('unknown')
    const uncertainBtn = document.getElementById('uncertain')

    unknownBtn.addEventListener('click', ()=> {

    })

    const uploadBtn = document.getElementById('uploadBtn')
    const cameraBtn = document.getElementById('clickPicBtn')
    const submitBtn = document.getElementById('submitBtn')
    const imageUpload = document.getElementById('imageUpload')
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');

    // Initialize the Webcam library
    const webcam = new Webcam(webcamElement, 'user', canvasElement);

    const name = document.getElementById('name')
    const description = document.getElementById('description')
    const height = document.getElementById('height')
    const spread = document.getElementById('spread')
    const flowerColour = document.getElementById('colour')
    const date = document.getElementById('date')

    const flowerYes = document.getElementById('flowerYes')
    const leavesYes = document.getElementById('leavesYes')
    const fruitsYes = document.getElementById('fruitsYes')

    const imagePreview = document.getElementById('imagePreview')

    unknownBtn.addEventListener('click', ()=> {
        name.value = 'Unknown'
    })

    uncertainBtn.addEventListener('click', ()=> {
        let uncertainText = name.value
        if (uncertainText !== '') {
            uncertainText += '( Uncertain )'
            name.value = uncertainText
        }
    })


    /*
        Used leaflet js to implement location picker functionality
        uses navigator.geolocation to retrieve the current position
     */

    let plantLatitude = 0
    let plantLongitude = 0

    var map = L.map('map');
    map.setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    navigator.geolocation.getCurrentPosition(success, error);

    let marker, circle, zoomed;
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        if (marker) {
            map.removeLayer(marker)
            map.removeLayer(circle)
        }
        plantLatitude = latitude
        plantLongitude = longitude

        marker = L.marker([latitude, longitude]).addTo(map)
        circle = L.circle([latitude, longitude], {radius: accuracy}).addTo(map)

        if (!zoomed) {
            zoomed = map.fitBounds(circle.getBounds());
        }

        map.on('click', (event) => {
            if (marker) {
                map.removeLayer(marker)
                map.removeLayer(circle)
            }
            marker = L.marker([event.latlng.lat, event.latlng.lng]).addTo(map)
            circle = L.circle([event.latlng.lat, event.latlng.lng], {radius: accuracy}).addTo(map)
            plantLatitude = event.latlng.lat
            plantLongitude = event.latlng.lng
            console.log(event.latlng)
        })
    }

    function error(error) {
        if (error.code === 1) {
            alert('Please allow geolocation access')
        } else {
            alert('Cannot get current location')
        }
    }


    let base64 = null


    // Image upload and camera button to add images of the plant

    uploadBtn.addEventListener("click", function() {
        imageUpload.click(); // Triggers the file input click
    });

    imageUpload.addEventListener("change", function() {
        imagePreview.innerHTML = ''; // Clear previous previews

        // Update display text to show number of files selected
        const displayText = document.querySelector("#fileName");
        displayText.textContent = this.files && this.files.length > 0 ? `Selected files: ${this.files.length}` : "";

        // Check if files are present and loop through all selected files
        if (this.files) {
            Array.from(this.files).forEach(file => {
                // Ensure the file is actually a File object
                if (file instanceof File) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // Create an image element for each file
                        const imgElement = `<img src="${e.target.result}" class="img-thumbnail" style="margin-right: 10px; max-height: 500px">`;
                        imagePreview.innerHTML += imgElement; // Append new image element to the preview container
                    };
                    reader.readAsDataURL(file); // Read the file as a Data URL
                }
            });
        }
    });

    // Click picture using webcam camera

    cameraBtn.addEventListener('click', function() {
        if (cameraBtn.innerText === "Click a picture") {
            // Clear the previous image preview
            imagePreview.innerHTML = '';

            // Show the webcam and hide the canvas
            webcamElement.style.display = 'block';
            canvasElement.style.display = 'none';

            // Start the webcam
            webcam.start()
                .then(result => {
                    console.log("Webcam started");
                    cameraBtn.innerText = "Take Picture"; // Change button text to prompt user to take a picture
                })
                .catch(err => {
                    console.error("Failed to start webcam:", err);
                });
        } else {
            // Take a picture
            const picture = webcam.snap();
            console.log(picture)
            console.log(typeof(picture))
            base64 = picture
            imagePreview.innerHTML = `<img src="${picture}" class="img-thumbnail">`; // Display the new picture

            // Show the canvas and hide the webcam
            webcamElement.style.display = 'none';
            webcam.stop(); // Stop the webcam



            console.log("Picture taken");
            cameraBtn.innerText = "Click a picture"; // Reset button text to allow another picture to be taken
        }
    });


    function getSunExposureValue() {
        const sunRadios = document.querySelectorAll('input[name="sunRadio"]');

        let checkedValue = null;

        sunRadios.forEach(radio => {
            if (radio.checked) {
                checkedValue = radio.value;
            }
        });

        return checkedValue;
    }

    // Submit function to post the plant details to the mongodb or indexed db server based on the device network i.e. online or offline

    submitBtn.addEventListener('click', () => {
        let formData = new FormData();
        let plantName = name.value
        nickname = nicknameField.value.trim()
        plantName = plantName.charAt(0).toUpperCase() + plantName.slice(1)
        sessionStorage.setItem('nickName', nickname)
        formData.append('name', plantName);
        formData.append('nickname', nickname)
        formData.append('description', description.value);
        formData.append('date', date.value)
        formData.append('height', height.value);
        formData.append('spread', spread.value);
        formData.append('flowers', flowerYes.checked);
        formData.append('leaves', leavesYes.checked);
        formData.append('fruits', fruitsYes.checked);
        formData.append('sunExposure', getSunExposureValue());
        formData.append('flowerColour', flowerColour.value);
        formData.append('longitude', plantLongitude)
        formData.append('latitude', plantLatitude)
        if (base64 !== null) {
            formData.append('camera', base64);
        }
        if (imageUpload.files.length === 0 && base64 === null) {
            return alert('Please Upload at least one photo of the plant');

        } else {
            for (var i = 0; i < imageUpload.files.length; i++) {
                formData.append('photos', imageUpload.files[i]);
            }
        }
        if (height.value==='0' || spread.value==='0') {
            alert("Plant height and spread must be greater than 0!");
            return;
        }
        let plants={};
        for (const [key, value] of formData.entries()) {
            plants[key] = value;
        }
        if (navigator.onLine){
            fetch('list-plant', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    window.location.href = '/allPlants'
                    if (Notification.permission === "granted") {
                        // If it's okay, let's create a notification
                        const notification = new Notification("You plant has successfully been posted");
                    } else if (Notification.permission !== "denied") {
                        Notification.requestPermission().then(function (permission) {
                            // If the user accepts, let's create a notification
                            if (permission === "granted") {
                                const notification = new Notification("You plant has successfully been posted");
                            }
                        });
                    }
                    return response.text()

                })
                .catch(error => {
                    console.log(error);
                });
        }
        else {
            insertPlantSighting(plants,-1);
        }
    });


})