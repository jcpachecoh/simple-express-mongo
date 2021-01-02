const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const connectionString = 'mongodb+srv://juan_test:Mariana2012@cluster0.2n73p.mongodb.net/<dbname>?retryWrites=true&w=majority'

app.listen(3000, () => {
  console.log('listening on 3000')
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

MongoClient.connect(connectionString, {
  useUnifiedTopology: true
}).then(client => {
  console.log('Connected to Database');
  const db = client.db('quotes');

  const quotesCollection = db.collection('quotes')

  app.post('/quotes', (req, res) => {
    console.log('Hellooooooooooooooooo!', req.body)
    quotesCollection.insertOne(req.body)
    .then(result => {
      res.send(result)
    })
    .catch(error => console.error(error))
  })

  app.get('/listQuotes', (req, res) => {
    db.collection('quotes').find().toArray()
    .then(results => {
      console.log(results)
      res.send(results);
    })
    .catch(error => console.error(error))
  })

  app.put('/quotes', (req, res) => {
    console.log(req.body);
    quotesCollection.findOneAndUpdate({ _id: req.body._id },
    {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    },
    {
      upsert: true
    })
    .then(result => {
      console.log(result)
      res.json('Success')
     })
    .catch(error => console.error(error))
  })

  app.delete('/quotes', (req, res) => {
    quotesCollection.deleteOne(
      { name: req.body.name }
    ).then(result => {
      if (result.deletedCount === 0) {
        return res.json('No quote to delete')
      }
      res.json(`Deleted ${req.body.name}`)
    })
    .catch(error => console.error(error))
  })

})
  .catch(error => console.error(error));


app.get('/',  (req, res) => {
  // do something here
  // res.send('Hello World')
  res.sendFile(__dirname + '/index.html')
})
