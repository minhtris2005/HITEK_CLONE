import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();

    console.log('=== CONTACT FORM SUBMISSION ===');
    console.log('Type:', type);
    console.log('Name:', data.name);
    console.log('Email:', data.email);
    console.log('Phone:', data.phone);
    console.log('Company:', data.company);
    console.log('Message:', data.message);
    console.log('===============================');

    // Trả về success response
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Form received successfully',
      logged: true
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});