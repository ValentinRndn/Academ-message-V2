import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

async function main() {
  console.log('Starting seed...')

  // Create subjects
  console.log('Creating subjects...')
  const mathSubject = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      description: 'Algebra, Calculus, Geometry, and more'
    }
  })
  
  const physicsSubject = await prisma.subject.create({
    data: {
      name: 'Physics',
      description: 'Classical Mechanics, Electromagnetism, Quantum Physics'
    }
  })
  
  const chemistrySubject = await prisma.subject.create({
    data: {
      name: 'Chemistry',
      description: 'Organic Chemistry, Inorganic Chemistry, Biochemistry'
    }
  })
  
  const biologySubject = await prisma.subject.create({
    data: {
      name: 'Biology',
      description: 'Molecular Biology, Genetics, Ecology'
    }
  })
  
  const csSubject = await prisma.subject.create({
    data: {
      name: 'Computer Science',
      description: 'Programming, Algorithms, Data Structures'
    }
  })
  
  const englishSubject = await prisma.subject.create({
    data: {
      name: 'English',
      description: 'Grammar, Literature, Writing'
    }
  })
  
  const historySubject = await prisma.subject.create({
    data: {
      name: 'History',
      description: 'World History, European History, American History'
    }
  })
  
  const languagesSubject = await prisma.subject.create({
    data: {
      name: 'Foreign Languages',
      description: 'French, Spanish, German, Chinese, Japanese'
    }
  })

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
      role: 'admin'
    }
  })

  console.log('Created admin user')

  // Create student users
  console.log('Creating student users...')
  const studentPassword = await hash('student123', SALT_ROUNDS)
  const john = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: studentPassword,
      role: 'student',
      bio: 'High school student interested in STEM subjects'
    }
  })
  
  const jane = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: studentPassword,
      role: 'student',
      bio: 'College student majoring in Computer Science'
    }
  })
  
  const michael = await prisma.user.create({
    data: {
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael@example.com',
      password: studentPassword,
      role: 'student',
      bio: 'Graduate student in Physics'
    }
  })

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
      subjects: {
        connect: [
          { id: mathSubject.id },
          { id: physicsSubject.id }
        ]
      }
    }
  })
  
  // Create Robert's availability
  const robertAvail1 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: robert.id } },
      dayOfWeek: 1, // Monday
      startTime: new Date('2025-01-01T09:00:00Z'),
      endTime: new Date('2025-01-01T17:00:00Z'),
      recurring: true
    }
  })
  
  const robertAvail2 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: robert.id } },
      dayOfWeek: 3, // Wednesday
      startTime: new Date('2025-01-01T09:00:00Z'),
      endTime: new Date('2025-01-01T17:00:00Z'),
      recurring: true
    }
  })
  
  const robertAvail3 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: robert.id } },
      dayOfWeek: 5, // Friday
      startTime: new Date('2025-01-01T09:00:00Z'),
      endTime: new Date('2025-01-01T17:00:00Z'),
      recurring: true
    }
  })
  
  // Create Emily Brown (Biology and Chemistry teacher)
  const emily = await prisma.user.create({
    data: {
      firstName: 'Emily',
      lastName: 'Brown',
      email: 'emily@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Biology and Chemistry teacher with a PhD in Biochemistry',
      subjects: {
        connect: [
          { id: chemistrySubject.id },
          { id: biologySubject.id }
        ]
      }
    }
  })
  
  // Create Emily's availability
  const emilyAvail1 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: emily.id } },
      dayOfWeek: 2, // Tuesday
      startTime: new Date('2025-01-01T10:00:00Z'),
      endTime: new Date('2025-01-01T18:00:00Z'),
      recurring: true
    }
  })
  
  const emilyAvail2 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: emily.id } },
      dayOfWeek: 4, // Thursday
      startTime: new Date('2025-01-01T10:00:00Z'),
      endTime: new Date('2025-01-01T18:00:00Z'),
      recurring: true
    }
  })
  
  // Create David Miller (Computer Science teacher)
  const david = await prisma.user.create({
    data: {
      firstName: 'David',
      lastName: 'Miller',
      email: 'david@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Computer Science instructor specializing in web development and algorithms',
      subjects: {
        connect: [
          { id: csSubject.id }
        ]
      }
    }
  })
  
  // Create David's availability
  const davidAvail1 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: david.id } },
      dayOfWeek: 1, // Monday
      startTime: new Date('2025-01-01T14:00:00Z'),
      endTime: new Date('2025-01-01T20:00:00Z'),
      recurring: true
    }
  })
  
  const davidAvail2 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: david.id } },
      dayOfWeek: 3, // Wednesday
      startTime: new Date('2025-01-01T14:00:00Z'),
      endTime: new Date('2025-01-01T20:00:00Z'),
      recurring: true
    }
  })
  
  const davidAvail3 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: david.id } },
      dayOfWeek: 6, // Saturday
      startTime: new Date('2025-01-01T10:00:00Z'),
      endTime: new Date('2025-01-01T16:00:00Z'),
      recurring: true
    }
  })
  
  // Create Sarah Wilson (English and History teacher)
  const sarah = await prisma.user.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'English and History teacher with a passion for literature',
      subjects: {
        connect: [
          { id: englishSubject.id },
          { id: historySubject.id }
        ]
      }
    }
  })
  
  // Create Sarah's availability
  const sarahAvail1 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: sarah.id } },
      dayOfWeek: 2, // Tuesday
      startTime: new Date('2025-01-01T09:00:00Z'),
      endTime: new Date('2025-01-01T15:00:00Z'),
      recurring: true
    }
  })
  
  const sarahAvail2 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: sarah.id } },
      dayOfWeek: 4, // Thursday
      startTime: new Date('2025-01-01T09:00:00Z'),
      endTime: new Date('2025-01-01T15:00:00Z'),
      recurring: true
    }
  })
  
  const sarahAvail3 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: sarah.id } },
      dayOfWeek: 0, // Sunday
      startTime: new Date('2025-01-01T12:00:00Z'),
      endTime: new Date('2025-01-01T18:00:00Z'),
      recurring: true
    }
  })
  
  // Create James Taylor (Foreign Languages teacher)
  const james = await prisma.user.create({
    data: {
      firstName: 'James',
      lastName: 'Taylor',
      email: 'james@example.com',
      password: teacherPassword,
      role: 'teacher',
      bio: 'Foreign language instructor fluent in French, Spanish, and German',
      subjects: {
        connect: [
          { id: languagesSubject.id }
        ]
      }
    }
  })
  
  // Create James's availability
  const jamesAvail1 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: james.id } },
      dayOfWeek: 1, // Monday
      startTime: new Date('2025-01-01T16:00:00Z'),
      endTime: new Date('2025-01-01T20:00:00Z'),
      recurring: true
    }
  })
  
  const jamesAvail2 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: james.id } },
      dayOfWeek: 3, // Wednesday
      startTime: new Date('2025-01-01T16:00:00Z'),
      endTime: new Date('2025-01-01T20:00:00Z'),
      recurring: true
    }
  })
  
  const jamesAvail3 = await prisma.availability.create({
    data: {
      teacher: { connect: { id: james.id } },
      dayOfWeek: 5, // Friday
      startTime: new Date('2025-01-01T16:00:00Z'),
      endTime: new Date('2025-01-01T20:00:00Z'),
      recurring: true
    }
  })

  console.log('Created teacher users')

  // Create some messages between students and teachers
  console.log('Creating messages...')
  const message1 = await prisma.message.create({
    data: {
      sender: { connect: { id: john.id } },
      receiver: { connect: { id: robert.id } },
      content: 'Hello, I need help with calculus. Are you available for tutoring?'
    }
  })
  
  const message2 = await prisma.message.create({
    data: {
      sender: { connect: { id: robert.id } },
      receiver: { connect: { id: john.id } },
      content: 'Hi John, I would be happy to help you with calculus. What specific topics are you struggling with?'
    }
  })
  
  const message3 = await prisma.message.create({
    data: {
      sender: { connect: { id: jane.id } },
      receiver: { connect: { id: david.id } },
      content: 'Hi David, I\'m interested in learning more about web development. Do you offer any courses on React?'
    }
  })
  
  const message4 = await prisma.message.create({
    data: {
      sender: { connect: { id: david.id } },
      receiver: { connect: { id: jane.id } },
      content: 'Hello Jane, yes I do offer courses on React. I can help you learn the fundamentals and advanced concepts.'
    }
  })

  console.log('Created messages')

  // Create some bookings
  console.log('Creating bookings...')
  const oneWeekFromNow = new Date()
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
  
  const twoWeeksFromNow = new Date()
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)

  const booking1 = await prisma.booking.create({
    data: {
      student: { connect: { id: john.id } },
      teacher: { connect: { id: robert.id } },
      availability: { connect: { id: robertAvail1.id } },
      startTime: new Date(oneWeekFromNow.setHours(10, 0, 0, 0)),
      endTime: new Date(oneWeekFromNow.setHours(11, 0, 0, 0)),
      status: 'confirmed',
      paymentStatus: 'paid',
      amount: 50,
      currency: 'USD'
    }
  })
  
  const booking2 = await prisma.booking.create({
    data: {
      student: { connect: { id: jane.id } },
      teacher: { connect: { id: david.id } },
      availability: { connect: { id: davidAvail1.id } },
      startTime: new Date(twoWeeksFromNow.setHours(15, 0, 0, 0)),
      endTime: new Date(twoWeeksFromNow.setHours(16, 0, 0, 0)),
      status: 'confirmed',
      paymentStatus: 'paid',
      amount: 50,
      currency: 'USD'
    }
  })

  console.log('Created bookings')

  // Create some completed bookings with reviews
  console.log('Creating completed booking with review...')
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)

  const completedBooking = await prisma.booking.create({
    data: {
      student: { connect: { id: michael.id } },
      teacher: { connect: { id: emily.id } },
      availability: { connect: { id: emilyAvail1.id } },
      startTime: new Date(lastWeek.setHours(11, 0, 0, 0)),
      endTime: new Date(lastWeek.setHours(12, 0, 0, 0)),
      status: 'completed',
      paymentStatus: 'paid',
      amount: 50,
      currency: 'USD'
    }
  })

  const review = await prisma.review.create({
    data: {
      booking: { connect: { id: completedBooking.id } },
      student: { connect: { id: michael.id } },
      teacher: { connect: { id: emily.id } },
      rating: 5,
      comment: 'Emily is an excellent teacher! She explained complex biochemistry concepts in a way that was easy to understand.'
    }
  })

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