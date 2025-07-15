import cloudinary from "@/lib/cloudinary";


export async function GET() {
    try {
      const result = await cloudinary.search
        .expression('resource_type:image')
        .sort_by('created_at', 'desc')
        .max_results(50)
        .execute();

  
      return Response.json({ resources: result.resources });
    } catch (err) {
      return new Response("Error fetching images", { status: 500 });
    }
  }