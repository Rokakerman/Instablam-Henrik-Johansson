async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register("../sw.js");
            console.log('Registered service worker at: ', new Date().toLocaleTimeString())N
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
    const vapidKeys = webpush.generateVAPIDKeys();
    console.log(vapidKeys)
    check()
    const swRegistration = await registerServiceWorker();
    const permission = await requestNotificationPermission();
    showLocalNotification('This is title', 'This is the message,', swRegistration)
}

let stream

async function getMedia(constrains) {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElem = document.querySelector('#frame');
        videoElem.srcObject = stream;
        videoElem.addEventListener('loadedmetadata', function callback() {
            videoElem.play();
        })
        console.log(stream)
    } catch(error) {
        console.log('Error: ', error)
    }
}

main()