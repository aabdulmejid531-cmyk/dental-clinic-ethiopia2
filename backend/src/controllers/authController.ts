import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../services/supabaseService';

export const authController = {
  async register(userData: any) {
    const { email, password, fullName, phone, role = 'patient' } = userData;

    if (!email || !password || !fullName) {
      throw new Error('Missing required fields');
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          phone
        }
      }
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          phone,
          role
        });

      if (profileError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error('Failed to create user profile');
      }

      const token = jwt.sign(
        { userId: authData.user.id, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return {
        message: 'User registered successfully',
        token,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          fullName,
          role
        }
      };
    }

    throw new Error('Registration failed');
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error('Invalid credentials');
    }

    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Failed to fetch user profile');
      }

      const token = jwt.sign(
        { userId: data.user.id, role: profile.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return {
        message: 'Login successful',
        token,
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: profile.full_name,
          role: profile.role,
          phone: profile.phone
        }
      };
    }

    throw new Error('Login failed');
  },

  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error('Failed to logout');
    }

    return { message: 'Logout successful' };
  },

  async getCurrentUser(userId: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      throw new Error('User not found');
    }

    return profile;
  }
};
