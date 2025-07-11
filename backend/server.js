
//ContactUS portion starting at line 265
// server.js
// server.js
// CHANGES -> PROFILE(starts from line 209) and Contact US(line 591)
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Resource = require('./models/resource');
const User = require('./models/user');
const ResourceView = require('./models/Resource_Views'); // Add this import
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();

console.log('Starting server...');

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/notesmittarDB';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// GridFS Setup using mongoose connection
let gridfsBucket;
let isGridFSReady = false;

mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connection opened');
  try {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    isGridFSReady = true;
    console.log('✅ GridFS bucket initialized successfully');
  } catch (error) {
    console.error('❌ GridFS initialization error:', error);
  }
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log('File received:', file.originalname, file.mimetype);
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

// Helper function to upload to GridFS
const uploadToGridFS = (fileBuffer, filename, metadata) => {
  return new Promise((resolve, reject) => {
    if (!isGridFSReady || !gridfsBucket) {
      reject(new Error('GridFS not ready. Please wait for database connection.'));
      return;
    }

    console.log('Starting GridFS upload:', filename);

    const uploadStream = gridfsBucket.openUploadStream(filename, {
      metadata: metadata
    });

    uploadStream.on('error', (error) => {
      console.error('GridFS upload error:', error);
      reject(error);
    });

    uploadStream.on('finish', (file) => {
      console.log('GridFS upload finished successfully:', uploadStream.id);
      resolve({
        _id: uploadStream.id,
        filename: filename,
        metadata: metadata
      });
    });

    // Handle the upload
    uploadStream.end(fileBuffer);
  });
};

// Helper function to get user IP address
const getUserIP = (req) => {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

// Helper function to get user from headers
const getUserFromHeaders = async (req) => {
  const username = req.headers.username;
  if (!username) return null;

  try {
    return await User.findOne({ username });
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    gridfs: isGridFSReady ? 'Ready' : 'Not Ready'
  });
});

// Signup route
app.post('/api/signup', async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Signup successful', user: newUser.username });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // new part added
    if(user.status === 'suspended'){
      return res.status(403).json({error: 'Your Account has been suspended'});
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        uploadCount: user.uploadCount
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});
// Change Password Route
// Add these routes to your server.js file

