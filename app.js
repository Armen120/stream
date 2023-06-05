import process from 'process';
import fs from 'fs';
import readline from 'node:readline/promises'
import path from 'path'
import { stdin as input, stdout as output } from 'process';
import { Transform } from 'stream';


input.setEncoding('utf-8')


const ls = readline.createInterface({ input, output });
const inPath = await ls.question('write input file path name\n');
err(inPath);
const outPath = await ls.question('write output file path name\n');
const operation = await ls.question('write operation (reverse, uppercase, lowercase)\n');
ls.close();


function err(path) {
    fs.access(path, (err) => {
        if (err) {
            console.log(path, ": don't found");
            process.exit();
        }
    })
}

function streamFunc(input, output, operation) {

    const readStream = fs.createReadStream(path.join(process.cwd(), input));
    readStream.on('open', () => console.log('open'));
    readStream.on('close', () => console.log('close'));
    readStream.on('error', (error) => {
        console.log(error.message);
        process.exit();
    })
    
    const writeStream = fs.createWriteStream(path.join(process.cwd(), output));
    writeStream.on('open', () => console.log('open'));
    writeStream.on('close', () => console.log('close'));
    writeStream.on('error', (error) => {
        console.log(error.message);
        process.exit();
    })

    const streamRev = new Transform({
        transform(chunk, encoding, call) {
            call(null, chunk.toString().trim().split('').reverse().join(''))
        }
    });

    const streamUperCase = new Transform({
        transform(chunk, encoding, call) {
            call(null, chunk.toString().trim().toUpperCase());
        }
    });
    const streamLowerCase = new Transform({
        transform(chunk, encoding, call) {
            call(null, chunk.toString().trim().toLowerCase());
        }
    });

    if (operation === 'reverse') {
        readStream.pipe(streamRev).pipe(writeStream);

    } else if (operation === 'uppercase') {
        readStream.pipe(streamUperCase).pipe(writeStream);

    } else if (operation === 'lowercase') {
        readStream.pipe(streamLowerCase).pipe(writeStream);

    } else {
        console.log(operation, ': operation is invalid');
        process.exit();
    }

    process.on('SIGINT', () => {
        writeStream.destroy();
        readStream.destroy();
    })

}

streamFunc(inPath, outPath, operation);




