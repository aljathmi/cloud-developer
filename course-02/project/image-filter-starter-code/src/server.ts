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

  // Filter Image Endpoint
  // endpoint to filter an image from a public url.
  app.get( "/filteredimage", async ( req, res ) => {
    let { image_url } = req.query;//QUERY PARAMATERS
    
    if ( !image_url ) { // 1. validate the image_url query
      return res.status(400).send(`image_url is required`);
    }
    return filterImageFromURL(image_url).then((filteredImagePath) => {//2. call filterImageFromURL(image_url) to filter the image
      let filesArray: string[] = [filteredImagePath];
      res.status(200).sendFile(filteredImagePath);//3. send the resulting file in the response
      setTimeout(() => deleteLocalFiles(filesArray), 0);//4. deletes any files on the server on finish of the response
    });
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