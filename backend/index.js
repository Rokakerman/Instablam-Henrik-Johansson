const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push') //requiring the web-push module

const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = 4000

app.get('/', (req, res) => res.send('Hello World'))

const dummyDb = { subscription: null } 
// Since this is a demo app, I am going to save this in a dummy in 
const saveToDatabase = async subscription => {
    dummyDb.subscription = subscription
}

const vapidKeys = {
    publicKey: 'BFgDP3fQSu2V30Ty068kLMfNwOvCvv8Fhje6lY8l2EVpts3_spFO7_jJ-cj5DL0Hgmmj8f-h6UF4FeC_BJKuH_M',
    privateKey: 'urrNu5GJdU38GLHaTrt7tVQj_NexgbcR92lcJpDHTSQ'

}

webpush.setVapidDetails(
    'mailto:myuserid@email.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

const sendNotification = (subscription, dataToSend='Hello World') => {
    console.log(subscription)
    webpush.sendNotification(subscription, dataToSend)
}

app.get('/send-notification', (req, res) => {
    const subscription = dummyDb.subscription //get subscription from your databse here.
    const message = 'Hello World'
    sendNotification(subscription, message)
    res.json({ message: 'message sent' })
})

app.post('/save-subscription', async (req, res) => {
    const subscription = req.body
    await saveToDatabase(subscription)
    console.log(subscription)
    res.json({ message: 'succes' })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))