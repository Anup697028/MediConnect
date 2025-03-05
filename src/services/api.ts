
// Simulated API service to mimic backend functionality
import { toast } from "sonner";

// Types for our data structures
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor';
  profileCompleted: boolean;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  medicalHistory?: string[];
  allergies?: string[];
  medications?: string[];
  insuranceProvider?: string;
  insuranceId?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  paymentMethods?: PaymentMethod[];
}

export interface Doctor extends User {
  role: 'doctor';
  specialty?: string;
  license?: string;
  education?: string[];
  experience?: number; // Years of experience
  availability?: {
    [day: string]: { start: string; end: string }[];
  };
  rating?: number;
  consultationFee?: number;
  bio?: string;
  acceptedInsurance?: string[];
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'bank_account';
  lastFour?: string;
  cardType?: string;
  expiryDate?: string;
  isDefault: boolean;
  holder: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'refunded';
  symptoms?: string;
  notes?: string;
  followUpRequired?: boolean;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  date: string;
  duration: number; // in minutes
  notes?: string;
  diagnosis?: string;
  prescriptions?: Prescription[];
  followUp?: {
    recommended: boolean;
    date?: string;
  };
}

export interface Prescription {
  id: string;
  consultationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  issuedDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

// Simulated database
class Database {
  private storage = localStorage;
  private KEY_PREFIX = 'mediconnect_';

  constructor() {
    // Initialize DB if needed
    if (!this.storage.getItem(`${this.KEY_PREFIX}initialized`)) {
      this.initializeDatabase();
    }
  }

  private initializeDatabase() {
    // Set initial data
    this.storage.setItem(`${this.KEY_PREFIX}users`, JSON.stringify([]));
    this.storage.setItem(`${this.KEY_PREFIX}appointments`, JSON.stringify([]));
    this.storage.setItem(`${this.KEY_PREFIX}consultations`, JSON.stringify([]));
    this.storage.setItem(`${this.KEY_PREFIX}prescriptions`, JSON.stringify([]));
    this.storage.setItem(`${this.KEY_PREFIX}initialized`, 'true');

    // Add some sample doctors
    const sampleDoctors: Doctor[] = [
      {
        id: 'doc1',
        email: 'dr.smith@example.com',
        name: 'Dr. John Smith',
        role: 'doctor',
        profileCompleted: true,
        specialty: 'Cardiology',
        license: 'MED12345',
        education: ['Harvard Medical School', 'Johns Hopkins Residency'],
        experience: 15,
        availability: {
          'Monday': [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '17:00' }],
          'Wednesday': [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '17:00' }],
          'Friday': [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '15:00' }],
        },
        rating: 4.8,
        consultationFee: 150,
        bio: 'Experienced cardiologist specializing in preventive care and heart disease management.',
        acceptedInsurance: ['Blue Cross', 'Aetna', 'UnitedHealthcare']
      },
      {
        id: 'doc2',
        email: 'dr.wong@example.com',
        name: 'Dr. Emily Wong',
        role: 'doctor',
        profileCompleted: true,
        specialty: 'Pediatrics',
        license: 'MED54321',
        education: ['Stanford Medical School', 'UCLA Residency'],
        experience: 10,
        availability: {
          'Tuesday': [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }],
          'Thursday': [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }],
          'Saturday': [{ start: '10:00', end: '14:00' }],
        },
        rating: 4.9,
        consultationFee: 120,
        bio: 'Compassionate pediatrician dedicated to child wellness and developmental health.',
        acceptedInsurance: ['Blue Cross', 'Cigna', 'Kaiser']
      }
    ];
    
    this.saveItem('doctors', sampleDoctors);
  }

  getItem<T>(key: string): T | null {
    const data = this.storage.getItem(`${this.KEY_PREFIX}${key}`);
    return data ? JSON.parse(data) : null;
  }

  saveItem<T>(key: string, data: T): void {
    this.storage.setItem(`${this.KEY_PREFIX}${key}`, JSON.stringify(data));
  }

  updateItem<T>(key: string, updateFn: (data: T) => T): void {
    const current = this.getItem<T>(key);
    if (current) {
      const updated = updateFn(current);
      this.saveItem(key, updated);
    }
  }
}

