// Simulated API service to mimic backend functionality
import { toast } from "sonner";
import { format } from 'date-fns';

// Types for our data structures
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor';
  profileCompleted: boolean;
  biometricsEnabled?: boolean;
  phoneNumber?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
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
  imcRegistrationNumber?: string;
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

// OTP data structure
interface OtpRecord {
  email?: string;
  phone?: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  lastSent: Date;
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
    this.storage.setItem(`${this.KEY_PREFIX}otps`, JSON.stringify([]));

    // Add some sample users
    const sampleUsers: (Doctor | Patient)[] = [
      {
        id: 'doc1',
        email: 'dr.sharma@example.com',
        name: 'Dr. Vikram Sharma',
        role: 'doctor',
        profileCompleted: true,
        specialty: 'Cardiology',
        license: 'MED12345',
        imcRegistrationNumber: 'IMC78901234',
        education: ['AIIMS Delhi', 'Post Graduate Institute of Medical Education and Research'],
        experience: 15,
        availability: {
          'Monday': [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '17:00' }],
          'Wednesday': [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '17:00' }],
          'Friday': [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '15:00' }],
        },
        rating: 4.8,
        consultationFee: 1500,
        bio: 'Experienced cardiologist specializing in preventive care and heart disease management.',
        acceptedInsurance: ['Star Health', 'Aditya Birla Health Insurance', 'HDFC ERGO Health']
      },
      {
        id: 'doc2',
        email: 'dr.patel@example.com',
        name: 'Dr. Ananya Patel',
        role: 'doctor',
        profileCompleted: true,
        specialty: 'Pediatrics',
        license: 'MED54321',
        imcRegistrationNumber: 'IMC56789012',
        education: ['KEM Hospital Mumbai', 'Christian Medical College Vellore'],
        experience: 10,
        availability: {
          'Tuesday': [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }],
          'Thursday': [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }],
          'Saturday': [{ start: '10:00', end: '14:00' }],
        },
        rating: 4.9,
        consultationFee: 1200,
        bio: 'Compassionate pediatrician dedicated to child wellness and developmental health.',
        acceptedInsurance: ['Star Health', 'Bajaj Allianz', 'National Insurance']
      },
      {
        id: 'patient1',
        email: 'rahul.verma@example.com',
        name: 'Rahul Verma',
        role: 'patient',
        profileCompleted: true,
        emailVerified: true,
        dateOfBirth: '1990-05-15',
        medicalHistory: ['Asthma', 'Seasonal Allergies'],
        allergies: ['Penicillin'],
        medications: ['Albuterol inhaler'],
        insuranceProvider: 'Star Health',
        insuranceId: 'SH123456789',
        paymentMethods: []
      },
      {
        id: 'patient2',
        email: 'priya.gupta@example.com',
        name: 'Priya Gupta',
        role: 'patient',
        profileCompleted: true,
        emailVerified: true,
        dateOfBirth: '1985-08-22',
        medicalHistory: ['Hypertension'],
        medications: ['Lisinopril'],
        insuranceProvider: 'Aditya Birla Health Insurance',
        insuranceId: 'AB987654321',
        paymentMethods: []
      }
    ];
    
    this.saveItem('users', sampleUsers);
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
  private otps: Map<string, OtpRecord> = new Map();

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
      throw new Error("User not found. Please register an account first.");
    }
    
    // Set the current user
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  }
  
  async loginWithOtp(email: string, password: string, otp: string): Promise<User> {
    // Simulate network delay
    await this.delay(800);
    
    // Verify OTP
    const isValid = await this.verifyOtp(email, otp);
    if (!isValid) {
      throw new Error("Invalid or expired OTP. Please try again.");
    }
    
    // Get all users
    const users = this.db.getItem<User[]>('users') || [];
    
    // Find the user - in a real app we'd check password hashes
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error("User not found. Please register an account first.");
    }
    
    // Set the current user
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    
    // If this is the first time login with OTP, mark email as verified
    if (!user.emailVerified) {
      user.emailVerified = true;
      
      // Update user in DB
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex] = user;
      this.db.saveItem('users', users);
    }
    
    return user;
  }
  
  async loginWithBiometric(): Promise<User> {
    // Simulate network delay
    await this.delay(800);
    
    // Simulate biometric authentication
    const storedUser = localStorage.getItem('biometricUser');
    if (!storedUser) {
      throw new Error("No biometric data available. Please login with your credentials first.");
    }
    
    const user = JSON.parse(storedUser);
    
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
  
  async registerWithOtp(
    email: string, 
    password: string, 
    name: string, 
    role: 'patient' | 'doctor', 
    otp: string,
    phone?: string,
    verifyMethod: 'email' | 'phone' = 'email',
    imcRegistrationNumber?: string
  ): Promise<User> {
    // Simulate network delay
    await this.delay(800);
    
    // Verify OTP
    const identifier = verifyMethod === 'email' ? email : phone;
    if (!identifier) {
      throw new Error(`${verifyMethod} is required`);
    }
    
    // Require IMC registration number for doctors
    if (role === 'doctor' && !imcRegistrationNumber) {
      throw new Error("IMC Registration Number is required for healthcare providers");
    }
    
    const isValid = await this.verifyOtp(identifier, otp);
    if (!isValid) {
      throw new Error("Invalid or expired OTP. Please try again.");
    }
    
    // Get all users
    const users = this.db.getItem<User[]>('users') || [];
    
    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("User already exists");
    }
    
    // Create new user based on role
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role,
      profileCompleted: false,
      phoneNumber: phone,
      emailVerified: verifyMethod === 'email',
      phoneVerified: verifyMethod === 'phone'
    };
    
    // Add role-specific fields
    if (role === 'patient') {
      (newUser as Patient).paymentMethods = [];
    } else if (role === 'doctor') {
      (newUser as Doctor).availability = {};
      (newUser as Doctor).acceptedInsurance = [];
      (newUser as Doctor).imcRegistrationNumber = imcRegistrationNumber;
    }
    
    // Save the new user
    users.push(newUser);
    this.db.saveItem('users', users);
    
    return newUser;
  }
  
  async sendOtp(identifier: string, method: 'email' | 'phone' = 'email'): Promise<void> {
    // Simulate network delay
    await this.delay(800);
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    // Check if we already have an OTP for this identifier
    const existingOtp = this.otps.get(identifier);
    if (existingOtp) {
      // Check if we need to enforce cooldown
      const now = new Date();
      const timeSinceLastSent = now.getTime() - existingOtp.lastSent.getTime();
      if (timeSinceLastSent < 60000) { // 1 minute cooldown
        throw new Error("Please wait before requesting another OTP");
      }
      
      // Update the existing OTP
      this.otps.set(identifier, {
        [method]: identifier,
        otp,
        expiresAt,
        attempts: 0,
        lastSent: new Date()
      });
    } else {
      // Create a new OTP record
      this.otps.set(identifier, {
        [method]: identifier,
        otp,
        expiresAt,
        attempts: 0,
        lastSent: new Date()
      });
    }
    
    // In a real app, we would send the OTP via email or SMS
    console.log(`OTP for ${identifier}: ${otp}`);
    
    // For demo purposes, automatically show the OTP
    toast.info(`Your OTP is: ${otp}`, {
      duration: 10000,
      position: 'top-center'
    });
  }
  
  async verifyOtp(identifier: string, otp: string): Promise<boolean> {
    // Simulate network delay
    await this.delay(500);
    
    // Check if we have an OTP for this identifier
    const otpRecord = this.otps.get(identifier);
    if (!otpRecord) {
      return false;
    }
    
    // Check if OTP is expired
    const now = new Date();
    if (now > otpRecord.expiresAt) {
      return false;
    }
    
    // Increment attempt counter
    otpRecord.attempts += 1;
    
    // Check if too many attempts
    if (otpRecord.attempts > 5) {
      this.otps.delete(identifier);
      throw new Error("Too many failed attempts. Please request a new OTP.");
    }
    
    // Check if OTP matches
    if (otpRecord.otp !== otp) {
      this.otps.set(identifier, otpRecord);
      return false;
    }
    
    // OTP is valid, remove it from storage to prevent reuse
    this.otps.delete(identifier);
    
    return true;
  }
  
  isBiometricAvailable(): boolean {
    // In a real app, we would check if the device supports biometric authentication
    // For this demo, we'll just check if it's a secure context (HTTPS) which is required for WebAuthn
    const isSecureContext = window.isSecureContext;
    
    // For demo purposes, we'll always return true
    return true;
  }
  
  async updateBiometricPreference(enabled: boolean): Promise<void> {
    // Simulate network delay
    await this.delay(500);
    
    if (!this.currentUser) {
      throw new Error("User not logged in");
    }
    
    // Get all users
    const users = this.db.getItem<User[]>('users') || [];
    const userIndex = users.findIndex(u => u.id === this.currentUser?.id);
    
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    // Update biometric preference
    users[userIndex].biometricsEnabled = enabled;
    this.db.saveItem('users', users);
    
    // Update current user
    this.currentUser.biometricsEnabled = enabled;
    localStorage.setItem('user', JSON.stringify(this.currentUser));
    
    // If enabled, store the user for biometric login
    if (enabled) {
      localStorage.setItem('biometricUser', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('biometricUser');
    }
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
    
    if (!this.currentUser) {
      throw new Error('You must be logged in to book an appointment');
    }
    
    if (this.currentUser.role !== 'patient') {
      throw new Error('Only patients can book appointments');
    }
    
    const { doctorId, date, time } = appointment;
    
    // Validate inputs
    if (!doctorId || !date || !time) {
      throw new Error('Doctor, date, and time are required');
    }
    
    // Check if doctor exists
    const doctor = await this.getDoctorById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    
    // Check if the doctor is available on that day and time
    const dayOfWeek = format(new Date(date), 'EEEE');
    const doctorAvailability = doctor.availability?.[dayOfWeek] || [];
    
    if (doctorAvailability.length === 0) {
      throw new Error('Doctor is not available on this day');
    }
    
    // Check if time is within doctor's availability
    const isTimeAvailable = doctorAvailability.some(slot => {
      const slotStartHour = parseInt(slot.start.split(':')[0]);
      const slotStartMinute = parseInt(slot.start.split(':')[1]);
      const slotEndHour = parseInt(slot.end.split(':')[0]);
      const slotEndMinute = parseInt(slot.end.split(':')[1]);
      
      const timeHour = parseInt(time.split(':')[0]);
      const timeMinute = parseInt(time.split(':')[1]);
      
      const slotStartMinutes = slotStartHour * 60 + slotStartMinute;
      const slotEndMinutes = slotEndHour * 60 + slotEndMinute;
      const timeMinutes = timeHour * 60 + timeMinute;
      
      return timeMinutes >= slotStartMinutes && timeMinutes < slotEndMinutes;
    });
    
    if (!isTimeAvailable) {
      throw new Error('Selected time is not within doctor\'s available hours');
    }
    
    // Check for existing appointments at the same time
    const appointments = this.db.getItem<Appointment[]>('appointments') || [];
    const conflictingAppointment = appointments.find(
      app => app.doctorId === doctorId && app.date === date && app.time === time && app.status !== 'cancelled'
    );
    
    if (conflictingAppointment) {
      throw new Error('This time slot is already booked');
    }
    
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
    
    console.log('Appointment booked successfully:', newAppointment);
    
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
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // For development/testing only - resets all data
  async resetAllData(): Promise<void> {
    // Clear all localStorage data
    localStorage.clear();
    
    // Re-initialize database
    this.db = new Database();
    
    // Reset current user
    this.currentUser = null;
    
    // Clear all OTPs
    this.otps.clear();
    
    toast.success("All data has been reset", {
      description: "The application has been reset to its initial state."
    });
  }
}

// Export a singleton instance
export const api = new ApiService();
