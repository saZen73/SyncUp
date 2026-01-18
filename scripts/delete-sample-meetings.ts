import { prisma } from "@/lib/db";

async function deleteSampleMeetings() {
  try {
    console.log("Deleting existing sample meetings...");
    
    // First delete related transcript chunks
    const meetings = await prisma.meeting.findMany({
      where: {
        OR: [
          { calendarEventId: { startsWith: "sample_calendar_event_" } },
          { title: { contains: "Weekly Team Standup" } },
          { title: { contains: "Q4 Product Roadmap" } },
          { title: { contains: "Monthly Team Retrospective" } }
        ]
      },
      select: { id: true }
    });

    const meetingIds = meetings.map(m => m.id);
    
    if (meetingIds.length > 0) {
      // Delete transcript chunks first
      const deletedChunks = await prisma.transcriptChunk.deleteMany({
        where: {
          meetingId: { in: meetingIds }
        }
      });
      console.log(`✓ Deleted ${deletedChunks.count} transcript chunks`);

      // Then delete meetings
      const deletedMeetings = await prisma.meeting.deleteMany({
        where: {
          id: { in: meetingIds }
        }
      });
      
      console.log(`✓ Deleted ${deletedMeetings.count} sample meetings`);
      console.log("\n✅ All sample meetings deleted successfully!");
      console.log("You can now run: npx tsx scripts/create-sample-past-meetings.ts");
    } else {
      console.log("No sample meetings found to delete.");
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteSampleMeetings();
