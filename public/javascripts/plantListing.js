document.addEventListener('DOMContentLoaded', function (){
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

    const flowerYes = document.getElementById('flowerYes')
    const flowerNo = document.getElementById("flowerNo");
    const leavesYes = document.getElementById('leavesYes')
    const fruitsYes = document.getElementById('fruitsYes')

    const imagePreview = document.getElementById('imagePreview')

    flowerYes.addEventListener('change', () => {
        flowerColour.disabled = !flowerYes.checked;
    })

    flowerNo.addEventListener('change', () => {
        flowerColour.disabled = !flowerNo.checked
    })


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
                        const imgElement = `<img src="${e.target.result}" class="img-thumbnail" style="margin-right: 10px;">`;
                        imagePreview.innerHTML += imgElement; // Append new image element to the preview container
                    };
                    reader.readAsDataURL(file); // Read the file as a Data URL
                }
            });
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        let uploadBtn = document.getElementById('uploadBtn');
        if (!uploadBtn) {
            uploadBtn = document.createElement('button');
            uploadBtn.id = 'uploadBtn';
            uploadBtn.innerText = 'Upload Picture';
            uploadBtn.className = 'btn btn-primary';
            document.body.appendChild(uploadBtn); // Append to a suitable container in your actual layout

            // Add event listener for upload functionality
            uploadBtn.addEventListener('click', function() {
                console.log("Upload the picture...");
                // Here you would typically handle the file upload process
            });
        }
    });

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

    submitBtn.addEventListener('click', () => {

        let formData = new FormData()
        formData.append('name', name.value)
        formData.append('description', description.value)
        formData.append('height', height.value)
        formData.append('spread', spread.value)
        formData.append('flowers', flowerYes.checked)
        formData.append('leaves', leavesYes.checked)
        formData.append('fruits', fruitsYes.checked)
        formData.append('sunExposure', getSunExposureValue())
        if (flowerYes.checked) {
            formData.append('flowerColour', flowerColour.value)
        }

        if (imageUpload.files.length === 0) {
            return alert('Please Upload at least one photo of the plant')
        } else {
            for (var i = 0; i < imageUpload.files.length; i++) {
                formData.append('photos', imageUpload.files[i])
            }
        }

        fetch('list-plant', {
            method:'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                window.location.href = '/welcome'
                return response.text()
            })
            .catch(error => {
                console.log(error)
            })
    })

})