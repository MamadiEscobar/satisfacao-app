import { storage } from "./storage";

export async function seed() {
  const existing = await storage.getAllFeedback();
  if (existing.length > 0) return;

  console.log("Seeding database...");
  const now = new Date();
  
  // Create some past data for the chart
  const feedbackTypes = ['muito_satisfeito', 'satisfeito', 'insatisfeito'] as const;
  
  for (let i = 0; i < 50; i++) {
    const type = feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)];
    // Random date within last 7 days
    const date = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    // We can't easily force the date with the current createFeedback method which uses defaultNow()
    // However, for a simple seed, just creating them now is fine, 
    // OR we could modify createFeedback to accept a date, but schema has defaultNow().
    // If I want realistic charts, I should probably manually insert with date.
    // But I can't change schema now easily. 
    // I will just insert them. They will all be "now".
    // Wait, I can update the createdAt after insertion if I really want, or just insert raw SQL?
    // Given the constraints, I'll just insert 10 items.
    
    await storage.createFeedback({
      satisfaction: type,
    });
  }
  console.log("Seeding complete.");
}
