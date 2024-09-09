import path from 'path';
import process from "node:process";
import cors from 'cors';
import Enqueue from 'express-enqueue';
import compression from 'compression';
import * as dotenv from 'dotenv';
import express from 'express';
import http from 'http'

/* eslint-disable no-console */
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { identify } from '@libp2p/identify'
import { webSockets } from '@libp2p/websockets'
import { createLibp2p } from 'libp2p'
import * as  peerIdLib  from '@libp2p/peer-id'
import * as createEd25519PeerId from '@libp2p/peer-id-factory'
import { webTransport } from '@libp2p/webtransport'
import fs from "node:fs";
import { kadDHT } from '@libp2p/kad-dht'

let __dirname = process.cwd();
const buffer = fs.readFileSync(__dirname + '/peerId.proto')
const peerId =  await createEd25519PeerId.createFromProtobuf(buffer)
// console.log(peerId222)
// const peerId_1 = await createEd25519PeerId.createEd25519PeerId()
// const peerId =  await createEd25519PeerId.createFromProtobuf(createEd25519PeerId.exportToProtobuf(peerId_1))
// fs.writeFileSync(__dirname + '/peerId.proto', createEd25519PeerId.exportToProtobuf(peerId_1))
// console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', createEd25519PeerId.exportToProtobuf(peerId_1))
// console.log('-------------------------------',peerId)
// console.log('=========== peerId ===============', peerId_1.toJSON())
dotenv.config();


const port = process.env.PORT
    ? process.env.PORT
    : 4839;

let whitelist = []

let app = express();
const server = http.createServer(app);

