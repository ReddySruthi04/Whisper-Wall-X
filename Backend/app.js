const express = require("express");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} = require("firebase/firestore");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const { faker } = require("@faker-js/faker");
const geoip = require("geoip-lite");
const cors = require("cors");
const bcrypt = require("bcrypt");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFQaXafyBSwz3mFLPGk7vyuDpuwoabeFU",
  authDomain: "whisperwall-x.firebaseapp.com",
  projectId: "whisperwall-x",
  storageBucket: "whisperwall-x.firebasestorage.app",
  messagingSenderId: "482565929438",
  appId: "1:482565929438:web:8b1eea030afbc33947c54f",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

const app = express();

// Enable CORS
app.use(cors());

app.use(bodyParser.json());
app.set("trust proxy", true); 
// Function to generate fake data
const generateRandomPhoneNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const generateFakeData = () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  address: faker.location.streetAddress(),
  phone: generateRandomPhoneNumber(),
});

// Function to generate fake employee data
const generateFakeEmployeeData = () => ({
  employeeId: faker.string.alphanumeric(6).toUpperCase(),
  department: faker.commerce.department(),
  position: faker.person.jobTitle(),
  salary: faker.finance.amount(30000, 150000, 2),
  hireDate: faker.date.past({ years: 10 }).toISOString().split("T")[0],
  performance: faker.helpers.arrayElement([
    "Excellent",
    "Good",
    "Average",
    "Poor",
  ]),
});

// Function to gather metadata
const gatherMetadata = (req) => {
  const ip = req.ip; // Now correctly gets client IP when using trust proxy
  const location = geoip.lookup(ip) || {}; // Handle cases where geolocation fails
  return {
    ip,
    location: location ? { ...location } : null, // Store null if lookup fails
    userAgent: req.headers["user-agent"],
    timestamp: new Date().toISOString(),
  };
};

// Create a transporter object using SMTP configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service provider (e.g., Gmail, Outlook)
  auth: {
    user: "harshrb2424@gmail.com", // Replace with your email address
    pass: "hcvd trgn nxnj titu", // Replace with your email password or app-specific password
  },
});

/**
 * Function to send an alert for suspicious login attempts
 * @param {string} userEmail 
 * @param {string} ipAddress
 * @param {string} deviceInfo 
 */
