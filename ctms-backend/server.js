const express = require("express");
const app = express();

app.use(express.json());


app.get('/' , (req,res) => {
  res.json({
    message: "Welcome to CTMS Api",
    status:"Server is runing",
    developer:"Ashish"
  })
})


const Port = 5000;
app.listen(Port, () => {
  console.log(`CTMS server is running on port {Port}`);
  console.log(`Open: http://localhost:${Port}`)
})