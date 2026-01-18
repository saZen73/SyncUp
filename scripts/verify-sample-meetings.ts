import { prisma } from '../lib/db';

async function verifySampleMeetings() {
  try {
    const meetings = await prisma.meeting.findMany({
      include: {
        _count: {
          select: { TranscriptChunk: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    console.log('\n📊 Sample Meetings in Database:\n');
    console.log(`Total meetings found: ${meetings.length}\n`);
    
    meetings.forEach((m, i) => {
      console.log(`${i + 1}. ${m.title}`);
      console.log(`   📅 Date: ${m.startTime.toLocaleDateString()} ${m.startTime.toLocaleTimeString()}`);
      console.log(`   📝 Summary: ${m.summary ? '✅ Yes' : '❌ No'}`);
      console.log(`   ✅ Action Items: ${m.actionItems ? '✅ Yes' : '❌ No'}`);
      console.log(`   🧩 RAG Chunks: ${m._count.TranscriptChunk} chunks`);
      console.log(`   🤖 RAG Processed: ${m.ragProcessed ? '✅ Yes' : '❌ No'}`);
      console.log(`   🎵 Recording: ${m.recordingUrl ? '✅ Yes' : '❌ No'}`);
      console.log(`   📄 Transcript Ready: ${m.transcriptReady ? '✅ Yes' : '❌ No'}\n`);
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verifySampleMeetings();
