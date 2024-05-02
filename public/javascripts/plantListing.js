document.addEventListener('DOMContentLoaded', function (){
    const uploadBtn = document.getElementById('uploadBtn')
    const cameraBtn = document.getElementById('clickPicBtn')
    const submitBtn = document.getElementById('submitBtn')
    const imageUpload = document.getElementById('imageUpload')

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
        imageUpload.click();
    });

    imageUpload.addEventListener("change", function() {
        const selectedFile = this.files[0];
        const displayText = document.querySelector("#fileName");
        displayText.textContent = selectedFile ? `Selected file: ${selectedFile.name}` : "";
        const file = imageUpload.files[0]

        imagePreview.innerHTML = ''

        const reader = new FileReader()
        reader.onload = function() {
            var templateString = `<img src="${reader.result}" class="img-thumbnail">`
            imagePreview.innerHTML += templateString
        }
        reader.readAsDataURL(file)

    });

    cameraBtn.addEventListener('click', () => {
        console.log(cameraBtn.innerText)
    })

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