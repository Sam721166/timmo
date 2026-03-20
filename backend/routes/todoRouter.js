import express from "express"
const todoRouter = express.Router()
import todoModel from "../model/todo.js"
import userModel from "../model/user.js"
import mongoose from "mongoose"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
 

// Get all todos for logged-in user
todoRouter.get("/all", isLoggedIn, async (req, res) => {
    try{
        const user = await userModel.findOne({email: req.user.email})
        if(!user){
            return res.status(404).json({
                success: false,
                msg: "User not found"
            })
        }
        const todos = await todoModel.find({userId: user._id})
        return res.status(200).json({
            success: true,
            todos: todos
        })
    }catch(err){
        console.log(`error: ${err}`);
        return res.status(500).json({
            success: false,
            msg: "Error fetching todos"
        })
    }
})


// Create todo for logged-in user
todoRouter.post("/add", isLoggedIn, async (req, res) => {
    try{
        const user = await userModel.findOne({email: req.user.email})
        if(!user){
            return res.status(404).json({
                success: false,
                msg: "User not found"
            })
        }

        const {text} = req.body
        
        if(!text){
            return res.status(400).json({
                success: false,
                msg: "Todo text is required"
            })
        }

        const todo = await todoModel.create({
            text: text,
            completed: false,
            userId: user._id
        })
        
        user.todoId.push(todo._id)
        await user.save()

        return res.status(201).json({
            success: true,
            msg: "Todo created successfully",
            todo: todo
        })
    } catch(err){
        console.log("error creating todo:", err);
        return res.status(500).json({
            success: false,
            msg: "Error creating todo"
        })
    }
})

// Update todo (mark as complete/incomplete)
todoRouter.put("/update/:id", isLoggedIn, async (req, res) => {
    try{
        const id = req.params.id
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                msg: "Invalid todo id"
            })
        }
        
        const todo = await todoModel.findByIdAndUpdate(id, req.body, {new: true})

        if(!todo){
            return res.status(404).json({
                success: false,
                msg: "Todo not found"
            })
        }
        
        return res.status(200).json({
            success: true,
            msg: "Todo updated successfully",
            todo: todo
        }) 
    } catch(err){
        console.log("error updating todo:", err);
        return res.status(500).json({
            success: false,
            msg: "Error updating todo"
        })
    }
})


// Delete todo
todoRouter.delete("/delete/:id", isLoggedIn, async (req, res) => {
    try{
        const id = req.params.id
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                msg: "Invalid todo id"
            })
        }

        const user = await userModel.findOne({email: req.user.email})
        
        const todo = await todoModel.findByIdAndDelete(id)
        
        if(user){
            user.todoId = user.todoId.filter(todoId => todoId.toString() !== id)
            await user.save()
        }
        
        return res.status(200).json({
            success: true,
            msg: "Todo deleted successfully"
        }) 
    } catch(err){
        console.log("error deleting todo:", err);
        return res.status(500).json({
            success: false,
            msg: "Error deleting todo"
        })
    }
})



export default todoRouter