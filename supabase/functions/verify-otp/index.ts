import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone, otp, role = "farmer" } = await req.json();

    if (!phone || !otp) {
      return new Response(JSON.stringify({ error: "Phone and OTP required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find valid OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from("phone_otps")
      .select("*")
      .eq("phone", phone)
      .eq("otp", otp)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (otpError || !otpRecord) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired OTP" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Mark OTP as used
    await supabase
      .from("phone_otps")
      .update({ used: true })
      .eq("id", otpRecord.id);

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.phone === phone || u.user_metadata?.phone === phone
    );

    let userId: string;

    if (existingUser) {
      // Existing user — just return a session
      userId = existingUser.id;
    } else {
      // New user — create account
      const email = `${phone.replace(/\+/g, "").replace(/\s/g, "")}@agritha.app`;
      const { data: newUser, error: createError } =
        await supabase.auth.admin.createUser({
          email,
          password: crypto.randomUUID(), // random password, never used
          user_metadata: { phone, role },
          email_confirm: true,
        });

      if (createError) throw createError;
      userId = newUser.user!.id;

      // Ensure public.users row exists with correct role
      await supabase
        .from("users")
        .upsert({ id: userId, phone, role }, { onConflict: "id" });
    }

    // Generate a session for the user
    const { data: session, error: sessionError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: `${phone.replace(/\+/g, "").replace(/\s/g, "")}@agritha.app`,
      });

    if (sessionError) throw sessionError;

    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
        action_link: session.properties?.action_link,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