// Get user profile route
app.get('/api/user-profile', async (req, res) => {
  try {
  
    const username = req.headers.username;
    
    console.log('Profile request headers:', { 

      username: username,
      allHeaders: req.headers 
    });
    
    if (!username) {
      return res.status(401).json({ error: 'Authorization required' });
    }
    
    let userIdentifier = username;
    
    
    if (!userIdentifier) {
      return res.status(401).json({ error: 'Username required' });
    }
    
    const user = await User.findOne({ username: userIdentifier });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Map backend fields to frontend expected fields
    res.json({
      _id: user._id,
      name: user.name,
      fullName: user.name, // Map name to fullName for frontend
      username: user.username,
      email: user.email,
      contact: user.contact || '',
      phone: user.contact || '', // Map contact to phone for frontend
      avatar: user.avatar || '👨‍🎓',
      description: user.description || '',
      semester: user.semester || '',
      branch: user.branch || '',
      uploadCount: user.uploadCount || 0,
      // Add missing fields expected by frontend
      dateJoined: user.createdAt || user.dateJoined || new Date(),
      rank: user.rank || 'Bronze Member',
      points: user.points || 0,
      isAdmin: user.isAdmin || false,
      createdAt: user.createdAt
    });
    
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile route
app.post('/api/update-profile', async (req, res) => {
  try {
    const username = req.headers.username;
    const { 
      contact, 
      phone, // Handle both contact and phone
      avatar, 
      description, 
      semester, 
      branch, 
      email,
      fullName 
    } = req.body;
    
    console.log('Update profile request:', { 
      username: username,
      bodyKeys: Object.keys(req.body)
    });
    
    if ( !username) {
      return res.status(401).json({ error: 'Authorization required' });
    }
    
    let userIdentifier = username;
    
    
    
    if (!userIdentifier) {
      return res.status(401).json({ error: 'Username required' });
    }
    
    const user = await User.findOne({ username: userIdentifier });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prepare update object with field mapping
    const updateData = {};
    
    if (contact !== undefined) updateData.contact = contact;
    if (phone !== undefined) updateData.contact = phone; // Map phone to contact
    if (avatar !== undefined) updateData.avatar = avatar;
    if (description !== undefined) updateData.description = description;
    if (semester !== undefined) updateData.semester = semester;
    if (branch !== undefined) updateData.branch = branch;
    if (email !== undefined) updateData.email = email;
    if (fullName !== undefined) updateData.name = fullName; // Map fullName to name
    
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true }
    );
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        fullName: updatedUser.name, // Map name to fullName
        username: updatedUser.username,
        email: updatedUser.email,
        contact: updatedUser.contact,
        phone: updatedUser.contact, // Map contact to phone
        avatar: updatedUser.avatar,
        description: updatedUser.description,
        semester: updatedUser.semester,
        branch: updatedUser.branch,
        uploadCount: updatedUser.uploadCount,
        dateJoined: updatedUser.createdAt || updatedUser.dateJoined,
        rank: updatedUser.rank || 'Bronze Member',
        points: updatedUser.points || 0,
        isAdmin: updatedUser.isAdmin || false
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
// Change user password route
app.post('/api/change-password', async (req, res) => {
  try {
    const username = req.headers.username;
    const { currentPassword, newPassword } = req.body;
    
    console.log('Change password request:', { 
      username: username,
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword
    });
    
    if ( !username) {
      return res.status(401).json({ error: 'Authorization required' });
    }
    
    let userIdentifier = username;

    
    if (!userIdentifier) {
      return res.status(401).json({ error: 'Username required' });
    }
    
    const user = await User.findOne({ username: userIdentifier });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});


// Upload Route with proper error handling
app.post('/api/upload', (req, res) => {
  // Use multer middleware with error handling
  upload.single('pdf')(req, res, async (err) => {
    // Handle multer errors
    if (err) {
      console.error('Multer error:', err);

      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            return res.status(400).json({
              error: 'File too large! Please choose a file smaller than 10MB.'
            });

          default:
            return res.status(400).json({
              error: 'File upload error: ' + err.message
            });
        }
      } else {
        // Custom errors (like file type validation)
        return res.status(400).json({
          error: err.message
        });
      }
    }

    // Continue with the upload process
    console.log('Upload request received');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file ? req.file.originalname : 'No file');

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!isGridFSReady) {
        return res.status(503).json({ error: 'GridFS not ready. Please try again in a moment.' });
      }

      // Extract user info from headers
      const uploadedBy = req.headers.username || 'unknown';
      const email = req.headers.email || 'unknown@example.com';

      // Validate that user exists first
      const existingUser = await User.findOne({
        $or: [
          { username: uploadedBy },
          { email: email }
        ]
      });

      if (!existingUser) {
        return res.status(400).json({
          error: 'User not found. Please login again.'
        });
      }

      const { course, semester, subject, type, year } = req.body;
      let { unit } = req.body;

      // 🚫 Reject if PYQ for the same year already exists
      if (type.toLowerCase() === 'pyqs' && year) {
        const duplicatePYQ = await Resource.findOne({
          type: 'PYQs',
          year,
          course,
          semester,
          subject
        });

        if (duplicatePYQ) {
          return res.status(409).json({
            error: `❌ A PYQ for year ${year} already exists for this subject.`,
            conflict: true
          });
        }
      }

      // Handle unit array properly
      if (unit) {
        if (typeof unit === 'string') {
          unit = [unit];
        } else if (Array.isArray(unit)) {
          // unit is already an array, keep it as is
        } else {
          unit = [];
        }
      } else {
        unit = [];
      }

      console.log('Processing upload for:', {
        course,
        semester,
        subject,
        type,
        uploadedBy: existingUser.username
      });

      // Create filename
      const timestamp = Date.now();
      const unitStr = unit.length > 0 ? unit.join('_') : 'general';
      const filename = `${course}_${semester}_${subject}_${type}_${unitStr}_${timestamp}${path.extname(req.file.originalname)}`;

      console.log('Generated filename:', filename);

      // Upload to GridFS
      const gridFSFile = await uploadToGridFS(req.file.buffer, filename, {
        originalName: req.file.originalname,
        subject: subject,
        semester: semester,
        course: course,
        type: type,
        unit: unit,
        uploadedBy: existingUser.username,
        uploadDate: new Date()
      });

      console.log('GridFS upload successful:', gridFSFile._id);

      // Check existing approved resources for this combination
      const existing = await Resource.countDocuments({
        course,
        semester,
        subject,
        type,
        status: 'approved'
      });

      const status = existing < 2 ? 'approved' : 'pending';
      console.log(`Existing approved resources: ${existing}, Status: ${status}`);

      // Create resource record
      const resource = await Resource.create({
        filename: filename,
        fileId: gridFSFile._id,
        course,
        semester,
        subject,
        type,
        year: year || null,
        unit: unit,
        status,
        uploadedBy: existingUser.username,
        uploadDate: new Date()
      });

      console.log('Resource record created:', resource._id);

      // Update user score - FIXED: Update the existing user by their _id
      const scoreIncrement = status === 'approved' ? 1 : 0.5;

      await User.findByIdAndUpdate(
        existingUser._id,
        {
          $inc: { uploadCount: scoreIncrement }
        },
        { new: true }
      );

      console.log(`✅ Upload completed: ${filename}, Status: ${status}`);
      console.log(`✅ Updated uploadCount for user: ${existingUser.username}`);

      res.status(201).json({
        message: `Upload ${status}! Your contribution has been ${status === 'approved' ? 'accepted' : 'submitted for review'}.`,
        status,
        filename: filename,
        fileId: gridFSFile._id
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
  });
});

// Fetch Contribution History Route
app.get('/api/my-resources', async (req, res) => {
  const username = req.headers.username;

  console.log('Fetching resources for user:', username);

  if (!username) {
    return res.status(400).json({ error: 'Username required in headers' });
  }

  try {
    const resources = await Resource.find({ uploadedBy: username }).sort({ uploadDate: -1 });
    console.log(`Found ${resources.length} resources for user ${username}`);

    const enriched = resources.map(doc => ({
      filename: doc.filename,
      course: doc.course,
      semester: doc.semester,
      subject: doc.subject,
      type: doc.type,
      unit: doc.unit,
      year: doc.year,
      status: doc.status,
      uploadDate: doc.uploadDate,
      fileId: doc.fileId
    }));

    res.json(enriched);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Could not fetch resources' });
  }
});

// NEW: Record view endpoint
app.post('/api/record-view/:resourceId', async (req, res) => {
  try {
    const { resourceId } = req.params;
    const user = await getUserFromHeaders(req);

    if (!user) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Check if resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Record the view
    const viewData = {
      userId: user._id,
      resourceId: new mongoose.Types.ObjectId(resourceId),
      ipAddress: getUserIP(req),
      userAgent: req.headers['user-agent'],
      sessionId: req.headers['session-id'] || null,
      referrerUrl: req.headers.referer || null
    };

    const view = await ResourceView.recordView(viewData);

    if (view) {
      // Increment view count in Resource model
      await Resource.findByIdAndUpdate(
        resourceId,
        { $inc: { viewCount: 1 } },
        { new: true }
      );

      console.log(`✅ View recorded for resource ${resourceId} by user ${user.username}`);
      res.json({ success: true, message: 'View recorded' });
    } else {
      res.json({ success: false, message: 'View already recorded today' });
    }

  } catch (error) {
    console.error('Error recording view:', error);
    res.status(500).json({ error: 'Failed to record view' });
  }
});
// CONTACT US PORTION
require('dotenv').config(); // Load .env variables

const nodemailer = require('nodemailer');
const ContactMessage = require('./models/ContactMessage');
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD);
console.log('ADMIN_EMAILS:', process.env.ADMIN_EMAILS);

// ✅ Set up nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,        // e.g., your Gmail
    pass: process.env.SMTP_PASSWORD      // your 16-character app password
  }
});
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Transporter verification failed:', error);
  } else {
    console.log('✅ Transporter is ready to send emails');
  }
});


