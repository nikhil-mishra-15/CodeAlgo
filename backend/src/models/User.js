import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
   
    name:{
        type:String,
        trim:true,
        required:true
    },

    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:true
    },

    hashedPassword:{
        type:String,
        required:true
    },

    solvedProblems:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Problem"
        }
    ]

},
{timestamps:true}
);

export default mongoose.model("User",userSchema);