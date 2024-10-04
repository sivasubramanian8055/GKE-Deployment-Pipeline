const express = require("express");
let fs = require('fs');
// New app using express module
const app = express();
app.use(express.json());
let validateCSVFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile('./storage/' + filePath, 'utf8', (err, data) => {
            if (data.trim() === '') {
                // The CSV file is empty
                resolve(false);
                return;
            }

            const rows = data.split('\n').map(row => row.trim()).filter(row => row !== '');
            if (rows.length === 0 || rows.length === 1) {
                // The CSV file has no data rows
                resolve(false);
                return;
            }

            const headers = rows[0].split(',');
            console.log(headers.includes('amount'), headers)
            if (headers.length !== 2) {
                // The CSV file has no headers
                resolve(false);
                return;
            }

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].split(',');
                if (row.length !== headers.length) {
                    // Row has an incorrect number of columns
                    resolve(false);
                    return;
                }
                for (let j = 0; j < row.length; j++) {
                    if (row[j] === undefined || row[j].trim() === '') {
                        // Row is missing a value for a column
                        resolve(false);
                        return;
                    }
                }
            }
            resolve(true);
        });
    });
};


app.post("/retriveAndCompute",
    (req, res) => {
        let {
            file,
            product
        } = req.body;
        console.log("in");
        validateCSVFile(file)
            .then(isValid => {
                if (isValid) {
                    fs.readFile('./storage/' + file, 'utf8', (err, data) => {
                        let rowCount = 0;
                        const rows = data.split('\n').map(row => row.trim()).filter(row => row !== '' && row.includes(product));
                        for (i = 0; i < rows.length; i++) {
                            rowCount = rowCount + parseInt(rows[i].split(',')[1]);
                        }
                        res.send({
                            "file": file,
                            "sum": rowCount
                        });
                    });
                } else {
                    res.send({
                        "file": file,
                        "error": "Input file not in CSV format."
                    });
                }
            })
    })

app.listen(7000, function () {
    console.log(
        "server is running on port 7000"
    );
})