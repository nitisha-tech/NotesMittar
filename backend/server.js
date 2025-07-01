
// server.js
// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Resource = require('./models/resource');
const User = require('./models/user');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();

console.log('Starting server...');

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/notesmittarDB';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

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
    fileSize: 10 * 1024 * 1024
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

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

    uploadStream.end(fileBuffer);
  });
};

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    gridfs: isGridFSReady ? 'Ready' : 'Not Ready'
  });
});

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

    res.status(200).json({
      message: 'Login successful',
      user: {
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

app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  console.log('Upload request received');

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!isGridFSReady) {
      return res.status(503).json({ error: 'GridFS not ready. Please try again in a moment.' });
    }

    const uploadedBy = req.headers.username || 'unknown';
    const email = req.headers.email || 'unknown@example.com';

    const { course, semester, subject, type, year } = req.body;
    let { unit } = req.body;

    if (unit) {
      if (typeof unit === 'string') {
        unit = [unit];
      } else if (Array.isArray(unit)) {
      } else {
        unit = [];
      }
    } else {
      unit = [];
    }

    const timestamp = Date.now();
    const unitStr = unit.length > 0 ? unit.join('_') : 'general';
    const filename = `${course}_${semester}_${subject}_${type}_${unitStr}_${timestamp}${path.extname(req.file.originalname)}`;

    const gridFSFile = await uploadToGridFS(req.file.buffer, filename, {
      originalName: req.file.originalname,
      subject: subject,
      semester: semester,
      course: course,
      type: type,
      unit: unit,
      uploadedBy: uploadedBy,
      uploadDate: new Date()
    });

    const existing = await Resource.countDocuments({
      course,
      semester,
      subject,
      type,
      status: 'approved'
    });

    const status = existing < 2 ? 'approved' : 'pending';

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
      uploadedBy,
      uploadDate: new Date()
    });

    const scoreIncrement = status === 'approved' ? 1 : 0.5;

    await User.findOneAndUpdate(
      { email },
      {
        $setOnInsert: { name: uploadedBy, registeredAt: new Date() },
        $inc: { uploadCount: scoreIncrement }
      },
      { upsert: true, new: true }
    );

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

app.get('/api/my-resources', async (req, res) => {
  const username = req.headers.username;

  if (!username) {
    return res.status(400).json({ error: 'Username required in headers' });
  }

  try {
    const resources = await Resource.find({ uploadedBy: username }).sort({ uploadDate: -1 });

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

app.get('/api/file/:id', async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const files = await gridfsBucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = files[0];

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${file.filename}"`
    });

    const downloadStream = gridfsBucket.openDownloadStream(fileId);

    downloadStream.on('error', (error) => {
      res.status(500).json({ error: 'Error downloading file' });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('File access error:', error);
    res.status(500).json({ error: 'Error accessing file' });
  }
});

// FIXED: Single /api/resources endpoint with proper filtering and user lookup
// Fix 2: In your server.js - Update the resources endpoint to handle year conversion
app.get('/api/resources', async (req, res) => {
  try {
    const { course, semester, subject, type, year } = req.query;
    const query = { status: 'approved' };

    if (course) query.course = course;
    if (semester) query.semester = semester;
    if (subject) query.subject = subject;
    if (type) query.type = type;
    if (type === 'PYQs' && year) {
      query.year = parseInt(year);
    }

    const resources = await Resource.find(query);

    const modifiedResources = resources.map(res => {
      let title = '';
      if (res.type === 'Notes') {
        title = res.unit?.length > 0 ? `Unit ${res.unit.join(', ')}` : 'Notes';
      } else {
        title = res.filename || 'Untitled';
      }

      return {
        _id: res._id,
        title,
        author: res.uploadedBy,
        fileUrl: `http://localhost:5000/api/download/${res.fileId}`,
        type: res.type,
        downloadCount: res.downloadCount
      };
    });

    res.status(200).json(modifiedResources);
  } catch (err) {
    console.error('Resource Fetch Error:', err);
    res.status(500).json({ error: 'Unable to fetch resources' });
  }
});

app.get('/api/files', async (req, res) => {
  try {
    if (!isGridFSReady) {
      return res.status(503).json({ error: 'GridFS not ready' });
    }

    const files = await gridfsBucket.find().toArray();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching files' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
