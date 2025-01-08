const photoJSON = fetch("./photoData.json")
                    .then(response => response.json())
                    .catch(error => {
                        console.error("Error loading photo JSON file:", error);
});
let maxZIndex = 0;

function createPhotos() {
    photoJSON.then(data => {
        for(const fileName in data) {
            if(data.hasOwnProperty(fileName)) {
                const img = document.createElement("img");

                img.src = "./photos/" + fileName;
                img.addEventListener("load", () => {
                    const div = document.createElement("div");
                    div.appendChild(img);
                    
                    determineDirection(img, div);
                    randomizePlacement(div);
                    makeDraggable(div);

                    div.classList.add("photoCard");

                    div.addEventListener("dblclick", () => {
                        displayPhotoInfo(div);
                        focusPhoto(div);
                    });
                    
                    maxZIndex++;
                    document.body.appendChild(div);
                });
            }
        }
    });
}

function determineDirection(img, div) {
    if(img.width < 2500) {
        div.classList.add("vertical");
    }
    else {
        div.classList.add("horizontal");
    }
}

function randomizePlacement(div) {
    const bodyWidth = document.body.clientWidth;
    const bodyHeight = document.body.clientHeight;

    const placementLeft= Math.floor(Math.random() * (bodyWidth - 175)) + 50;
    const placementTop= Math.floor(Math.random() * (bodyHeight + 750)) + 50;
    const rotation = Math.floor(Math.random() * 360);

    div.style.top = placementTop + "px";
    div.style.left = placementLeft + "px";
    div.style.transform = "rotate(" + rotation + "deg)";
}

function makeDraggable(photo) {
    let isDragging = false;
    let offsetX, offsetY;

    photo.addEventListener("mousedown", (e) => { 
        e.preventDefault();

        if(photo.classList.contains("focused")) {
            return;
        }

        isDragging = true;
        photo.style.cursor = "grabbing";
        
        if(photo.style.zIndex != maxZIndex) {
            photo.style.zIndex = maxZIndex;

            let photos = document.getElementsByClassName("photoCard");
                for(let i = 0; i < photos.length; i++) {
                    if(photos[i] !== photo && photos[i].style.zIndex > 0) {
                        photos[i].style.zIndex--;
                    }
                }
        }

        const rect = photo.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const left = e.clientX - offsetX + 21;
            const top = e.clientY - offsetY + 18;
            photo.style.left = left + "px";
            photo.style.top = top + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        photo.style.cursor = "grab";
    });
}

function focusPhoto(photo) {
    if(photo.classList.contains("focused")) {
        photo.classList.remove("focused");
        photo.classList.add("unfocused");
        photo.style.zIndex = maxZIndex;

        photo.offsetHeight;
    }
    else {
        photo.classList.remove("unfocused");
        photo.classList.add("focused");
        photo.style.zIndex = 9998;
    }
    toggleWallNot();
}

function toggleWallNot() {
    const wallnot = document.getElementById("wallnot");
    const photoInfo = document.getElementById("photoInfo");

    if(wallnot.style.display === "none") {
        wallnot.style.display = "block";
        photoInfo.classList.remove("fadeout");
        photoInfo.classList.add("fadein");
    }
    else {
        wallnot.style.display = "none";
        photoInfo.classList.remove("fadein");
        photoInfo.classList.add("fadeout");
    }
}

function displayPhotoInfo(photo) {
    const photoSource = photo.firstElementChild.src;
    const photoName = photoSource.slice(photoSource.lastIndexOf('/') + 1);

    photoJSON.then(data => {
        if(data.hasOwnProperty(photoName)) {
            photoInfo.innerHTML =
                `<b class="photoInfoLabel">Name</b> <p class="photoInfoText">${data[photoName][0]}</p>
                <b class="photoInfoLabel">Date Taken</b> <p class="photoInfoText">${data[photoName][1]}</p>
                <b class="photoInfoLabel">Comments</b> <p class="photoInfoText">${data[photoName][2]}</p>`;
        } 
        else {
            console.error(`Unable to find ${photoName} in photo JSON`);
        }
    })
    .catch(error => {
        console.error("Error loading photo JSON file:", error);
    });
}

function dismissWelcome() {
    const wallnot = document.getElementById("wallnot");
    const photoInfo = document.getElementById("photoInfo");

    wallnot.style.display = "none";
    photoInfo.classList.add("fadeout");
    setTimeout(function() { photoInfo.innerHTML = ''; }, 500);
}

createPhotos();