import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    root: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/baygroup/image/upload/v1623484398/nextjs_media/user_default.png',
    },
  },
  {
    timestamps: true,
  },
)

let Dataset = mongoose.models.user || mongoose.model('user', userSchema)
export default Dataset
