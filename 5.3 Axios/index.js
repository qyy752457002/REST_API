import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

/*
This middleware is used to serve static files from the "public" directory. 
It allows you to serve things like HTML files, images, stylesheets, JavaScript files, and other assets directly to clients without the need for custom routes to handle them. 
Here, "public" is the name of the directory from which static files will be served. 
For example, if you have an "index.html" file in the "public" directory, it can be accessed at "/index.html" relative to your application's URL.
*/
app.use(express.static("public"));

/*
This middleware is used for parsing incoming request bodies with URL-encoded data. 
It's commonly used when processing form data submitted by HTML forms. The { extended: true } option allows the parsing of complex objects and arrays in the request body. 
It makes the parsed data more flexible and suitable for various use cases.
*/
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get("/", async (req, res) => {
  try {
    // get response
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    // reterive data
    const result = response.data;
    console.log(result); 
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  console.log(req.body);

  try {
    console.log(req.body); 
    const type = req.body.type;
    const participants = req.body.participants; 
    const response = await axios.get(
      `https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`
    );
    const result = response.data; 
    console.log(result); 
    res.render("solution.ejs", {
      data: result[Math.floor(Math.random() * result.length)],
    });
  } catch (error) {
    console.error("Failed to make request", error.message);
    
  }

  // Step 2: Play around with the drop downs and see what gets logged.
  // Use axios to make an API request to the /filter endpoint. Making
  // sure you're passing both the type and participants queries.
  // Render the index.ejs file with a single *random* activity that comes back
  // from the API request.
  // Step 3: If you get a 404 error (resource not found) from the API request.
  // Pass an error to the index.ejs to tell the user:
  // "No activities that match your criteria."
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
