const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const axios = require('axios')

const port = process.env.PORT || 5000

///////////////// ALLOW CORS /////////////////

let allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
}
app.use(allowCrossDomain)

//////////////////////////////////////////////

app.get('/', (req, res) => {
  const data = {
    app: 'CP Backend',
    status: 'running',
    port: 5000,
  }
  res.send(data)
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.post('/api/cpAuthen', (req, res) => {
  const {
    client_id,
    client_secret,
    cp_id,
    service_id,
    css_keyword,
    cp_trans_id,
  } = req.body

  try {
    axios
      .post(
        'https://aoc-dev.truecorp.co.th/authen-stg',
        `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`
      )
      .then((authenResponse) => {
        // Came back from authenticator, add neccessary values in order to return back to CP-FRONT
        authenResponse = {
          ...authenResponse.data,
          cp_trans_id,
          service_id,
          cp_id,
          css_keyword,
        }
        res.status(200).json({
          ...authenResponse,
        })
      })
      .catch((err) => {
        res.status(400).json({ msg: `Can't post request : ` + err.msg })
      })
  } catch (err) {
    console.log(err)
  }
})

app.listen(port, () => console.log(`Listening on port ${port}`))