async function main () {

    app.use(compression());
    app.use(express.json());

    const queue = new Enqueue({
        concurrentWorkers: 4,
        maxSize: 200,
        timeout: 30000
    });

    app.use(await cors({credentials: true}));
    app.use(queue.getMiddleware());

    let corsOptions = {
        origin: function (origin, callback) {
            console.log('origin', origin);
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    };

    app.use('/pubsub', express.static(path.join(__dirname, '/docs')));
    // app.use('/assets', express.static(path.join(__dirname, '/dist/assets')));
    app.use('/assets', express.static(path.join(__dirname, '/public')));

    app.get(`/env.json`, async (req, res) => {
        res.status(200).sendFile(path.join(__dirname, 'env.json'))
    })

    app.get(`/env.mjs`, async (req, res) => {
        res.status(200).sendFile(path.join(__dirname, 'env.mjs'))
    })

    app.get(`/*`, async (req, res) => {
        const html = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>org browser relay</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
    <meta
            name="description"
            content="">
    <meta property="og:site_name" content="markdown" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:type" content="contract" />
    <meta property="og:title" content="markdown" />
    <meta property="og:description" content="markdown" />
    <meta property="og:image" content="https://i.imgur.com/pSrPUkJ.jpg" />
    <meta property="og:image:width" content="537" />
    <meta property="og:image:height" content="240" />
    <link rel="shortcut icon"
          href="data:image/png;base64, AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbbv+DGW3/mRlt/5kZbf+ZGq6/hIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGa3/ohkt/7/Zbj//2S3/v9lt/6WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGm5/iRlt/74Zbj//2W4//9luP//Zbf++mi4/i4gIPciGhr24hsb9uwbG/bsGhr24CEh9xoAAAAAAAAAAAAAAABnuP5mZLf+/2W4//9luP//Zbj//2S3/v9muP5yGBj2rhMT9v8TE/b/ExP2/xMT9f8YGPWkAAAAAAAAAAAAAAAAb7z/BGW3/tZluP//Zbj//2W4//9lt/7gJzH3ShMT9f8TE/b/ExP2/xMT9v8TE/b/ExP1/CAg9joAAAAAAAAAAAAAAABmuP5GZLf+6GS3/uhkt/7oZbf+UhgY9YQSEvX/ExP2/xMT9v8TE/b/ExP2/xIS9f8aGvZ8AAAAAD4++gQgIPZ6IiL2hiIi9oYgIPZ8KCj5BAAAAAAtLfgUFBT17BMT9v8TE/b/ExP2/xMT9v8VFfXoLCz4DgAAAAAaGvZqEhL1/xMT9v8TE/b/EhL1/xsb9nIAAAAAAAAAABwc9m4SEvX/ExP2/xMT9v8SEvX/HR32ZAAAAAAnJ/gSFRX16hMT9v8TE/b/ExP2/xMT9v8UFPXuJyf4Fp2xlAKNnqUYLC/mfhYW83ATE/VuFxf1aDc3+gIAAAAAGBj1fhIS9f8TE/b/ExP2/xMT9v8TE/b/ExP1/xkZ9YaGn3yIhZ57/4Wee/+Gn3yKAAAAAAAAAAAAAAAAAAAAACMj9zYTE/X8ExP2/xMT9v8TE/b/ExP2/xMT9f9JUshihZ57+IaffP+Gn3z/hZ579oigfiYAAAAAAAAAAAAAAAAAAAAAGBj1oBIS9f8TE/b/ExP2/xMT9f8YGPWmiKB+PIWee/+Gn3z/hp98/4Wee/+HoH06AAAAAAAAAAAAAAAAAAAAACUl9xgVFfXOExP11BMT9dQUFPXQJib3HgAAAACGn3ymhp98/4affP+Gn3ymAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiKB+EIihf0CIoX9AiKB+EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AADg/wAA4MMAAOCBAADggQAA8QEAAOeBAADDwwAAgf8AAIAPAACBDwAAgQ8AAMMPAAD//wAA//8AAA=="
          type="image/png">
    <style>
      .body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      .body img {
        align-self: center;
      }

      #addr {
        display: flex;
        flex-direction: row;
        gap: 24px;
        justify-content: center;
        align-items: center;
      }

      p {
        background: #AFAFAF;
        padding: 4px;
        border-radius: 2px;
        width: max-content;
      }
    </style>
  </head>
  <body>
  <div class="body">
    <br>
    <img src="./assets/logo.png" alt="org Logo" width="128">
    <h2>This is a relay</h2>
    <div id="addr">You can add this bootstrap list with the address <p
    onclick="(function(self) {      
        if ('clipboard' in navigator) {
            navigator.clipboard.writeText(self.textContent)
            .then(() => {
              console.log('Text copied');
            })
            .catch((err) => console.error(err.name, err.message));
        } else {
         
        }
    })(this)"
    >${pathNode}</p></div>
  </div>
  </body>
</html>
`;
        res.status(200).send(html);
        // res.status(200).sendFile(path.join(__dirname, '/index.html'));
    });

    app.post(`/*`, async (req, res) => {
        console.log('==== POST ====', req.path);
    });

    app.use(queue.getErrorMiddleware());

    // app.listen(port, () => {
    //   console.log('pid: ', process.pid);
    //   console.log('listening on http://localhost:' + port);
    // });

    // const webSocketServer = webSockets()
    // console.log(webSocketServer)

    let adresses = process.env.PORT
        ? {
            listen: [
                `/ip4/0.0.0.0/tcp/${port}/ws`,
                `/ip6/::/tcp/${port}/ws`,
                `/ip4/0.0.0.0/tcp/${port}/wss`,
                `/ip6/::/tcp/${port}/wss`
            ],
            announce: [
                `/dns4/${process.env.RENDER_EXTERNAL_HOSTNAME}/tcp/${port}/wss/p2p/${peerId.toString()}`
            ]
        }
        : {
            listen: [
                `/ip4/0.0.0.0/tcp/${port}/ws`
            ],
            announce: [`/dns4/localhost/tcp/${port}/ws/p2p/${peerId.toString()}`]
        }

    const node = await createLibp2p({
        peerId,
        addresses: adresses,
        transports: [
            webTransport(),
            webSockets({ server })
        ],
        connectionEncryption: [
            noise()
        ],
        streamMuxers: [
            yamux()
        ],
        services: {
            identify: identify(),
            relay: circuitRelayServer(),
            dht: kadDHT({
                kBucketSize: 20,
                kBucketSplitThreshold: `kBucketSize`,
                prefixLength: 32,
                clientMode: false,
                querySelfInterval: 5000,
                initialQuerySelfInterval: 1000,
                allowQueryWithZeroPeers: false,
                protocol: "/ipfs/kad/1.0.0",
                logPrefix: "libp2p:kad-dht",
                pingTimeout: 10000,
                pingConcurrency: 10,
                maxInboundStreams: 32,
                maxOutboundStreams: 64,
                peerInfoMapper: (peer) => {
                    console.log('!!!!!!!!!!! peerInfoMapper !!!!!!!!!!', peer)
                }
            })
        }
    })

    console.log(`Node started with id ${node.peerId.toString()}`)
    let pathNode = ''

    node.getMultiaddrs().forEach((ma, index) => {
        pathNode = ma.toString()
        console.log(`${index}::Listening on:`, pathNode)
    })

    console.log('pid: ', process.pid);
    console.log('listening on http://localhost:' + port);
    // httpProxy.createServer({
    //   target: proxtBalancer,
    //   ws: true
    // }).listen(port);

    // app.listen(port, () => {
    //   console.log('pid: ', process.pid);
    //   console.log('listening on http://localhost:' + port);
    // });

    // server.listen(port, () => {
    //   console.log('pid: ', process.pid);
    //   console.log('listening on http://localhost:' + port);
    // })
}

main()
