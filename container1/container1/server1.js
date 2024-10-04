const express = require("express");
let fs = require('fs');
const axios = require('axios');
// New app using express module
const app = express();
app.use(express.json());

app.post('/store-file', (req, res) => {
    const { file, data } = req.body;
    console.log("in");
    if (!file) {
        return res.status(400).json({
            file: null,
            error: 'Invalid JSON input.'
        });
    }

    if (!fs.existsSync( 'storage')) {
        fs.mkdirSync( 'storage');
    }

    fs.writeFile(`storage/${file}`, data, (err) => {
        if (err) {
            return res.status(500).json({
                file: file,
                error: 'Error while storing the file to the storage.'
            });
        }
        res.status(200).json({
            file: file,
            message: 'Success.'
        });
    });
});

app.post("/calculate",
    async (req, res) => {
        let {
            file
        } = req.body;
        if (file === undefined || file === null || file.length === 0) {
            res.send({
                "file": null,
                "error": "Invalid JSON input."
            });
        } else {
            if (!fs.existsSync('./storage/' + file)) {
                res.send({
                    "file": file,
                    "error": "File not found."
                })
            } else {
                const response = await axios.post('http://service2-service/retriveAndCompute', req.body);
                res.json(response.data);
            }
        }
    });

app.listen(6000, function () {
    console.log(
        "server is running on port 6000"
    );
})