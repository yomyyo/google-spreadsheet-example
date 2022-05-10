const express = require('express')
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./nothing-349815-a36caef7ba37.json");
const doc = new GoogleSpreadsheet(
  "1mLFUfynHwDWI7Dt4w8pk9fkHoA-k9h5H6aqMuUjEyaw"
);
const app = express()

const bodyParser = require("body-parser");
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/get', async(req, res) => {

    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows();
    rowData = [];
    for(let i = 0; i < rows.length; i++){
        rowData.push({name: rows[i].name, email: rows[i].email})
    }
    res.json(rowData);
})

app.post('/write', async(req, res) => {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    let name = req.body.name;
    let email = req.body.email;

    await sheet.addRow({name: name, email: email});
    res.send("Success");
})

app.post('/delete', async(req, res) => {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    let email = req.body.email;

    const rows = await sheet.getRows();
    let deleted = false;
    for(let i = 0; i < rows.length; i++){
        if(rows[i].email == email){
            rows[i].delete();
            deleted = true;
            break;
        }
    }
    if(deleted){
        res.send("Entry has been deleted")
    } else {
        res.send('No Entry Found');
    }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})