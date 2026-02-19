import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌  MONGO_URI not found in .env");
    process.exit(1);
}

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        userType: { type: String, enum: ["student", "hr"], default: "student" },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

const SEED_USERS = [
    {
        name: "Pratik Kadnor",
        email: "pk31052004@gmail.com",
        password: "Pratik@123",
        userType: "student",
    },
];

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log("✅  Connected to MongoDB");

    for (const u of SEED_USERS) {
        const existing = await User.findOne({ email: u.email });
        if (existing) {
            console.log(`⚠️   User already exists: ${u.email} — skipping`);
            continue;
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(u.password, salt);
        await User.create({ ...u, password: hashed });
        console.log(`✅  Seeded: ${u.name} (${u.email}) [${u.userType}]`);
    }

    await mongoose.disconnect();
    console.log("🔌  Disconnected. Done.");
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
