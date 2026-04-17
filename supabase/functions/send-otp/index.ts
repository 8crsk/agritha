import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// SMS messages in all 3 languages
function buildMessage(otp: string, language: string): string {
  switch (language) {
    case "ta":
      return `அன்பான விவசாயி, உங்கள் Agritha உள்நுழைவு குறியீடு: ${otp}. இது 10 நிமிடங்களுக்கு செல்லுபடியாகும். - Agritha குழு`;
    case "hi":
      return `प्रिय किसान, आपका Agritha लॉगिन कोड: ${otp}. यह 10 मिनट के लिए वैध है। - Agritha टीम`;
    default:
      return `Dear Farmer, your Agritha login code is: ${otp}. Valid for 10 minutes. - Agritha Team`;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone, language = "en" } = await req.json();

    if (!phone) {
      return new Response(JSON.stringify({ error: "Phone number required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Invalidate any existing OTPs for this phone
    await supabase
      .from("phone_otps")
      .update({ used: true })
      .eq("phone", phone)
      .eq("used", false);

    // Insert new OTP
    const { error: insertError } = await supabase
      .from("phone_otps")
      .insert({ phone, otp });

    if (insertError) throw insertError;

    // Send SMS via Fast2SMS
    const message = buildMessage(otp, language);
    const fast2smsRes = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: Deno.env.get("FAST2SMS_API_KEY")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q", // quick transactional route
        message,
        language: "english", // Fast2SMS handles Unicode
        flash: 0,
        numbers: phone.replace("+91", "").replace("+", ""),
      }),
    });

    const fast2smsData = await fast2smsRes.json();

    if (!fast2smsData.return) {
      throw new Error(`Fast2SMS error: ${JSON.stringify(fast2smsData)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
