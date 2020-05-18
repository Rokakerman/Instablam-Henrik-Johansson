const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll(['index.html', 'js/index.js', 'offline.html']);
        })
    )
    self.skipWaiting();
    console.log('SW installed at', new Date().toLocaleTimeString());
});

const publicKey = 'BFgDP3fQSu2V30Ty068kLMfNwOvCvv8Fhje6lY8l2EVpts3_spFO7_jJ-cj5DL0Hgmmj8f-h6UF4FeC_BJKuH_M';

self.addEventListener('activate',  async event => {
    self.skipWaiting();
    console.log('SW activated at: ', new Date().toLocaleTimeString());
    try {
        const applicationServerKey = urlB64ToUint8Array(publicKey)
        const options = { applicationServerKey, userVisibleOnly: true }
        const subscription = await self.registration.pushManager.subscribe(options)
        console.log(JSON.stringify(subscription))
        const response = await saveSubscription(subscription)
        console.log(response)
    } catch (err) {
        console.log('Error', err)
    }
    /* this is a comment */
});

//saveSubcription

const saveSubscription = async subscription => {
    console.log(subscription.endpoint)
    // https://push-notifications-api.herokuapp.com/api/notifications/save
    const SERVER_URL = 'http://localhost:4000/save-subscription';
    const response = await fetch(SERVER_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
    })
    console.log('Here: ')
    return response.json()
}

self.addEventListener('push', function(event) {
    if(event.data) {
        console.log('Push event!! ', event.data.text())
    } else {
        console.log('Push event but no data')
    }
})

self.addEventListener('fetch', event => {
    //console.log(event.request.url);
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request)
            .then((response) => {
                //console.log(event.request)
                //console.log('RESPONSE: ', response);
                if (response) {
                    //console.log('In the if');
                    return response;
                } else {
                    //console.log('in the else')
                    return caches.match(new Request('offline.html'));
                }
            })
        )
    } else {
        console.log("Online!")
        return updateCache(event.request);
    }
});

/*self.addEventListener('fetch', event => {
    //console.log(event.request.url);
    if (!navigator.onLine) {
        event.respondWith(
            caches.match('/asewome/')
            .then((response) => {
                //console.log(event.request)
                //console.log('RESPONSE: ', response);
                if (response) {
                    console.log(reponse);
                    return response;
                } else {
                    //console.log('in the else')
                    return caches.match(new Request('offline.html'));
                }
            })
        )
    } else {
        console.log("Online!")
        return updateCache(event.request);
    }
});*/


async function updateCache(request) {
    console.log('In the updateCache: ', request)
    const response = await fetch(request);
    const cache = await caches.open('v1');
    const data = await cache.put(request, response.clone());
    return response
}