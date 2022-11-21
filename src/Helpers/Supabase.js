import { createClient } from '@supabase/supabase-js'

export async function getUsers()  {
    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_ANON_KEY);
    const {data} = await supabase.from('users').select('*')
    console.log(data)

}

export async function createUser() {
    const savedSession = window.sessionStorage("session");
    const object = JSON.parse(savedSession);
    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_ANON_KEY);
    const {data} = await supabase.from('users').insert([
        { name: 1, created_at: new Date(), userUID:object.user.id},
      ])
}


export async function createLocation(location) {
    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_ANON_KEY);
    const {data} = await supabase.from('logs_locations').insert([
        { id: 0, eventDate: new Date(), location:location},
      ])
 }