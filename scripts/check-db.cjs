const { MongoClient } = require('mongodb');

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    
    const db = client.db('academ');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\nCollections:');
    for (const collection of collections) {
      console.log(`- ${collection.name}`);
    }
    
    // Get users
    const users = await db.collection('User').find().toArray();
    console.log('\nUsers:');
    users.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
      if (user.subjectIds && user.subjectIds.length > 0) {
        console.log(`  SubjectIds: ${user.subjectIds.join(', ')}`);
      }
    });
    
    // Get subjects
    const subjects = await db.collection('Subject').find().toArray();
    console.log('\nSubjects:');
    subjects.forEach(subject => {
      console.log(`- ${subject.name}: ${subject.description}`);
      if (subject.teacherIds && subject.teacherIds.length > 0) {
        console.log(`  TeacherIds: ${subject.teacherIds.join(', ')}`);
      }
    });
    
    // Get availabilities
    const availabilities = await db.collection('Availability').find().toArray();
    console.log('\nAvailabilities:');
    availabilities.forEach(avail => {
      const day = avail.dayOfWeek !== null ? ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][avail.dayOfWeek] : 'Non récurrent';
      const startTime = new Date(avail.startTime).toLocaleTimeString();
      const endTime = new Date(avail.endTime).toLocaleTimeString();
      console.log(`- TeacherId: ${avail.teacherId} - Day: ${day} - Time: ${startTime} - ${endTime}`);
    });
    
    await client.close();
    console.log('\nDatabase check completed.');
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

main().catch(console.error);