// Store all screen divs to trigger screen changes
let screens;

document.addEventListener("DOMContentLoaded", () => {
    screens = document.querySelectorAll('body > .screen');
    
    const sectionContainer = document.querySelector('.section-container');
    const sectionContainerChildren = sectionContainer.children;

    for(let i = 0; i < sectionContainerChildren.length; i++){
        let child = sectionContainerChildren[i];
        child.addEventListener("click", () => {
            if(child.id !== "focused"){
                document.getElementById('focused').removeAttribute('id');
                child.id = "focused";
                triggerScreen(i);
            }
        });
    }

    document.getElementById('tabletop-button').addEventListener("click", () => {
        window.location.href = "tabletop-gallery/";
    });
});

function triggerScreen(screensIndex){
    if(screens[screensIndex] === undefined){
        console.log("Invalid screen index");
        return;
    }
    
    let activeScreen = document.getElementById('active');
    activeScreen.style.display = "none";
    activeScreen.removeAttribute('id');

    screens[screensIndex].id = 'active';
    screens[screensIndex].removeAttribute('style');
}
