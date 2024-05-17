let requestIndexedDB = indexedDB.open("plantRecogn",2)
requestIndexedDB.addEventListener("error",handlerError)
requestIndexedDB.addEventListener("upgradeneeded",upgradeStores)
requestIndexedDB.addEventListener("success", handleSuccess)

function insertPlantSighting (data,id){
    console.log("insertPlantsSighting to indexDB")
    const plantsIDB = requestIndexedDB.result
    const transaction = plantsIDB.transaction(["plantsSighting"],"readwrite")
    const plantsStore = transaction.objectStore("plantsSighting")
    //setting id here
    data._id = id
    console.log(data)

    const addRequest = plantsStore.add(data)
    addRequest.onsuccess = (event) => {
        console.log("New plants sighting added to the database with id:", event.target.result);
        setTimeout(() => {
            window.location.href = "/allPlants";
        }, 1000);
    };
    addRequest.onerror = (event) => {
        console.error("Error adding new sighting to database:", event.target.error)
    }
}


function insertComment (data, id){
    console.log("insertComment",insertComment)
    const birtWatchingIDB = requestIndexedDB.result
    const transaction = birtWatchingIDB.transaction(["comment"],"readwrite")
    const commentStore = transaction.objectStore("comment")

    let parsedData = JSON.parse(data)

    let comment = {
        idText: id,
        plant: parsedData.plant,
        text: parsedData.text,
        user: parsedData.nickname,
        time: Date.now()
    };

    const addRequest = commentStore.add(comment)
    addRequest.onsuccess = (event) => {
        console.log("New Comment added to database with id:", event.target.result);
    };
    addRequest.onerror = (event) => {
        console.error("Error Comment new sighting to database:", event.target.error)
    }
}


function getPlantSighting() {
    return new Promise((resolve, reject) => {
        const plantsIDB = requestIndexedDB.result;
        const transaction = plantsIDB.transaction(["plantsSighting"], "readwrite");
        const plantsStore = transaction.objectStore("plantsSighting");
        // retrieve a cursor that allows iterating over the objects in the object store
        const cursorRequest = plantsStore.openCursor();
        const result = []; // store result query

        cursorRequest.onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const data = cursor.value;
                if (data._id === -1) {
                    result.push(data);
                }
                cursor.continue();
            } else {
                resolve(result);
            }
        }
    })
}


/**
 * Handling IndexDb Error case
 */
function handlerError(err){
    console.log(`IndexDb Error: ${err}` )
}

/**
 * Handling IndexDB Upgrade Plants case
 */
function upgradeStores(ev){
    const db = ev.target.result
    db.createObjectStore("plantsSighting",{keyPath:"id", autoIncrement : true})
    db.createObjectStore("comment",{keyPath:"id", autoIncrement : true})
    console.log("Object:'Plants Sighting' created in upgradeStores" )
}

/**
 * Handling IndexDB Success case
 */
function handleSuccess(ev){
    // initialising
    console.log("IndexDb Success!" )
}

