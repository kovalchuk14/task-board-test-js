import { Schema, model } from 'mongoose';

const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Untitled board',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const boardCollection = model('Board', boardSchema);
