/**
 * This script seeds the MongoDB database directly using the MongoDB driver,
 * bypassing Prisma's transaction requirements.
 * 
 * Run this script with: node scripts/seed-mongodb.js
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';

async function seed() {
  try {
    console.log('Starting direct MongoDB seed...');
    
    // Connect to MongoDB
    const client = new MongoClient(DATABASE_URL);
    await client.connect();
    
    const db = client.db();
    
    // Clear existing data
    await db.collection('User').deleteMany({});
    await db.collection('Subject').deleteMany({});
    await db.collection('Availability').deleteMany({});
    await db.collection('Message').deleteMany({});
    await db.collection('Booking').deleteMany({});
    await db.collection('Review').deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create subjects
    console.log('Creating subjects...');
    const subjects = await db.collection('Subject').insertMany([
      {
        name: 'Mathematics',
        description: 'Algebra, Calculus, Geometry, and more',
        teacherIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Physics',
        description: 'Classical Mechanics, Electromagnetism, Quantum Physics',
        teacherIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chemistry',
        description: 'Organic Chemistry, Inorganic Chemistry, Biochemistry',
        teacherIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Biology',
        description: 'Molecular Biology, Genetics, Ecology',
        teacherIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Computer Science',
        description: 'Programming, Algorithms, Data Structures',
        teacherIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'English',
        description: 'Grammar, Literature, Writing',
        teacherIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'History',
        description: 'World History, European History, American History',
        teacherIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Foreign Languages',
        description: 'French, Spanish, German, Chinese, Japanese',
        teacherIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    const subjectIds = subjects.insertedIds;
    console.log('Created subjects');
    
    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
    const admin = await db.collection('User').insertOne({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@academ.com',
      password: adminPassword,
      role: 'admin',
      subjectIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Created admin user');
    
    // Create student users
    console.log('Creating student users...');
    const studentPassword = await bcrypt.hash('student123', SALT_ROUNDS);
    const students = await db.collection('User').insertMany([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: studentPassword,
        role: 'student',
        bio: 'High school student interested in STEM subjects',
        subjectIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: studentPassword,
        role: 'student',
        bio: 'College student majoring in Computer Science',
        subjectIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael@example.com',
        password: studentPassword,
        role: 'student',
        bio: 'Graduate student in Physics',
        subjectIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    const studentIds = students.insertedIds;
    console.log('Created student users');
    
    // Create teacher users
    console.log('Creating teacher users...');
    const teacherPassword = await bcrypt.hash('teacher123', SALT_ROUNDS);
    
    // Create Robert Williams (Mathematics and Physics teacher)
    const robert = await db.collection('User').insertOne({
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'robert@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Mathematics professor with 10 years of experience',
      subjectIds: [subjectIds[0], subjectIds[1]], // Mathematics and Physics
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Update subjects with teacher ID
    await db.collection('Subject').updateOne(
      { _id: subjectIds[0] },
      { $set: { teacherIds: [robert.insertedId] } }
    );
    
    await db.collection('Subject').updateOne(
      { _id: subjectIds[1] },
      { $set: { teacherIds: [robert.insertedId] } }
    );
    
    // Create Robert's availability
    const robertAvailabilities = await db.collection('Availability').insertMany([
      {
        teacherId: robert.insertedId,
        dayOfWeek: 1, // Monday
        startTime: new Date('2025-01-01T09:00:00Z'),
        endTime: new Date('2025-01-01T17:00:00Z'),
        recurring: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        teacherId: robert.insertedId,
        dayOfWeek: 3, // Wednesday
        startTime: new Date('2025-01-01T09:00:00Z'),
        endTime: new Date('2025-01-01T17:00:00Z'),
        recurring: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        teacherId: robert.insertedId,
        dayOfWeek: 5, // Friday
        startTime: new Date('2025-01-01T09:00:00Z'),
        endTime: new Date('2025-01-01T17:00:00Z'),
        recurring: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Create Emily Brown (Biology and Chemistry teacher)
    const emily = await db.collection('User').insertOne({
      firstName: 'Emily',
      lastName: 'Brown',
      email: 'emily@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Biology and Chemistry teacher with a PhD in Biochemistry',
      subjectIds: [subjectIds[2], subjectIds[3]], // Chemistry and Biology
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Update subjects with teacher ID
    await db.collection('Subject').updateOne(
      { _id: subjectIds[2] },
      { $set: { teacherIds: [emily.insertedId] } }
    );
    
    await db.collection('Subject').updateOne(
      { _id: subjectIds[3] },
      { $set: { teacherIds: [emily.insertedId] } }
    );
    
    // Create Emily's availability
    const emilyAvailabilities = await db.collection('Availability').insertMany([
      {
        teacherId: emily.insertedId,
        dayOfWeek: 2, // Tuesday
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T18:00:00Z'),
        recurring: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        teacherId: emily.insertedId,
        dayOfWeek: 4, // Thursday
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T18:00:00Z'),
        recurring: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Create David Miller (Computer Science teacher)
    const david = await db.collection('User').insertOne({
      firstName: 'David',
      lastName: 'Miller',
      email: 'david@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Computer Science instructor specializing in web development and algorithms',
      subjectIds: [subjectIds[4]], // Computer Science
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Update subjects with teacher ID
    await db.collection('Subject').updateOne(
      { _id: subjectIds[4] },
      { $set: { teacherIds: [david.insertedId] } }
    );
    
    // Create David's availability
    const davidAvailabilities = await db.collection('Availability').insertMany([
      {
        teacherId: david.insertedId,
        dayOfWeek: 1, // Monday
        startTime: new Date('2025-01-01T14:00:00Z'),
        endTime: new Date('2025-01-01T20:00:00Z'),
        recurring: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        teacherId: david.insertedId,
        dayOfWeek: 3, // Wednesday
        startTime: new Date('2025-01-01T14:00:00Z'),
        endTime: new Date('2025-01-01T20:00:00Z'),
        recurring: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        teacherId: david.insertedId,
        dayOfWeek: 6, // Saturday
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T16:00:00Z'),
        recurring: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Create messages between students and teachers
    console.log('Creating messages...');
    await db.collection('Message').insertMany([
      {
        senderId: studentIds[0],
        receiverId: robert.insertedId,
        content: 'Hello, I need help with calculus. Are you available for tutoring?',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        senderId: robert.insertedId,
        receiverId: studentIds[0],
        content: 'Hi John, I would be happy to help you with calculus. What specific topics are you struggling with?',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        senderId: studentIds[1],
        receiverId: david.insertedId,
        content: 'Hi David, I\'m interested in learning more about web development. Do you offer any courses on React?',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        senderId: david.insertedId,
        receiverId: studentIds[1],
        content: 'Hello Jane, yes I do offer courses on React. I can help you learn the fundamentals and advanced concepts.',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    console.log('Created messages');
    
    // Create bookings
    console.log('Creating bookings...');
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    
    const robertAvailabilityId = robertAvailabilities.insertedIds[0];
    const davidAvailabilityId = davidAvailabilities.insertedIds[0];
    
    const bookings = await db.collection('Booking').insertMany([
      {
        studentId: studentIds[0],
        teacherId: robert.insertedId,
        availabilityId: robertAvailabilityId,
        startTime: new Date(oneWeekFromNow.setHours(10, 0, 0, 0)),
        endTime: new Date(oneWeekFromNow.setHours(11, 0, 0, 0)),
        status: 'confirmed',
        paymentStatus: 'paid',
        amount: 50,
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentId: studentIds[1],
        teacherId: david.insertedId,
        availabilityId: davidAvailabilityId,
        startTime: new Date(twoWeeksFromNow.setHours(15, 0, 0, 0)),
        endTime: new Date(twoWeeksFromNow.setHours(16, 0, 0, 0)),
        status: 'confirmed',
        paymentStatus: 'paid',
        amount: 50,
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    console.log('Created bookings');
    
    // Create completed booking with review
    console.log('Creating completed booking with review...');
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const emilyAvailabilityId = emilyAvailabilities.insertedIds[0];
    
    const completedBooking = await db.collection('Booking').insertOne({
      studentId: studentIds[2],
      teacherId: emily.insertedId,
      availabilityId: emilyAvailabilityId,
      startTime: new Date(lastWeek.setHours(11, 0, 0, 0)),
      endTime: new Date(lastWeek.setHours(12, 0, 0, 0)),
      status: 'completed',
      paymentStatus: 'paid',
      amount: 50,
      currency: 'USD',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await db.collection('Review').insertOne({
      bookingId: completedBooking.insertedId,
      studentId: studentIds[2],
      teacherId: emily.insertedId,
      rating: 5,
      comment: 'Emily is an excellent teacher! She explained complex biochemistry concepts in a way that was easy to understand.',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Created completed booking with review');
    
    console.log('Seed completed successfully');
    await client.close();
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
}

seed();
