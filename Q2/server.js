import http from "http";
import fs from 'fs/promises';
import url from 'url';
import path from 'path';
import { trackVisits } from './numOfVisits.js';

const PORT = process.env.PORT || 8000;

//Get current path
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__filename, __dirname);

const server = http.createServer(async (req, res) => {
    try{
        //check if GET request
        if(req.method === 'GET'){
            let filePath;

            //Routing
            if(req.url === '/' || req.url === '/index.html') {
                filePath = path.join(__dirname, 'public', 'index.html');
            } else {
                throw new Error('Not Found');
            }

            const data = await fs.readFile(filePath);
            res.setHeader('Content-Type', 'text/html');

            //Handle visit tracking
            const visitMessage = trackVisits(req, res);
            res.write(data);
            res.write(`<p>${visitMessage}</p>`);
            res.end();
        } else {
            throw new Error('Method not allowed');
        }
    } catch (error){
        console.error('Server error: ', error.message);
        if(!res.headersSent){
            res.writeHead(500, {'Content-Type' : 'text/plain' });
        }
        res.end('Server error');
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});