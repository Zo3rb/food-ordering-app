import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

interface VendorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: string[];
  pinCode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  serviceAvailable: boolean;
  coverImages: string[];
  rating: number;
  foods: any;
  lat: number;
  lng: number;
}

const VendorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    foodType: {
      type: [String],
    },
    pinCode: {
      type: String,
      required: true,
      index: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    serviceAvailable: {
      type: Boolean,
      default: false,
    },
    coverImages: {
      type: [String],
    },
    rating: {
      type: Number,
      default: 0,
    },
    lat: Number,
    lng: Number,
  },
  {
    toJSON: {
      transform(doc, obj) {
        delete obj.password;
        delete obj.__v;
      },
    },
    timestamps: true,
  }
);

VendorSchema.pre<VendorDoc>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

VendorSchema.methods.comparePassword = async function (
  this: VendorDoc,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const VendorModel = mongoose.model<VendorDoc>("Vendor", VendorSchema);

export default VendorModel;