// API service class
class ApiService {
  private db = new Database();
  private currentUser: User | null = null;

  constructor() {
    // Load the current user
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.currentUser = JSON.parse(userJson);
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<User> {
    // Simulate network delay
    await this.delay(800);
    
    // Get all users
    const users = this.db.getItem<User[]>('users') || [];
    
    // Find the user - in a real app we'd check password hashes
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // For demo purposes, automatically create the user if they don't exist
      const newUser: Patient = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'patient',
        profileCompleted: false,
        paymentMethods: []
      };
      
      users.push(newUser);
      this.db.saveItem('users', users);
      
      this.currentUser = newUser;
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return newUser;
    }
    
    // Set the current user
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  }
  
  async register(email: string, password: string, name: string, role: 'patient' | 'doctor'): Promise<User> {
    // Simulate network delay
    await this.delay(800);
    
    // Get all users
    const users = this.db.getItem<User[]>('users') || [];
    
    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User already exists');
    }
    
    // Create new user based on role
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role,
      profileCompleted: false
    };
    
    // Add role-specific fields
    if (role === 'patient') {
      (newUser as Patient).paymentMethods = [];
    } else if (role === 'doctor') {
      (newUser as Doctor).availability = {};
      (newUser as Doctor).acceptedInsurance = [];
    }
    
    // Save the new user
    users.push(newUser);
    this.db.saveItem('users', users);
    
    // Set as current user
    this.currentUser = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return newUser;
  }
  
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
  }
  
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  // Payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await this.delay(500);
    
    if (!this.currentUser || this.currentUser.role !== 'patient') {
      throw new Error('Unauthorized access');
    }
    
    const users = this.db.getItem<User[]>('users') || [];
    const user = users.find(u => u.id === this.currentUser?.id) as Patient;
    
    return user?.paymentMethods || [];
  }
  
  async addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    await this.delay(800);
    
    if (!this.currentUser || this.currentUser.role !== 'patient') {
      throw new Error('Unauthorized access');
    }
    
    const users = this.db.getItem<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === this.currentUser?.id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const user = users[userIndex] as Patient;
    const paymentMethods = user.paymentMethods || [];
    
    // If this is marked as default, un-default others
    if (paymentMethod.isDefault) {
      paymentMethods.forEach(pm => pm.isDefault = false);
    }
    
    // Generate a new payment method with ID
    const newPaymentMethod: PaymentMethod = {
      ...paymentMethod,
      id: `pm_${Date.now()}`
    };
    
    // Add to user's payment methods
    paymentMethods.push(newPaymentMethod);
    user.paymentMethods = paymentMethods;
    
    // Update user in DB
    users[userIndex] = user;
    this.db.saveItem('users', users);
    
    // Update current user
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    
    return newPaymentMethod;
  }
  
  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    await this.delay(500);
    
    if (!this.currentUser || this.currentUser.role !== 'patient') {
      throw new Error('Unauthorized access');
    }
    
    const users = this.db.getItem<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === this.currentUser?.id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const user = users[userIndex] as Patient;
    
    if (!user.paymentMethods) {
      return;
    }
    
    // Filter out the payment method
    user.paymentMethods = user.paymentMethods.filter(pm => pm.id !== paymentMethodId);
    
    // If we removed the default and have other payment methods, make one default
    if (user.paymentMethods.length > 0 && !user.paymentMethods.some(pm => pm.isDefault)) {
      user.paymentMethods[0].isDefault = true;
    }
    
    // Update user in DB
    users[userIndex] = user;
    this.db.saveItem('users', users);
    
    // Update current user
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  // Doctor methods
  async getDoctors(specialty?: string): Promise<Doctor[]> {
    await this.delay(700);
    
    // Get all users
    const users = this.db.getItem<User[]>('users') || [];
    const doctors = this.db.getItem<Doctor[]>('doctors') || [];
    
    // Combine doctors from users table and doctors table
    const allDoctors = [
      ...doctors,
      ...users.filter(u => u.role === 'doctor') as Doctor[]
    ];
    
    // Filter by specialty if provided
    return specialty 
      ? allDoctors.filter(doc => doc.specialty === specialty)
      : allDoctors;
  }
  
  async getDoctorById(id: string): Promise<Doctor | null> {
    await this.delay(500);
    
    const doctors = await this.getDoctors();
    return doctors.find(doc => doc.id === id) || null;
  }
  
  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    await this.delay(600);
    
    if (!this.currentUser) {
      throw new Error('Unauthorized access');
    }
    
    const appointments = this.db.getItem<Appointment[]>('appointments') || [];
    
    // Filter based on user role
    if (this.currentUser.role === 'patient') {
      return appointments.filter(app => app.patientId === this.currentUser?.id);
    } else if (this.currentUser.role === 'doctor') {
      return appointments.filter(app => app.doctorId === this.currentUser?.id);
    }
    
    return [];
  }
  
  async bookAppointment(appointment: Omit<Appointment, 'id' | 'status' | 'paymentStatus'>): Promise<Appointment> {
    await this.delay(1000);
    
    if (!this.currentUser || this.currentUser.role !== 'patient') {
      throw new Error('Unauthorized access');
    }
    
    const appointments = this.db.getItem<Appointment[]>('appointments') || [];
    
    // Create new appointment
    const newAppointment: Appointment = {
      ...appointment,
      id: `app_${Date.now()}`,
      patientId: this.currentUser.id,
      status: 'scheduled',
      paymentStatus: 'pending'
    };
    
    // Add to appointments
    appointments.push(newAppointment);
    this.db.saveItem('appointments', appointments);
    
    // Notify of successful booking
    toast.success("Appointment booked successfully");
    
    return newAppointment;
  }
  
  async completePayment(appointmentId: string, paymentMethodId: string): Promise<void> {
    await this.delay(800);
    
    if (!this.currentUser || this.currentUser.role !== 'patient') {
      throw new Error('Unauthorized access');
    }
    
    const appointments = this.db.getItem<Appointment[]>('appointments') || [];
    const appointmentIndex = appointments.findIndex(
      app => app.id === appointmentId && app.patientId === this.currentUser?.id
    );
    
    if (appointmentIndex === -1) {
      throw new Error('Appointment not found');
    }
    
    // Update payment status
    appointments[appointmentIndex].paymentStatus = 'completed';
    this.db.saveItem('appointments', appointments);
    
    toast.success("Payment completed successfully");
  }
  
  // Consultations
  async getConsultations(): Promise<Consultation[]> {
    await this.delay(600);
    
    if (!this.currentUser) {
      throw new Error('Unauthorized access');
    }
    
    const consultations = this.db.getItem<Consultation[]>('consultations') || [];
    
    // Filter based on user role
    if (this.currentUser.role === 'patient') {
      return consultations.filter(c => c.patientId === this.currentUser?.id);
    } else if (this.currentUser.role === 'doctor') {
      return consultations.filter(c => c.doctorId === this.currentUser?.id);
    }
    
    return [];
  }
  
  // Profile methods
  async updateProfile(profileData: Partial<Patient | Doctor>): Promise<User> {
    await this.delay(800);
    
    if (!this.currentUser) {
      throw new Error('Unauthorized access');
    }
    
    const users = this.db.getItem<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === this.currentUser?.id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user data
    const updatedUser = {
      ...users[userIndex],
      ...profileData,
      profileCompleted: true
    };
    
    users[userIndex] = updatedUser;
    this.db.saveItem('users', users);
    
    // Update current user
    this.currentUser = updatedUser;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  }
  
  // Helper methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export a singleton instance
export const api = new ApiService();
