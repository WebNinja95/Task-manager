import connectToDatabase from './db.js'
import express from 'express'
import taskRouter from './routers/task.js';


const app = express();
const port = '3000';

app.use(express.json());

app.use(express.static('public'));

//routes
app.use('/api/tasks',taskRouter)

connectToDatabase();

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/public/home.html');
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})