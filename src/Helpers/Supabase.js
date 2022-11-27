import { createClient } from "@supabase/supabase-js";
import { getUserLocation } from "./metadata";

export async function fetchLocation() {
  const location = await getUserLocation();
  return location;
}

function getUUID() {
  const short = require("short-uuid");
  let uuid = short.generate().substring(0, 20);
  return uuid.toUpperCase();
}
export async function logRequest(signature, request) {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const _location = await fetchLocation();
  const uuid = getUUID();
  const { data, error } = await supabase
    .from("requests")
    .insert([
      {
        destination: request.destination,
        token: request.token,
        chain: request.chain,
        amount: request.amount,
        value: request.price,
        signature: signature,
        signed_message: request.signedMessage,
        created_at: new Date(),
        location_json: _location,
        message: request.message,
        unique_uuid: uuid,
      },
    ])
    .select("*");
  if (data) {
    console.log(data[0].unique_uuid);
    return data[0].unique_uuid;
  }
}

function initSupabaseClient() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const token = process.env.REACT_APP_ANON_KEY;
  const supabase = createClient(url, token);
  return supabase;
}

export async function _getTokens(type) {
  const supabase = initSupabaseClient();
  let { data: tokens, error } = await supabase.from("tokens").select("*").eq("type", type);
  if (error) {
    return error;
  }
  return tokens;
}

export async function logEvent(code, message, address) {
  const supabase = initSupabaseClient();
  const { data, error } = await supabase.from("payment_logs").insert([{ message: message, code: code, address: address }]);
  if (error) {
    return error;
  }
  return data;
}

export async function logPayment(hash, request, _request_uuid) {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const _location = await fetchLocation();
  const _uuid = getUUID();
  const { data, error } = await supabase
    .from("payments")
    .insert([
      {
        request_uuid: _request_uuid,
        uuid: _uuid,
        location: _location,
        request: request,
        tx_hash: hash,
      },
    ])
    .select("*");
  if (data) {
    return data[0].uuid;
  }
}

export async function getRequest(uuid) {
  const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_ANON_KEY);
  let { data: requests, error } = await supabase.from("requests").select("*").eq("unique_uuid", uuid);
  return requests;
}
