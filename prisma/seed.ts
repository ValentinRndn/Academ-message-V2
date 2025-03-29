import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

async function main() {
  console.log('Starting seed...')

  // Create subjects
  console.log('Creating subjects...')
  const subjects = await Promise.all([
    prisma.subject.create({
      data: {
        name: 'Mathematics',
        description: 'Algebra, Calculus, Geometry, and more',
        teacherIds: []
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Physics',
        description: 'Classical Mechanics, Electromagnetism, Quantum Physics',
        teacherIds: []
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Chemistry',
        description: 'Organic Chemistry, Inorganic Chemistry, Biochemistry',
        teacherIds: []
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Biology',
        description: 'Molecular Biology, Genetics, Ecology',
        teacherIds: []
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Computer Science',
        description: 'Programming, Algorithms, Data Structures',
        teacherIds: []
      }
    }),
    prisma.subject.create({
      data: {
        name: 'English',
        description: 'Grammar, Literature, Writing',
        teacherIds: []
      }
    }),
    prisma.subject.create({
      data: {
        name: 'History',
        description: 'World History, European History, American History',
        teacherIds: []
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Foreign Languages',
        description: 'French, Spanish, German, Chinese, Japanese',
        teacherIds: []
      }
    })
  ])

  console.log('Created subjects')

  // Create admin user
  console.log('Creating admin user...')
  const adminPassword = await hash('admin123', SALT_ROUNDS)
  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@academ.com',
      password: adminPassword,
      role: 'admin',
      subjectIds: []
    }
  })

  console.log('Created admin user')

  // Create student users
  console.log('Creating student users...')
  const studentPassword = await hash('student123', SALT_ROUNDS)
  const students = await Promise.all([
    prisma.user.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: studentPassword,
        role: 'student',
        bio: 'High school student interested in STEM subjects',
        subjectIds: []
      }
    }),
    prisma.user.create({
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: studentPassword,
        role: 'student',
        bio: 'College student majoring in Computer Science',
        subjectIds: []
      }
    }),
    prisma.user.create({
      data: {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael@example.com',
        password: studentPassword,
        role: 'student',
        bio: 'Graduate student in Physics',
        subjectIds: []
      }
    })
  ])

  console.log('Created student users')

  // Create teacher users
  console.log('Creating teacher users...')
  const teacherPassword = await hash('teacher123', SALT_ROUNDS)
  
  // Create Robert Williams (Mathematics and Physics teacher)
  const robert = await prisma.user.create({
    data: {
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'robert@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Mathematics professor with 10 years of experience',
      subjectIds: [subjects[0].id, subjects[1].id] // Mathematics and Physics
    }
  })
  
  // Update subjects with teacher ID
  await prisma.subject.update({
    where: { id: subjects[0].id },
    data: { teacherIds: [robert.id] }
  })
  
  await prisma.subject.update({
    where: { id: subjects[1].id },
    data: { teacherIds: [robert.id] }
  })
  
  // Create Robert's availability
  await Promise.all([
    prisma.availability.create({
      data: {
        teacherId: robert.id,
        dayOfWeek: 1, // Monday
        startTime: new Date('2025-01-01T09:00:00Z'),
        endTime: new Date('2025-01-01T17:00:00Z'),
        recurring: true
      }
    }),
    prisma.availability.create({
      data: {
        teacherId: robert.id,
        dayOfWeek: 3, // Wednesday
        startTime: new Date('2025-01-01T09:00:00Z'),
        endTime: new Date('2025-01-01T17:00:00Z'),
        recurring: true
      }
    }),
    prisma.availability.create({
      data: {
        teacherId: robert.id,
        dayOfWeek: 5, // Friday
        startTime: new Date('2025-01-01T09:00:00Z'),
        endTime: new Date('2025-01-01T17:00:00Z'),
        recurring: true
      }
    })
  ])
  
  // Create Emily Brown (Biology and Chemistry teacher)
  const emily = await prisma.user.create({
    data: {
      firstName: 'Emily',
      lastName: 'Brown',
      email: 'emily@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Biology and Chemistry teacher with a PhD in Biochemistry',
      subjectIds: [subjects[2].id, subjects[3].id] // Chemistry and Biology
    }
  })
  
  // Update subjects with teacher ID
  await prisma.subject.update({
    where: { id: subjects[2].id },
    data: { teacherIds: [emily.id] }
  })
  
  await prisma.subject.update({
    where: { id: subjects[3].id },
    data: { teacherIds: [emily.id] }
  })
  
  // Create Emily's availability
  await Promise.all([
    prisma.availability.create({
      data: {
        teacherId: emily.id,
        dayOfWeek: 2, // Tuesday
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T18:00:00Z'),
        recurring: true
      }
    }),
    prisma.availability.create({
      data: {
        teacherId: emily.id,
        dayOfWeek: 4, // Thursday
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T18:00:00Z'),
        recurring: true
      }
    })
  ])
  
  // Create David Miller (Computer Science teacher)
  const david = await prisma.user.create({
    data: {
      firstName: 'David',
      lastName: 'Miller',
      email: 'david@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Computer Science instructor specializing in web development and algorithms',
      subjectIds: [subjects[4].id] // Computer Science
    }
  })
  
  // Update subjects with teacher ID
  await prisma.subject.update({
    where: { id: subjects[4].id },
    data: { teacherIds: [david.id] }
  })
  
  // Create David's availability
  await Promise.all([
    prisma.availability.create({
      data: {
        teacherId: david.id,
        dayOfWeek: 1, // Monday
        startTime: new Date('2025-01-01T14:00:00Z'),
        endTime: new Date('2025-01-01T20:00:00Z'),
        recurring: true
      }
    }),
    prisma.availability.create({
      data: {
        teacherId: david.id,
        dayOfWeek: 3, // Wednesday
        startTime: new Date('2025-01-01T14:00:00Z'),
        endTime: new Date('2025-01-01T20:00:00Z'),
        recurring: true
      }
    }),
    prisma.availability.create({
      data: {
        teacherId: david.id,
        dayOfWeek: 6, // Saturday
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T16:00:00Z'),
        recurring: true
      }
    })
  ])
  
  // Create Sarah Wilson (English and History teacher)
  const sarah = await prisma.user.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'English and History teacher with a passion for literature',
      subjectIds: [subjects[5].id, subjects[6].id] // English and History
    }
  })
  
  // Update subjects with teacher ID
  await prisma.subject.update({
    where: { id: subjects[5].id },
    data: { teacherIds: [sarah.id] }
  })
  
  await prisma.subject.update({
    where: { id: subjects[6].id },
    data: { teacherIds: [sarah.id] }
  })
  
  // Create Sarah's availability
  await Promise.all([
    prisma.availability.create({
      data: {
        teacherId: sarah.id,
        dayOfWeek: 2, // Tuesday
        startTime: new Date('2025-01-01T09:00:00Z'),
        endTime: new Date('2025-01-01T15:00:00Z'),
        recurring: true
      }
    }),
    prisma.availability.create({
      data: {
        teacherId: sarah.id,
        dayOfWeek: 4, // Thursday
        startTime: new Date('2025-01-01T09:00:00Z'),
        endTime: new Date('2025-01-01T15:00:00Z'),
        recurring: true
      }
    }),
    prisma.availability.create({
      data: {
        teacherId: sarah.id,
        dayOfWeek: 0, // Sunday
        startTime: new Date('2025-01-01T12:00:00Z'),
        endTime: new Date('2025-01-01T18:00:00Z'),
        recurring: true
      }
    })
  ])
  
  // Create James Taylor (Foreign Languages teacher)
  const james = await prisma.user.create({
    data: {
      firstName: 'James',
      lastName: 'Taylor',
      email: 'james@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Foreign language instructor fluent in French, Spanish, and German',
      subjectIds: [subjects[7].id] // Foreign Languages
    }
  })
  
  // Update subjects with teacher ID
  await prisma.subject.update({
    where: { id: subjects[7].id },
    data: { teacherIds: [james.id] }
  })
  
  // Create James's availability
  await Promise.all([
    prisma.availability.create({
      data: {
        teacherId: james.id,
        dayOfWeek: 1, // Monday
        startTime: new Date('2025-01-01T16:00:00Z'),
        endTime: new Date('2025-01-01T20:00:00Z'),
        recurring: true
      }
    }),
    prisma.availability.create({
      data: {
        teacherId: james.id,
        dayOfWeek: 3, // Wednesday
        startTime: new Date('2025-01-01T16:00:00Z'),
        endTime: new Date('2025-01-01T20:00:00Z'),
        recurring: true
      }
    }),
    prisma.availability.create({
      data: {
        teacherId: james.id,
        dayOfWeek: 5, // Friday
        startTime: new Date('2025-01-01T16:00:00Z'),
        endTime: new Date('2025-01-01T20:00:00Z'),
        recurring: true
      }
    })
  ])

  const teachers = [robert, emily, david, sarah, james]
  console.log('Created teacher users')

  // Create some messages between students and teachers
  console.log('Creating messages...')
  await Promise.all([
    prisma.message.create({
      data: {
        senderId: students[0].id,
        receiverId: teachers[0].id,
        content: 'Hello, I need help with calculus. Are you available for tutoring?'
      }
    }),
    prisma.message.create({
      data: {
        senderId: teachers[0].id,
        receiverId: students[0].id,
        content: 'Hi John, I would be happy to help you with calculus. What specific topics are you struggling with?'
      }
    }),
    prisma.message.create({
      data: {
        senderId: students[1].id,
        receiverId: teachers[2].id,
        content: 'Hi David, I\'m interested in learning more about web development. Do you offer any courses on React?'
      }
    }),
    prisma.message.create({
      data: {
        senderId: teachers[2].id,
        receiverId: students[1].id,
        content: 'Hello Jane, yes I do offer courses on React. I can help you learn the fundamentals and advanced concepts.'
      }
    })
  ])

  console.log('Created messages')

  // Create some bookings
  console.log('Creating bookings...')
  const oneWeekFromNow = new Date()
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
  
  const twoWeeksFromNow = new Date()
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)

  const robertAvailability = await prisma.availability.findFirst({
    where: { teacherId: robert.id }
  })

  const davidAvailability = await prisma.availability.findFirst({
    where: { teacherId: david.id }
  })

  if (robertAvailability && davidAvailability) {
    await Promise.all([
      prisma.booking.create({
        data: {
          studentId: students[0].id,
          teacherId: robert.id,
          availabilityId: robertAvailability.id,
          startTime: new Date(oneWeekFromNow.setHours(10, 0, 0, 0)),
          endTime: new Date(oneWeekFromNow.setHours(11, 0, 0, 0)),
          status: 'confirmed',
          paymentStatus: 'paid',
          amount: 50,
          currency: 'USD'
        }
      }),
      prisma.booking.create({
        data: {
          studentId: students[1].id,
          teacherId: david.id,
          availabilityId: davidAvailability.id,
          startTime: new Date(twoWeeksFromNow.setHours(15, 0, 0, 0)),
          endTime: new Date(twoWeeksFromNow.setHours(16, 0, 0, 0)),
          status: 'confirmed',
          paymentStatus: 'paid',
          amount: 50,
          currency: 'USD'
        }
      })
    ])
  }

  console.log('Created bookings')

  // Create some completed bookings with reviews
  console.log('Creating completed booking with review...')
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)

  const emilyAvailability = await prisma.availability.findFirst({
    where: { teacherId: emily.id }
  })

  if (emilyAvailability) {
    const completedBooking = await prisma.booking.create({
      data: {
        studentId: students[2].id,
        teacherId: emily.id,
        availabilityId: emilyAvailability.id,
        startTime: new Date(lastWeek.setHours(11, 0, 0, 0)),
        endTime: new Date(lastWeek.setHours(12, 0, 0, 0)),
        status: 'completed',
        paymentStatus: 'paid',
        amount: 50,
        currency: 'USD'
      }
    })

    await prisma.review.create({
      data: {
        bookingId: completedBooking.id,
        studentId: students[2].id,
        teacherId: emily.id,
        rating: 5,
        comment: 'Emily is an excellent teacher! She explained complex biochemistry concepts in a way that was easy to understand.'
      }
    })
  }

  console.log('Created completed booking with review')

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