// ✅ POST route to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // ✅ Save message to MongoDB
    const savedMessage = await ContactMessage.create({ name, email, message });
    console.log('📩 Contact form submission saved:', savedMessage);

    // ✅ Read admin email list from .env
    const adminEmails = process.env.ADMIN_EMAILS.split(',').map(e => e.trim());

    // ✅ Send email to all admins
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: adminEmails,
      subject: `New Contact Message from ${name}`,
      text: `You received a new contact message:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Message received and emailed to admins!' });
  } catch (error) {
    console.error('❌ Contact form error:', error.message, error.response || '');
    res.status(500).json({ error: 'Failed to submit message or send email' });
  }
});


// Route to download/view files with download tracking
app.get('/api/file/:id', async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const isDownload = req.query.download === 'true';

    console.log('Requesting file:', fileId, 'Download:', isDownload);

    // Get file info first
    const files = await gridfsBucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      console.log('File not found:', fileId);
      return res.status(404).json({ error: 'File not found' });
    }

    const file = files[0];
    console.log('File found:', file.filename);

    // Find the resource record
    const resource = await Resource.findOne({ fileId: fileId });

    if (resource && isDownload) {
      // Increment download count
      await Resource.findByIdAndUpdate(
        resource._id,
        { $inc: { downloadCount: 1 } },
        { new: true }
      );
      console.log(`✅ Download count incremented for resource ${resource._id}`);
    }

    // Construct custom filename based on metadata
    let safeFilename = file.filename;
    if (file.metadata) {
      const { course, semester, subject, type, unit } = file.metadata;
      const titleParts = [course, semester, subject, type, ...(unit || [])];
      safeFilename = titleParts
        .filter(Boolean)
        .join(' ')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': isDownload
        ? `attachment; filename="${safeFilename}.pdf"`
        : `inline; filename="${safeFilename}.pdf"`
    });


    // Create download stream
    const downloadStream = gridfsBucket.openDownloadStream(fileId);

    downloadStream.on('error', (error) => {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Error downloading file' });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('File access error:', error);
    res.status(500).json({ error: 'Error accessing file' });
  }
});

// Route to get all files info
app.get('/api/files', async (req, res) => {
  try {
    if (!isGridFSReady) {
      return res.status(503).json({ error: 'GridFS not ready' });
    }

    const files = await gridfsBucket.find().toArray();
    console.log(`Found ${files.length} files in GridFS`);
    res.json(files);
  } catch (error) {
    console.error('Files fetch error:', error);
    res.status(500).json({ error: 'Error fetching files' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Resource.aggregate([
      { $match: { status: 'approved' } }, // ✅ Only approved resources

      {
        $group: {
          _id: '$uploadedBy', // ✅ group by username
          totalUploads: { $sum: 1 },
          totalUpvotes: { $sum: '$upvotes' },
          avgRelevanceScore: { $avg: '$relevanceScore' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',          // username from Resource
          foreignField: 'username',   // username in User
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          uploaderId: '$user._id',
          username: '$user.username',
          name: '$user.name',
          email: '$user.email',
          contact: '$user.contact',
          branch: '$user.branch',
          totalUploads: 1,
          totalUpvotes: 1,
          avgRelevanceScore: { $round: ['$avgRelevanceScore', 2] },
          badge: {
            $switch: {
              branches: [
                { case: { $gte: ['$totalUploads', 50] }, then: 'Gold' },
                { case: { $gte: ['$totalUploads', 20] }, then: 'Silver' },
                { case: { $gte: ['$totalUploads', 5] }, then: 'Bronze' }
              ],
              default: 'Newbie'
            }
          }
        }
      },
      {
        $sort: { totalUploads: -1 }
      }
    ]);

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error('❌ Leaderboard fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});
app.get('/api/contributor/:username/resources', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resources = await Resource.find({
      uploadedBy: username,
      status: 'approved'
    });

    res.json({
      contributor: {
        name: user.name,
        username: user.username,
        branch: user.branch,
        totalUploads: user.uploadCount,
        badge:
          user.uploadCount >= 50
            ? 'Gold'
            : user.uploadCount >= 20
              ? 'Silver'
              : user.uploadCount >= 5
                ? 'Bronze'
                : 'Newbie'
      },
      resources
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching contributor info.' });
  }
});


// Get user's rank
app.get('/api/my-rank', async (req, res) => {
  const username = req.headers.username;

  if (!username) {
    return res.status(400).json({ error: 'Username required in headers' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count users with higher uploadCount
    const rank = await User.countDocuments({
      uploadCount: { $gt: user.uploadCount }
    }) + 1;

    // Get total users with uploads
    const totalUsers = await User.countDocuments({
      uploadCount: { $gt: 0 }
    });

    res.json({
      rank,
      uploadCount: user.uploadCount,
      totalUsers,
      percentile: totalUsers > 0 ? Math.round(((totalUsers - rank + 1) / totalUsers) * 100) : 0
    });
  } catch (error) {
    console.error('Rank fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch rank' });
  }
});

// Fetch filtered resources with view and download counts
app.get('/api/resources', async (req, res) => {
  try {
    const { course, semester, subject, type } = req.query;

    if (!course || !semester || !subject || !type) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const resources = await Resource.find({
      course,
      semester,
      subject,
      type,
      status: 'approved'
    }).sort({ uploadDate: -1 });

    // ✅ Fetch original filename from GridFS using fileId and include counts
    const enriched = await Promise.all(
      resources.map(async (doc) => {
        let originalName = '';
        try {
          const files = await gridfsBucket.find({ _id: doc.fileId }).toArray();
          const gridFile = files[0];
          originalName = gridFile?.metadata?.originalName || doc.filename;
        } catch (err) {
          console.warn(`GridFS lookup failed for ${doc.fileId}:`, err.message);
          originalName = doc.filename;
        }

        // Get view count from ResourceView collection
        const viewCount = await ResourceView.getViewCountByResource(doc._id);
        function toTitleCase(str) {
          return str
            .split(' ')
            .map(word => word[0]?.toUpperCase() + word.slice(1)?.toLowerCase())
            .join(' ');
        }

        return {
          _id: doc._id,
          originalName,
          title: toTitleCase([
            doc.course,
            doc.semester,
            doc.subject,
            doc.type,
            ...(doc.type?.toLowerCase() === 'pyq' && doc.year ? [doc.year] : []),
            ...(Array.isArray(doc.unit) ? doc.unit : [])
          ].filter(Boolean).join(' ')),


          // ✅ Now sent to frontend
          filename: doc.filename,      // fallback
          author: doc.uploadedBy,
          year: doc.year,
          unit: doc.unit,
          viewCount: viewCount,        // ✅ View count from ResourceView
          downloadCount: doc.downloadCount || 0, // ✅ Download count from Resource
          fileUrl: `http://localhost:5000/api/file/${doc.fileId}`
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});
//Adding new portion for ADMIN
// Middleware to restrict access to admin only
const adminUsernames = ['q', 'h', 'rahul']; // replace with your team usernames
const AdminAction = require('./models/Transaction');