async function sendRegistrationAlert(userEmail, username, name) {
  try {
    const mailOptions = {
      from: "harshrb2424@gmail.com", // Sender email address
      to: userEmail, // Recipient email address
      subject: "Welcome to Our Platform - Registration Successful",
      text: `
        Hello ${name},
        
        Thank you for registering with us! Below are your account details:
        
        - Username: ${username}
        - Email: ${userEmail}
        
        Please keep this information safe. If you have any questions or need assistance, feel free to contact our support team.
        
        Best regards,
        Your Platform Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Registration alert sent:", info.messageId);
  } catch (error) {
    console.error("Error sending registration alert:", error);
  }
}
async function sendSuspiciousLoginAlert(userEmail, ipAddress, deviceInfo) {
  try {
    const mailOptions = {
      from: "harshrb2424@gmail.com", // Sender email address
      to: userEmail, // Recipient email address
      subject: "Suspicious Login Attempt Detected",
      text: `
        We have detected a suspicious login attempt to your account.
        
        Details:
        - IP Address: ${ipAddress}
        - Device Info: ${deviceInfo}
        
        If this was not you, please secure your account immediately.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Suspicious login alert sent:", info.messageId);
  } catch (error) {
    console.error("Error sending suspicious login alert:", error);
  }
}
async function SOSAlert(email, location) {
  try {
    const mailOptions = {
      from: "harshrb2424@gmail.com", // Sender email address
      to: "amarakumar223@gmail.com", // Recipient email address
      subject: "SOS",
      text: `
        SOS
        
        Details:
        - Location: ${location}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Suspicious login alert sent:", info.messageId);
  } catch (error) {
    console.error("Error sending suspicious login alert:", error);
  }
}

/**
 * Function to send an alert for failed login attempts
 * @param {string} userEmail 
 * @param {number} failedAttempts 
 */
async function sendFailedLoginAlert(userEmail) {
  try {
    const mailOptions = {
      from: "your-email@gmail.com", // Sender email address
      to: userEmail, // Recipient email address
      subject: "Failed Login Attempts Detected",
      text: `
        We have detected failed login attempt(s) to your account.
        
        Please ensure that your credentials are correct and secure your account.
        If this was not you, consider changing your password immediately.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Failed login alert sent:", info.messageId);
  } catch (error) {
    console.error("Error sending failed login alert:", error);
  }
}

// // Example usage:
// (async () => {
//   // Simulate sending a suspicious login alert
//   await sendSuspiciousLoginAlert(
//     "user@example.com",
//     "192.168.1.1",
//     "Windows 10, Chrome Browser"
//   );

//   // Simulate sending a failed login alert
//   await sendFailedLoginAlert("user@example.com", 5);
// })();

// Register user with password
app.post("/register", async (req, res) => {
  try {
    const { username, email, name, password } = req.body;

    if (!username || !email || !name || !password) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Check if user already exists
    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return res.status(409).send({ error: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const metadata = gatherMetadata(req);
    const fakeData = generateFakeData();
    const fakeEmployeeData = generateFakeEmployeeData();

    await setDoc(doc(db, "users", email), {
      username,
      email,
      name,
      password: hashedPassword, // Store hashed password
      metadata,
      fakeData,
      fakeEmployeeData, // Store fake employee data
      employeeData: {}, // Will be populated later
    });
    sendRegistrationAlert(email, username, name);
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ error: "Registration failed" }); // Generic error message
  }
});

// Login with password and detect suspicious activity
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required" });
    }

    const metadata = gatherMetadata(req);

    const userRef = doc(db, "users", email);
    const docSnap = await getDoc(userRef);

    // Check if user exists
    if (!docSnap.exists()) {
      // Generate fake data for non-existent users but return auth error
      await addDoc(collection(db, "failed_logins"), {
        email,
        metadata,
        reason: "User not found",
      });
      return res.status(401).send({ error: "Invalid email or password" });
    }

    const userData = docSnap.data();

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      await addDoc(collection(db, "failed_logins"), {
        email,
        metadata,
        reason: "Password mismatch",
      });
      sendFailedLoginAlert(email);
      return res.status(401).send({ error: "Invalid email or password" });
    }

    // Check for suspicious activity
    const isSuspicious = detectSuspiciousActivity(metadata, userData.metadata);

    if (isSuspicious) {
      await addDoc(collection(db, "suspicious_logins"), { email, metadata });
      sendSuspiciousLoginAlert(email, metadata.ip, metadata.userAgent);
      return res.status(200).send({
        message: "Login successful",
        data: {
          username: userData.username,
          email: userData.email,
          name: userData.name,
          employeeData: userData.fakeEmployeeData || {}, // Send fake employee data
        },
        suspicious: true,
      });
    }

    // Successful login with correct credentials, not suspicious
    // Update the metadata for future logins
    await updateDoc(userRef, {
      metadata: metadata,
    });

    res.status(200).send({
      message: "Login successful",
      data: {
        username: userData.username,
        email: userData.email,
        name: userData.name,
        employeeData: userData.employeeData || {}, // Send real employee data
      },
      suspicious: false,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ error: "Login failed" }); // Generic error message
  }
});
app.post("/send-alert", async (req, res) => {
  try {
    const { email, location } = req.body;
    SOSAlert(email, location);
  } catch (error) {
    console.error("Alert error:", error);
    res.status(500).send({ error: "Alert failed" }); // Generic error message
  }
});

// Improved suspicious activity detection
const detectSuspiciousActivity = (newMeta, oldMeta) => {
  // If old metadata doesn't exist (first login), not suspicious
  if (!oldMeta) return false;

  // Check for IP mismatch
  if (newMeta.ip !== oldMeta.ip) return true;

  // Check for location changes if both exist
  if (newMeta.location && oldMeta.location) {
    const { city: newCity, country: newCountry } = newMeta.location;
    const { city: oldCity, country: oldCountry } = oldMeta.location;

    if (newCity !== oldCity || newCountry !== oldCountry) return true;
  }

  // Check for unreasonable timestamp differences (more than 1 day)
  const newTime = new Date(newMeta.timestamp).getTime();
  const oldTime = new Date(oldMeta.timestamp).getTime();
  if (Math.abs(newTime - oldTime) < 86400000) return false; // 24h threshold

  return false;
};

