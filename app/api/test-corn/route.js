export async function GET() {
    console.log("✅ Cron job triggered at", new Date().toISOString());
  
    return new Response(
      JSON.stringify({
        success: true,
        message: "Cron job works!",
        time: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  