const isAdmin = async (req, res, next) => {
  try {
    const username = req.headers.username;
    console.log('🔐 Admin check for username:', username); // Debug log

    if (!username) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ No user found');
    } else if (!user.isAdmin) {
      console.log('❌ User is not admin');
    }

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    console.error('❌ Admin check failed:', error);
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

// 1)For ManageContributors
app.get('/api/admin/contributors', isAdmin, async (req, res) => {
  try {
    const contributors = await User.find(
      { uploadCount: { $gt: 0 } },
      'name username uploadCount status suspensionReason'
    ); // select only the required fields

    res.json(contributors);
  } catch (err) {
    console.error('Error fetching contributors:', err);
    res.status(500).json({ error: 'Failed to fetch contributors' });
  }
});


app.post('/api/admin/contributor/suspend', isAdmin, async (req, res) => {
  try {
    const { username, reason } = req.body;
    const adminUser = req.adminUser;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isSuspending = user.status === 'active';
    user.status = isSuspending ? 'suspended' : 'active';
    user.suspensionReason = isSuspending ? (reason || 'No reason provided') : '';
    await user.save();

    const log = new Transaction({
      type: 'contributorAction',
      adminId: adminUser._id,
      adminDecision: isSuspending ? 'suspend' : 'activate',
      contributorUsername: username,
      reason: isSuspending ? (reason || 'No reason provided') : ''
    });
    await log.save();

    res.json({ message: `User ${user.status} successfully`, user });
  } catch (err) {
    console.error('Error suspending contributor:', err);
    res.status(500).json({ error: 'Failed to update contributor status' });
  }
});

app.get('/api/admin/actions', isAdmin, async (req, res) => {
  try {
    const actions = await AdminAction.find().sort({ timestamp: -1 });
    res.json(actions);
  } catch (err) {
    console.error('Error fetching admin actions:', err);
    res.status(500).json({ error: 'Failed to fetch admin actions' });
  }
});

app.post('/api/admin/contributor/reason', isAdmin, async (req, res) => {
  try {
    const { username, reason } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.suspensionReason = reason || '';
    await user.save();

    res.json({ message: 'Suspension reason updated', user });
  } catch (err) {
    console.error('Error updating reason:', err);
    res.status(500).json({ error: 'Failed to update reason' });
  }
});
// MANAGE RESOURCES 
app.get('/api/admin/pending-resources', isAdmin, async (req, res) => {
  try {
    console.log('📋 Fetching pending resources for admin review...');

    const pendingResources = await Resource.find({ status: 'pending' })
      .sort({ uploadDate: -1 })
      .lean(); // No need to populate, since uploadedBy is a string

    console.log(`📋 Found ${pendingResources.length} pending resources`);

    const enrichedResources = await Promise.all(
      pendingResources.map(async (resource) => {
        const existingResources = await Resource.find({
          course: resource.course,
          semester: resource.semester,
          subject: resource.subject,
          type: resource.type,
          status: 'approved',
          _id: { $ne: resource._id }
        }).lean();

        return {
          ...resource,
          uploadedBy: {
            name: resource.uploadedBy || 'Unknown',
            username: resource.uploadedBy || 'unknown'
          },
          uploadedAt: resource.uploadDate || resource.createdAt || null,
          existingResources: existingResources.map(existing => ({
            ...existing,
            uploadedBy: {
              name: existing.uploadedBy || 'Unknown',
              username: existing.uploadedBy || 'unknown'
            },
            uploadedAt: existing.uploadDate || existing.createdAt || null
          }))
        };
      })
    );

    res.json(enrichedResources);
  } catch (error) {
    console.error('❌ Error fetching pending resources:', error);
    res.status(500).json({ error: 'Failed to fetch pending resources' });
  }
});



// Approve a resource
app.post('/api/admin/approve-resource/:resourceId', isAdmin, async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { replaceResourceId } = req.body; // Optional: ID of resource to replace
    
    console.log(`✅ Admin ${req.adminUser.username} approving resource ${resourceId}`);
    
    // Find the resource
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // If replacing an existing resource
    if (replaceResourceId) {
      const oldResource = await Resource.findById(replaceResourceId);
      if (oldResource) {
        // Create transaction record for replacement
        try {
  await Transaction.create({
    type: 'docExtendOrReplace',
    oldDocument: {
      fileHash: oldResource.fileHash || 'legacy',
      filename: oldResource.filename,
      contributor: oldResource.uploadedBy,
      relevanceScore: oldResource.relevanceScore || 0,
      syllabusTopics: oldResource.syllabusTopics || [],
      resourceId: oldResource._id
    },
    newDocument: {
      fileHash: resource.fileHash || 'legacy',
      filename: resource.filename,
      contributor: resource.uploadedBy,
      relevanceScore: resource.relevanceScore || 0,
      syllabusTopics: resource.syllabusTopics || [],
      unit: resource.unit ? resource.unit.join(', ') : '',
      course: resource.course,
      semester: resource.semester,
      resourceId: resource._id
    },
    adminId: req.adminUser._id,
    adminDecision: 'replace',
    resourceId: resource._id,
    filename: resource.filename,
    course: resource.course,
    semester: resource.semester,
    subject: resource.subject,
    resourceType: resource.type
  });
} catch (err) {
  console.error('❌ Failed to record docExtendOrReplace transaction:', err);
}

        // Remove old resource
        await Resource.findByIdAndDelete(replaceResourceId);
        
        // Delete file from GridFS
        if (oldResource.fileId) {
          try {
            await gridfsBucket.delete(oldResource.fileId);
          } catch (error) {
            console.warn('Failed to delete old file from GridFS:', error);
          }
        }
        
        console.log(`🔄 Resource ${replaceResourceId} replaced with ${resourceId}`);
      }
    }
    
    // Approve the resource
    await Resource.findByIdAndUpdate(resourceId, { status: 'approved' });
    
    // Create transaction record for approval
    await Transaction.create({
      type: 'approval',
      adminId: req.adminUser._id,
      adminDecision: 'approve',
      resourceId: resource._id,
      filename: resource.filename,
      course: resource.course,
      semester: resource.semester,
      subject: resource.subject,
      resourceType: resource.type
    });
    
    // Update user's upload count if not already counted
    const user = await User.findOne({ username: resource.uploadedBy });
    if (user) {
      await User.findByIdAndUpdate(user._id, { $inc: { uploadCount: 0.5 } }); // Add 0.5 more to make it 1 total
    }
    
    res.json({ 
      success: true, 
      message: replaceResourceId ? 'Resource approved and replaced existing resource' : 'Resource approved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error approving resource:', error);
    res.status(500).json({ error: 'Failed to approve resource' });
  }
});

