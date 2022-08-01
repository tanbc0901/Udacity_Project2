import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage/", async (req, res) => {
    if (!req.query.image_url) {
      res.status(400);
      res.send(`image_url is required.`);
    }

    const filteredPath = await filterImageFromURL(req.query.image_url);
    if (!filteredPath) {
      res.status(404);
      res.send(`Image's path not found.`);
    }
    else {
      res.status(200);
      res.sendFile(filteredPath, async () => {
        await deleteLocalFiles([filteredPath]);
      });
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();