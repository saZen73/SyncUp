import { prisma } from "@/lib/db";

async function listMeetings() {
  try {
    const meetings = await prisma.meeting.findMany({
      select: {
        id: true,
        title: true,
        calendarEventId: true,
        startTime: true,
        endTime: true
      }
    });

    console.log(`Found ${meetings.length} meetings:\n`);
    meetings.forEach((m, i) => {
      console.log(`${i + 1}. ${m.title}`);
      console.log(`   ID: ${m.id}`);
      console.log(`   Calendar Event: ${m.calendarEventId}`);
      console.log(`   Time: ${m.startTime} - ${m.endTime}\n`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

listMeetings();
