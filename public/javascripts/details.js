// window.onload = async function() {
//     registerSync()
// }

function updateIdentification() {
    const plantName = document.getElementById('plantName')

    let url = window.location.href;
    let parts = url.split("/");
    let id = parts[parts.length - 1];

    const formData = new FormData()
    formData.append('name', plantName.value)

    fetch(`/updatePlant/${id}`, {
        method:'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response error")
            }
            window.location.href = `/plants/${id}`
            return response.text()
        })
        .catch(error => {
            console.log(error)
        })

}
