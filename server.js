const express = require('express')
var bodyParser = require('body-parser')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
const port = 3000

const_dirname = path.resolve()
const datapath = path.join(__dirname, 'db', 'data.db')
const db = new sqlite3.Database(datapath)

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('form', { data: {} })
})

app.post('/add', (req, res) => {
  db.run('INSERT INTO data(name,height,weight,birtdate,married(?,?,?,?,?)', [req.body.name, req.body.height, req.body.weight, req.body.birthdate, req.body.married], (err) => {
    if (err) return res.send(err)
    res.redirect('/')
  })
})

app.get('/edit/:id', (req, res) => {
  const id = req.params.id

  db.get('SELECT * FROM data WHERE id = ?', [id], (err, data) => {
    if (err) return res.send(err)
    else
      res.render('update', { data })
  })
})

app.post('/edit/:id', (req, res) => {
  const id = req.params.id

  db.run('UPDATE data SET name=?, height=?, weight=?, birtdate=?, married=? WHERE id=?', [req.body.name, req.body.height, req.body.weight, req.body.birthdate, req.body.married], (err) => {
    if (err) return res.send(err)
    res.redirect('/')
  })
})

app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM dataWHERE id=?', [id], (err) => {
    if (err) return res.send(err)
    res.redirect('/')
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})