// Reject a resource
app.post('/api/admin/reject-resource/:resourceId', isAdmin, async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { reason } = req.body;
    
    console.log(`❌ Admin ${req.adminUser.username} rejecting resource ${resourceId}`);
    
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Update resource status
    await Resource.findByIdAndUpdate(resourceId, { 
      status: 'rejected',
      rejectionReason: reason || 'No reason provided'
    });
    
    // Create transaction record
    await Transaction.create({
      type: 'rejection',
      adminId: req.adminUser._id,
      adminDecision: 'reject',
      resourceId: resource._id,
      filename: resource.filename,
      course: resource.course,
      semester: resource.semester,
      subject: resource.subject,
      resourceType: resource.type,
      reason: reason || 'No reason provided'
    });
    
    // Delete file from GridFS
    if (resource.fileId) {
      try {
        await gridfsBucket.delete(resource.fileId);
        console.log(`🗑️ File ${resource.fileId} deleted from GridFS`);
      } catch (error) {
        console.warn('Failed to delete file from GridFS:', error);
      }
    }
    
    res.json({ success: true, message: 'Resource rejected successfully' });
    
  } catch (error) {
    console.error('❌ Error rejecting resource:', error);
    res.status(500).json({ error: 'Failed to reject resource' });
  }
});

