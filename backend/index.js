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
    publicKey: 'BGBkYa2lS4baTr2Hcz7RaUeB-h-V-qaZRAPM1Pn04nyATnUcHYJlGJcZ0wUlW6R1X6WR3sasXGlOT88iX1lE1kU',
    privateKey: 'ZwpIbNTOPIqlqg0HkhzjZ3_iO-HTRy6qU7gaAXgr3_4'

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