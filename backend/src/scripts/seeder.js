import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Resident, Driver, AdminStaff } from '../models/User.js';
import { City } from '../models/City.js';
import { Route } from '../models/Route.js';
import { EmergencyRequest } from '../models/EmergencyRequest.js';
import { Complaint } from '../models/Complaint.js';
import { Collection } from '../models/Collection.js';
import { AuditLog } from '../models/AuditLog.js';
import { Role, Staff } from '../models/RolePermission.js';
import { Payment } from '../models/Payment.js';
import { RewardRedemption } from '../models/RewardRedemption.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trackmytrash');
    console.log('MongoDB Connected for Clean Initialization...');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const cleanDatabase = async () => {
  await connectDB();

  try {
    // Clear all dummy records across all models
    await Resident.deleteMany();
    await Driver.deleteMany();
    await AdminStaff.deleteMany();
    await User.deleteMany();
    await City.deleteMany();
    await Route.deleteMany();
    await EmergencyRequest.deleteMany();
    await Complaint.deleteMany();
    await Collection.deleteMany();
    await AuditLog.deleteMany();
    await Payment.deleteMany();
    await RewardRedemption.deleteMany();
    await Role.deleteMany();
    await Staff.deleteMany();

    console.log('Cleared all dummy records from MongoDB database.');

    // Seed ONLY administrative system default accounts (NO dummy residents/drivers)
    const adminAccounts = [
      {
        customId: 'ADM-001',
        name: 'Greater Noida Municipal Authority',
        email: 'gn@gmail.com',
        password: '@Qwert123',
        role: 'admin',
        scope: 'cityadmin',
        title: 'Municipal Coordinator',
        roleName: 'Municipal Coordinator',
        department: 'Operations',
        status: 'Active',
        avatar: '',
      },
      {
        customId: 'HQ-SUP-001',
        name: 'Alexandra Sterling',
        email: 'sterling@trackmytrash-hq.global',
        password: 'password123',
        role: 'superadmin',
        scope: 'superadmin',
        title: 'Global Operations Director (HQ)',
        roleName: 'Global Operations Director (HQ)',
        department: 'Executive HQ',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
      }
    ];

    await AdminStaff.create(adminAccounts);
    await User.create(adminAccounts);

    // Also register  Greater Noida Municipal Authority in municipal Staff roster
    await Staff.create({
      customId: 'ADM-001',
      name: 'Greater Noida Municipal Authority',
      email: 'gn@gmail.com',
      phone: '+919292929292',
      department: 'Operations',
      roleName: 'Municipal Coordinator',
      scope: 'cityadmin',
      city: 'Greater Noida',
      status: 'Active',
      password: '@Qwert123'
    });

    // System Default RBAC Roles
    await Role.create([]);

    console.log('Clean Database Setup Complete (Dummy Data Removed)!');
    process.exit();
  } catch (error) {
    console.error(`Error Cleaning Database: ${error.message}`);
    process.exit(1);
  }
};

cleanDatabase();


