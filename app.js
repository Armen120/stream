import process from 'process';
import fs from 'fs';
import path from 'path';
import { Transform } from 'stream';


process.stdin.setEncoding('utf-8');

const comandsArr = process.argv.slice(-3);
const[inPath, outPath, operation] = comandsArr;

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

    
    const transformStream = new Transform({
        transform(chunk,encoding,call) {
          let transformedChunk;
          switch (operation) {
            case 'uppercase':
              transformedChunk = chunk.toString().toUpperCase();
              break;
            case 'lowercase':
              transformedChunk = chunk.toString().toLowerCase();
              break;
            case 'reverse':
              transformedChunk = chunk.toString().split('').reverse().join('');
              break;
            default:
              throw new Error('Invalid operation');
          }
        call(null,transformedChunk)
        }
      });
      readStream.pipe(transformStream).pipe(writeStream);


    process.on('SIGINT', () => {
        writeStream.destroy();
        readStream.destroy();
    })

}

streamFunc(inPath, outPath, operation);




