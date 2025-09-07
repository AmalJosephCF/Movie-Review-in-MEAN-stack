import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,             // unique index
    trim: true,
    minlength: 3,
    maxlength: 32
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 80
  },
  email: {
    type: String,
    required: true,
    unique: true,             // unique index
    trim: true,
    lowercase: true
  },
  password: {                 // hashed
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profilePhoto: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Remove password when sending to client
userSchema.methods.toClient = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