// Create employee info
app.post("/employee-info", async (req, res) => {
  try {
    const { email, employeeData } = req.body;

    if (!email || !employeeData) {
      return res
        .status(400)
        .send({ error: "Email and employee data are required" });
    }

    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return res.status(404).send({ error: "User not found" });
    }

    // Update the user document with employee data
    await updateDoc(userRef, {
      employeeData: employeeData,
    });

    res.status(201).send({
      message: "Employee information added successfully",
      data: employeeData,
    });
  } catch (error) {
    console.error("Create employee info error:", error);
    res.status(500).send({ error: "Failed to create employee information" });
  }
});

// Read employee info
app.get("/employee-info/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const metadata = gatherMetadata(req);

    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return res.status(404).send({ error: "User not found" });
    }

    const userData = userDoc.data();

    // Check for suspicious activity
    const isSuspicious = detectSuspiciousActivity(metadata, userData.metadata);

    if (isSuspicious) {
      await addDoc(collection(db, "suspicious_reads"), { email, metadata });
      return res.status(200).send({
        data: userData.fakeEmployeeData || {}, // Send fake data
        suspicious: true,
      });
    }

    // Send real data
    res.status(200).send({
      data: userData.employeeData || {},
      suspicious: false,
    });
  } catch (error) {
    console.error("Read employee info error:", error);
    res.status(500).send({ error: "Failed to retrieve employee information" });
  }
});

// Update employee info
app.put("/employee-info/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { employeeData } = req.body;
    const metadata = gatherMetadata(req);

    if (!employeeData) {
      return res.status(400).send({ error: "Employee data is required" });
    }

    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return res.status(404).send({ error: "User not found" });
    }

    const userData = userDoc.data();

    // Check for suspicious activity
    const isSuspicious = detectSuspiciousActivity(metadata, userData.metadata);

    if (isSuspicious) {
      await addDoc(collection(db, "suspicious_updates"), { email, metadata });
      return res.status(200).send({
        message: "Update request processed",
        data: userData.fakeEmployeeData,
        suspicious: true,
      });
    }

    // Update real employee data
    await updateDoc(userRef, {
      employeeData: employeeData,
    });

    res.status(200).send({
      message: "Employee information updated successfully",
      data: employeeData,
      suspicious: false,
    });
  } catch (error) {
    console.error("Update employee info error:", error);
    res.status(500).send({ error: "Failed to update employee information" });
  }
});

// Delete employee info
app.delete("/employee-info/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const metadata = gatherMetadata(req);

    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return res.status(404).send({ error: "User not found" });
    }

    const userData = userDoc.data();

    // Check for suspicious activity
    const isSuspicious = detectSuspiciousActivity(metadata, userData.metadata);

    if (isSuspicious) {
      await addDoc(collection(db, "suspicious_deletions"), { email, metadata });
      return res.status(200).send({
        message: "Delete request processed",
        suspicious: true,
      });
    }

    // Remove employee data but keep the user
    await updateDoc(userRef, {
      employeeData: {}, // Clear employee data
    });

    res.status(200).send({
      message: "Employee information deleted successfully",
      suspicious: false,
    });
  } catch (error) {
    console.error("Delete employee info error:", error);
    res.status(500).send({ error: "Failed to delete employee information" });
  }
});

// Get all employees (with security check to return real or fake data)
app.get("/employees", async (req, res) => {
  try {
    const metadata = gatherMetadata(req);
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    // Get admin info from headers or token (simplified for example)
    const adminEmail = req.headers["admin-email"];

    if (!adminEmail) {
      return res.status(401).send({ error: "Admin authentication required" });
    }

    // Check admin credentials
    const adminRef = doc(db, "users", adminEmail);
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) {
      return res.status(401).send({ error: "Admin not found" });
    }

    const adminData = adminDoc.data();
    const isSuspicious = detectSuspiciousActivity(metadata, adminData.metadata);

    const employees = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();

      // If suspicious, return fake data for all employees
      if (isSuspicious) {
        employees.push({
          email: userData.email,
          name: userData.name,
          employeeData: userData.fakeEmployeeData || {},
        });
      } else {
        // Return real data
        employees.push({
          email: userData.email,
          name: userData.name,
          employeeData: userData.employeeData || {},
        });
      }
    });

    if (isSuspicious) {
      await addDoc(collection(db, "suspicious_bulk_reads"), {
        adminEmail,
        metadata,
      });
    }

    res.status(200).send({
      data: employees,
      suspicious: isSuspicious,
    });
  } catch (error) {
    console.error("Get all employees error:", error);
    res.status(500).send({ error: "Failed to retrieve employees" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
