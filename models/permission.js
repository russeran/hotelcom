const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    role: { 
        type: String, 
        required: true,
        enum: ['staff', 'manager', 'admin']
    },
    department: { 
        type: String,
        enum: ['Front Desk', 'Housekeeping', 'Food & Beverage', 'Concierge', 'Maintenance', 'All']
    },
    permissions: {
        // Navigation/Pages Access
        pages: {
            dashboard: { type: Boolean, default: true },
            reservations: { type: Boolean, default: false },
            rooms: { type: Boolean, default: false },
            guestProfiles: { type: Boolean, default: false },
            complaints: { type: Boolean, default: false },
            notes: { type: Boolean, default: false },
            tasks: { type: Boolean, default: true },
            chat: { type: Boolean, default: true },
            concierge: { type: Boolean, default: false },
            lostAndFound: { type: Boolean, default: false },
            packages: { type: Boolean, default: false },
            hotels: { type: Boolean, default: false },
            restaurantManagement: { type: Boolean, default: false },
            restaurantReservations: { type: Boolean, default: false },
            waitlist: { type: Boolean, default: false },
            reports: { type: Boolean, default: false },
            admin: { type: Boolean, default: false }
        },
        
        // Dashboard Cards Access
        dashboardCards: {
            tasks: { type: Boolean, default: true },
            reservations: { type: Boolean, default: false },
            rooms: { type: Boolean, default: false },
            complaints: { type: Boolean, default: false },
            guestRequests: { type: Boolean, default: false },
            notes: { type: Boolean, default: false },
            concierge: { type: Boolean, default: false },
            weather: { type: Boolean, default: true },
            clock: { type: Boolean, default: true },
            restaurants: { type: Boolean, default: false },
            waitlist: { type: Boolean, default: false },
            packages: { type: Boolean, default: false },
            lostAndFound: { type: Boolean, default: false }
        },
        
        // Actions
        actions: {
            createReservation: { type: Boolean, default: false },
            updateReservation: { type: Boolean, default: false },
            deleteReservation: { type: Boolean, default: false },
            createTask: { type: Boolean, default: true },
            updateTask: { type: Boolean, default: true },
            deleteTask: { type: Boolean, default: false },
            createComplaint: { type: Boolean, default: true },
            updateComplaint: { type: Boolean, default: true },
            deleteComplaint: { type: Boolean, default: false },
            updateRoomStatus: { type: Boolean, default: false },
            manageUsers: { type: Boolean, default: false },
            viewReports: { type: Boolean, default: false },
            manageRestaurants: { type: Boolean, default: false },
            manageWaitlist: { type: Boolean, default: false }
        }
    },
    isActive: { type: Boolean, default: true },
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

permissionSchema.index({ role: 1, department: 1 });

// Default permissions for each role
permissionSchema.statics.getDefaultPermissions = function(role, department) {
    const defaults = {
        staff: {
            'Front Desk': {
                pages: { dashboard: true, reservations: true, rooms: true, guestProfiles: true, complaints: true, notes: true, tasks: true, chat: true, packages: true },
                dashboardCards: { tasks: true, reservations: true, rooms: true, complaints: true, guestRequests: true, notes: true, packages: true, clock: true, weather: true },
                actions: { createReservation: true, updateReservation: true, createTask: true, updateTask: true, createComplaint: true, updateComplaint: true, updateRoomStatus: true }
            },
            'Food & Beverage': {
                pages: { dashboard: true, restaurantManagement: true, restaurantReservations: true, waitlist: true, tasks: true, chat: true, guestProfiles: true },
                dashboardCards: { tasks: true, restaurants: true, waitlist: true, guestRequests: true, clock: true, weather: true },
                actions: { createTask: true, updateTask: true, manageRestaurants: true, manageWaitlist: true }
            },
            'Housekeeping': {
                pages: { dashboard: true, rooms: true, tasks: true, chat: true, lostAndFound: true },
                dashboardCards: { tasks: true, rooms: true, lostAndFound: true, clock: true },
                actions: { createTask: true, updateTask: true, updateRoomStatus: true }
            },
            'Concierge': {
                pages: { dashboard: true, concierge: true, guestProfiles: true, hotels: true, tasks: true, chat: true, lostAndFound: true, packages: true },
                dashboardCards: { tasks: true, concierge: true, packages: true, lostAndFound: true, weather: true, clock: true },
                actions: { createTask: true, updateTask: true }
            },
            'Maintenance': {
                pages: { dashboard: true, tasks: true, chat: true, rooms: true },
                dashboardCards: { tasks: true, rooms: true, clock: true },
                actions: { createTask: true, updateTask: true, updateRoomStatus: true }
            }
        },
        manager: {
            'All': {
                pages: { dashboard: true, reservations: true, rooms: true, guestProfiles: true, complaints: true, notes: true, tasks: true, chat: true, concierge: true, lostAndFound: true, packages: true, hotels: true, restaurantManagement: true, restaurantReservations: true, waitlist: true, reports: true },
                dashboardCards: { tasks: true, reservations: true, rooms: true, complaints: true, guestRequests: true, notes: true, concierge: true, weather: true, clock: true, restaurants: true, waitlist: true, packages: true, lostAndFound: true },
                actions: { createReservation: true, updateReservation: true, deleteReservation: true, createTask: true, updateTask: true, deleteTask: true, createComplaint: true, updateComplaint: true, deleteComplaint: true, updateRoomStatus: true, viewReports: true, manageRestaurants: true, manageWaitlist: true }
            }
        },
        admin: {
            'All': {
                pages: { dashboard: true, reservations: true, rooms: true, guestProfiles: true, complaints: true, notes: true, tasks: true, chat: true, concierge: true, lostAndFound: true, packages: true, hotels: true, restaurantManagement: true, restaurantReservations: true, waitlist: true, reports: true, admin: true },
                dashboardCards: { tasks: true, reservations: true, rooms: true, complaints: true, guestRequests: true, notes: true, concierge: true, weather: true, clock: true, restaurants: true, waitlist: true, packages: true, lostAndFound: true },
                actions: { createReservation: true, updateReservation: true, deleteReservation: true, createTask: true, updateTask: true, deleteTask: true, createComplaint: true, updateComplaint: true, deleteComplaint: true, updateRoomStatus: true, viewReports: true, manageUsers: true, manageRestaurants: true, manageWaitlist: true }
            }
        }
    };
    
    return defaults[role]?.[department] || defaults[role]?.['All'] || {};
};

module.exports = mongoose.model('Permission', permissionSchema);
