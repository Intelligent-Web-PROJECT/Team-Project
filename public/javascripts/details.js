window.onload = async function() {
    syncChats()
}

// function to update the plant name when the update button is clicked
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



// function to sync chats when online
function syncChats() {
    new Promise(function (resolve, reject) {
        Notification.requestPermission(function (result) {
            resolve();
        })
    }).then(function () {
        return navigator.serviceWorker.ready;
    }).then(async function (sw) {
        return sw.sync.register('sync-tag');
    }).then(function () {
        console.info('Sync registered');
    }).catch(function (err) {
        console.error('Failed to register sync:', err.message);
    });
}