// Remove an approved resource
app.delete('/api/admin/remove-resource/:resourceId', isAdmin, async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { reason } = req.body;
    
    console.log(`🗑️ Admin ${req.adminUser.username} removing resource ${resourceId}`);
    
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Create transaction record
    await Transaction.create({
      type: 'resourceRemoval',
      adminId: req.adminUser._id,
      adminDecision: 'remove',
      resourceId: resource._id,
      docFileHash: resource.fileHash || 'legacy',
      filename: resource.filename,
      contributor: resource.uploadedBy,
      reason: reason || 'No reason provided',
      course: resource.course,
      semester: resource.semester,
      subject: resource.subject,
      resourceType: resource.type
    });
    
    // Delete file from GridFS
    if (resource.fileId) {
      try {
        await gridfsBucket.delete(resource.fileId);
        console.log(`🗑️ File ${resource.fileId} deleted from GridFS`);
      } catch (error) {
        console.warn('Failed to delete file from GridFS:', error);
      }
    }
    
    // Remove resource from database
    await Resource.findByIdAndDelete(resourceId);
    
    // Decrease user's upload count
    const user = await User.findOne({ username: resource.uploadedBy });
    if (user && user.uploadCount > 0) {
      await User.findByIdAndUpdate(user._id, { $inc: { uploadCount: -1 } });
    }
    
    res.json({ success: true, message: 'Resource removed successfully' });
    
  } catch (error) {
    console.error('❌ Error removing resource:', error);
    res.status(500).json({ error: 'Failed to remove resource' });
  }
});

// Get admin transaction history
app.get('/api/admin/transactions', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    const query = {};
    if (type) query.type = type;
    
    const transactions = await Transaction.find(query)
      .populate('adminId', 'name username')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await Transaction.countDocuments(query);
    
    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get admin dashboard stats
app.get('/api/admin/stats', isAdmin, async (req, res) => {
  try {
    const stats = await Promise.all([
      Resource.countDocuments({ status: 'pending' }),
      Resource.countDocuments({ status: 'approved' }),
      Resource.countDocuments({ status: 'rejected' }),
      User.countDocuments({}),
      Transaction.countDocuments({ type: 'approval' }),
      Transaction.countDocuments({ type: 'rejection' })
    ]);
    
    res.json({
      pendingResources: stats[0],
      approvedResources: stats[1],
      rejectedResources: stats[2],
      totalUsers: stats[3],
      totalApprovals: stats[4],
      totalRejections: stats[5]
    });
    
  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}); 




const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
