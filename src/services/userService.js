
import { supabase } from '@/lib/customSupabaseClient';

export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const createUser = async (userData) => {
  try {
    // Note: This creates a record in public.users. 
    // To create an actual auth user that can login, you would typically use supabase.auth.admin.createUser
    // or rely on a trigger after public.users insertion if you have a custom setup.
    // Based on instructions, we are inserting into public.users.
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        active: userData.status !== false // default true
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const deleteUserCascade = async (userId) => {
  try {
    // Manually delete related records to ensure cleanup if cascading FKs aren't set up
    // Ideally this should be done via database constraints (ON DELETE CASCADE)
    
    // 1. Delete notifications
    await supabase.from('notifications').delete().eq('user_id', userId);
    
    // 2. Delete appointments
    await supabase.from('appointments').delete().eq('user_id', userId);
    
    // 3. Delete availabilities (if any)
    await supabase.from('availabilities').delete().eq('user_id', userId);

    // 4. Finally delete user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const toggleUserStatus = async (userId, currentStatus) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ active: !currentStatus })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const deleteUser = deleteUserCascade;
