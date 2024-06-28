import express from 'express';
import fileUpload from 'express-fileupload';
import validator from 'xsd-schema-validator';

const PORT = 1337;
const memoryFilePath = './public/memory-upload.xml';
const definitionFilePath = './public/asset_definition.xsd';
const errorSplitString = '~|~';

const app = express();
app.use(express.static('public'));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.post('/upload', async (req, res) => {
    // the uploaded file object
    const {files: { xmlmemory }} = req;
    await xmlmemory.mv(memoryFilePath, (err) => {
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
        response = { valid: valid, result: result, messages: messages };
        console.error(error);
    }
    console.log(response);
    let redirect = '/';
    if (response) {
        redirect += `?valid=${response.valid}&result=${response.result}&messages=${response.messages.join(errorSplitString)}`;
    }

    res.redirect(redirect);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

