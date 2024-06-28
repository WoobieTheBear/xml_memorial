import express from 'express';
import fileUpload from 'express-fileupload';
import validator from 'xsd-schema-validator';

const PORT = 1337;
const definitionFilePath = './public/asset_definition.xsd';

const app = express();
app.use(express.static('public'));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    files: 1,
}));

app.post('/upload', async (req, res) => {
    console.debug('/upload');
    // the uploaded file object
    const {files: { xmlmemory }} = req;
    const incoming = xmlmemory.name.split('.');
    const fileExtension = incoming[incoming.length - 1];
    if (fileExtension === 'xml') {
        const filepath = `./public/memory-upload.${fileExtension}`;
        await xmlmemory.mv(filepath, (err) => {
            // the file could not be saved for some reason
            if (err) return res.status(500).send(err);
        });
        let response = false;
        try {
            response = await validator.validateXML(xmlmemory.data.toString(), definitionFilePath, 
            (error, result) => {
                if (error) {
                    console.error(error);
                };
                return result;
            });
        } catch (error) {
            const {valid, result, messages} = error;
            const uniqueMessages = messages.filter((message, index, list) => list.indexOf(message) === index);
            response = { valid: valid, result: result, messages: uniqueMessages };
            console.error(`Validation result: ${error.result}`);
        }
        console.log(response);
        res.send(response);
    } else {
        res.redirect(`/?valid=${false}&result=no xml file&messages=please go play with something shiny for a while`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

