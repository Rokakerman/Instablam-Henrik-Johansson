let stream = {}
let oldBright = 0
let oldExposure = 0
let oldInvert = 0
let oldHue = 0
let oldGrayscale = 0


async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register("../sw.js");
            console.log('Registered service worker at: ', new Date().toLocaleTimeString());
        }
        catch(error) {
            console.log('Error while registering serivce worker: ', error);
        }
    }
}

async function check() {
    if (!navigator.serviceWorker) {
        throw new Error('No service worker support');
    }
    if (!window.PushManager) {
        throw new Error('Nu push API support');
    }
}

async function requestNotificationPermission() {
    // value of permission can be 'granted', 'default' and 'denied'
    const permission = await window.Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification');
    }
}

async function showLocalNotification(title, body, swRegistration) {
    const icon = '../images/android-icon-192.png';
    const notification = new Notification('This is title; ', { body: 'This is body', icon: icon});
}

async function main() {
    document.getElementById('capture-button').addEventListener('click', event => {
        capture(stream)
    });
    document.querySelector('#frame').classList.add("hide");
    document.querySelector('#sliders').classList.add("hide");
    check()
    const swRegistration = await registerServiceWorker();
    const permission = await requestNotificationPermission();
    showLocalNotification('This is title', 'This is the message,', swRegistration)
    getMedia()
}

async function getMedia() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElem = document.querySelector('#webcam');
        videoElem.srcObject = stream;
        videoElem.addEventListener('loadedmetadata', function callback() {
            videoElem.play();
        })
        console.log('This is the stream object: ', stream)
    } catch(error) {
        console.log('Error: ', error)
    }
}

async function capture(stream) {
    const caught = new ImageCapture(stream.getVideoTracks()[0]);
    const photo = await caught.grabFrame();

    let canvas = document.getElementById("canvas");
    canvas.classList.remove('hide');
    canvas.width = photo.width;
    canvas.height = photo.height;
    canvas.getContext("2d").drawImage(photo, 0,0);
    canvas.classList.add('frame')
    canvas.classList.remove("hide")
    let url = canvas.toDataURL();
   
    document.getElementById('webcam').classList.add('hide');
    document.getElementById('capture-button').classList.add('hide');
    document.getElementById('sliders').classList.remove('hide');
    document.getElementById('done').classList.add('done')
    document.getElementById('done').classList.remove('hide')
    document.getElementById('done').addEventListener('click', saveImage)

    return assignListeners(canvas, url)
}

function saveImage() {
    document.getElementById("canvas").classList.add('hide');
    document.getElementById('webcam').classList.remove('hide');
    document.getElementById('capture-button').classList.remove('hide');
    document.getElementById('sliders').classList.add('hide');

    document.getElementById('done').classList.remove('done')
    document.getElementById('done').classList.add('hide')

    canvas = document.getElementById("canvas");
    document.querySelector('#download').href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    document.querySelector('#download').download = 'image.png';
}

function assignListeners(canvas, url) {
    let slider1 = document.getElementById('bright')
    slider1.onchange = function () {
        let value = this.value;
        console.log(value)
        bright(canvas, url, value)
    }

    let slider2 = document.getElementById('exposure')
    slider2.onchange = function () {
        let value = this.value;
        exposure(canvas, url, value)
    }

    let slider3 = document.getElementById('invert')
    slider3.onchange = function () {
        let value = this.value;
        invert(canvas, url, value)
    }

    let slider4 = document.getElementById('hue')
    slider4.onchange = function () {
        let value = this.value;
        hue(canvas, url, value)
    }

    let slider5 = document.getElementById('grayscale')
    slider5.onchange = function () {
        let value = this.value;
        grayscale(canvas, url, value)
    }
}

async function bright(canvas, url, value) {
    await Caman(canvas, url, function () {
        console.log('This is the old value: ', oldBright)
        console.log('New value: ', value)
        let x = value - oldBright
        oldBright = value
        console.log('After subtraction: ', x)
        this.brightness(x)
        this.render()
    })
    return await removeCanvasRules()
}

async function exposure(canvas, url, value) {
    await Caman(canvas, url, function () {
        console.log('This is the old value: ', oldExposure)
        console.log('This is the new value: ', value)
        //console.log('This is the slider value: ', value)
        let x = value - oldExposure
        console.log('After subtraction: ', x)
        this.exposure(x);
        this.render()
        oldExposure = value
    })
    return await removeCanvasRules()
}

async function invert(canvas, url, value) {
    await Caman(canvas, url, function () {
        console.log('This is the old value: ', oldInvert)
        console.log('New value: ', value)
        let x = value - oldInvert
        oldInvert = value
        console.log('After subtraction: ', x)
        this.invert().render()
    })
    return await removeCanvasRules()
}

async function hue(canvas, url, value) {
    await Caman(canvas, url, function () {
        console.log('This is the old value: ', oldHue)
        console.log('This is the new value: ', value)
        //console.log('This is the slider value: ', value)
            let x = value - oldHue
            oldHue = value
            console.log('After subtraction: ', x)
            this.hue(x).render()
    })
    return await removeCanvasRules()
}

async function grayscale(canvas, url, value) {
    await Caman(canvas, url, function () {
        console.log('This is the old value: ', oldGrayscale)
        console.log('This is the new value: ', value)
        let x = value - oldGrayscale
        console.log('After subtraction: ',x)
        if (value == 0) {
            this.revert()
            this.render()
        } else {
            this.greyscale().render()
        }
        oldGrayscale = value
    })
    return await removeCanvasRules()
}

async function removeCanvasRules() {
    let picture = document.getElementById('canvas');
    picture.style.width = null;
    picture.style.height = null;
    return
}

main()