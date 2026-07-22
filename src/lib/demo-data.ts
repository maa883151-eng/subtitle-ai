const d = (s: string) => new Date(s);

export const DEMO_USER = {
  id: "demo-user-id",
  clerkId: "demo-clerk-id",
  name: "Ahmed Al-Madani",
  email: "ahmed@subtitleai.demo",
  credits: 5,
  plan: "FREE",
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  createdAt: d("2024-01-01"),
  updatedAt: d("2026-07-01"),
};

export const DEMO_JOBS = [
  { id: "j1", userId: "demo-user-id", title: "Product Demo Video", fileName: "product_demo.mp4", fileSize: 52428800, language: "en", targetLanguage: null, status: "DONE", srtContent: "1\n00:00:01,000 --> 00:00:04,000\nWelcome to our product demo.\n\n2\n00:00:05,000 --> 00:00:09,000\nToday we'll walk through the key features.\n", vttContent: null, duration: 245, createdAt: d("2026-06-20"), updatedAt: d("2026-06-20") },
  { id: "j2", userId: "demo-user-id", title: "Interview Recording - EN to ES", fileName: "interview.mp3", fileSize: 18874368, language: "en", targetLanguage: "es", status: "DONE", srtContent: "1\n00:00:01,000 --> 00:00:05,000\nBienvenidos a nuestra entrevista.\n\n2\n00:00:06,000 --> 00:00:10,000\nHoy hablaremos sobre tecnología.\n", vttContent: null, duration: 1820, createdAt: d("2026-06-15"), updatedAt: d("2026-06-15") },
  { id: "j3", userId: "demo-user-id", title: "Podcast Episode 42", fileName: "podcast_ep42.mp3", fileSize: 36700160, language: "en", targetLanguage: null, status: "DONE", srtContent: "1\n00:00:01,000 --> 00:00:06,000\nHello and welcome back to the show.\n\n", vttContent: null, duration: 3612, createdAt: d("2026-06-01"), updatedAt: d("2026-06-01") },
  { id: "j4", userId: "demo-user-id", title: "Webinar Recording", fileName: "webinar_jul.mp4", fileSize: 104857600, language: "en", targetLanguage: "fr", status: "PROCESSING", srtContent: null, vttContent: null, duration: null, createdAt: d("2026-07-01"), updatedAt: d("2026-07-01") },
  { id: "j5", userId: "demo-user-id", title: "Tutorial Video Series", fileName: "tutorial_01.mp4", fileSize: 78643200, language: "en", targetLanguage: null, status: "DONE", srtContent: "1\n00:00:01,000 --> 00:00:04,000\nIn this tutorial we will learn Next.js.\n\n", vttContent: null, duration: 892, createdAt: d("2026-05-20"), updatedAt: d("2026-05-20") },
  { id: "j6", userId: "demo-user-id", title: "Conference Talk", fileName: "conf_talk.mp4", fileSize: 209715200, language: "en", targetLanguage: "de", status: "PENDING", srtContent: null, vttContent: null, duration: null, createdAt: d("2026-07-02"), updatedAt: d("2026-07-02") },
];

export function createDemoDb() {
  return {
    user: {
      findUnique: async () => DEMO_USER,
      create: async () => DEMO_USER,
      update: async (args: any) => ({ ...DEMO_USER, ...args?.data }),
    },
    subtitleJob: {
      findMany: async (args?: any) => {
        let result = [...DEMO_JOBS];
        if (args?.take) result = result.slice(0, args.take);
        return result;
      },
      findUnique: async (args?: any) => DEMO_JOBS.find(j => j.id === args?.where?.id) ?? DEMO_JOBS[0],
      count: async (args?: any) => {
        if (args?.where?.status) return DEMO_JOBS.filter(j => j.status === args.where.status).length;
        return DEMO_JOBS.length;
      },
      create: async (args: any) => ({ ...DEMO_JOBS[0], ...args?.data, id: "j-new", status: "PENDING" }),
      update: async (args: any) => ({ ...DEMO_JOBS[0], ...args?.data }),
      delete: async () => DEMO_JOBS[0],
    },
    $disconnect: async () => {},
    $transaction: async (fns: any[]) => Promise.all(fns.map(f => (typeof f === "function" ? f() : f))),
  };
}
