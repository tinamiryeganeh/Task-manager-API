const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        //This line force user to provide name
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        //value is the email that's entered by user 
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"!');
            }
        }
    },
    age: {
        type: Number,
        defualt: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
    //List of options
{
  timestamps: true  
}
);

//Virtual means that it doesn't save in the db
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

//methods collectioni hast ke dar schema gharar darad ke raftar ha ro mitunim behesh attach konim
//instance method
//Token is like tracking number 
//Athentication should be token base and it helps with security

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};


userSchema.methods.generateAuthToken = async function () {
    const user = this;
    console.log("In generate token before jwt");
    const token = jwt.sign({
        _id: user._id.toString()
    }, "thisismynodejscourse");
    console.log("In generate token after jwt");
    user.tokens = user.tokens.concat({ token })
    await user.save();

    return token;
};

//class method (static method)
userSchema.statics.findByCredentials = async function (email, password) {
    //console.log(email, password);
    const user = await User.findOne({ email });
    //console.log(user);
    if (!user) {
        throw new Error("Unable to login!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable to login!");
    }

    return user;
};

//subscribe an event
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified('password')) {
        //hash the plain text password before saving  
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();

});







// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         //This line force user to provide name
//         required: true,
//         trim: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         //value is the email that's entered by user 
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error('Email is invalid!');
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 7,
//         trim: true,
//         validate(value) {
//             if (value.toLowerCase().includes('password')) {
//                 throw new Error('Password cannot contain "password"!');
//             }
//         }
//     },
//     age: {
//         type: Number,
//         defualt: 0,
//         validate(value){
//             if(value < 0){
//                 throw new Error('Age must be a positive number!');
//             }
//         }
//     }
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
