import { prisma } from "@/lib/db";

async function recreateSampleMeetings() {
  try {
    console.log("Deleting existing sample meetings...");
    
    // Delete existing sample meetings (those with sample_calendar_event ids)
    const deletedMeetings = await prisma.meeting.deleteMany({
      where: {
        OR: [
          { calendarEventId: { startsWith: "sample_calendar_event_" } },
          { title: { contains: "Weekly Team Standup" } },
          { title: { contains: "Q4 Product Roadmap" } },
          { title: { contains: "Monthly Team Retrospective" } }
        ]
      }
    });
    
    console.log(`✓ Deleted ${deletedMeetings.count} existing sample meetings`);
    
    // Now run the create script
    console.log("\nCreating new sample meetings...");
    
    // Import and run the create script
    const createScript = await import('./create-sample-past-meetings');
    
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

recreateSampleMeetings()
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
