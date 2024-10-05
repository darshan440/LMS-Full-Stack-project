import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

// Interfaces

interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies?: IComment[];
}

interface IReview extends Document {
  user: object;
  rating: number;
  comment: string;
  commentReplies?: IComment[];
}

interface ILink extends Document {
  title: string; // Fixed typo from 'titel' to 'title'
  url: string;
}

interface ICourseContent extends Document {
  title: string; // Fixed typo
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[]; // Fixed typo from 'link' to 'links' for consistency
  suggestion: string;
  questions: IComment[];
}

export interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[]; // Fixed typo
  prerequisites: { title: string }[]; // Fixed typo
  review: IReview[];
  courseContent: ICourseContent[]; // Renamed courseData to courseContent
  rating: number;
  purchased: number;
}

// Schemas

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
});

const linkSchema = new Schema<ILink>({
  title: String, // Fixed typo
  url: String,
});

const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: [Object],
});

const courseContentSchema = new Schema<ICourseContent>({
  videoUrl: String,
  title: String, // Fixed typo
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema], // Fixed from 'link' to 'links'
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }], // Fixed typo
    prerequisites: [{ title: String }], // Fixed typo
    review: [reviewSchema],
    courseContent: [courseContentSchema], // Renamed courseData to courseContent
    rating: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;
