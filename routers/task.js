import express from 'express';
import bodyParser from 'body-parser'; 
import Task from '../model/task.js';
import mongoose from 'mongoose';
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = dirname(__filename);

const router = express();

// router.use(express.static('public'));

router.use(express.json());

router.get('/', async (req, res) => {
    try {
        // Fetch all tasks from the database
        const tasks = await Task.find({});

        // Send the tasks as a response to the client
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', async (req,res)=>{
    try{
        // Access the task name from the request body
        const taskName = req.body.name;
        const completed = false;
        const task = new Task({ name: taskName, completed }); // Assign the task name to the name field
        await task.save();
        res.redirect('/')
    }
    catch(error){
        console.error(error);
        res.status(400).redirect('/')
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to mark a task as completed
router.put('/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, { completed: true }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task marked as completed', task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/edit.html'));
});

// Serve static files for the edit.html page
router.use('/edit', express.static(path.join(__dirname, '../public')));


router.put('/:id', async (req, res) => {
    const taskId = req.params.id;
    const { name } = req.body;
    console.log(taskId);
    console.log('hhhhhh');
    console.log(name);
    // console.log(taskId);
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, { name }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json('task edited!')
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router