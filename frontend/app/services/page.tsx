"use client";
import { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal';
import { NavBar } from '@/components/navBar';

export default function ServicesPage() {
  const [userRole, setUserRole] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [modalData, setModalData] = useState<any>(null);



  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
  }, []);

  const handleServiceClick = async (service: string) => {
    try {
    
      let data;
      selectedService
      switch (service) {
        case 'amenities':
          data = {
            title: "Available Amenities",
            items: [
              { name: "Swimming Pool", status: "Open", timing: "6 AM - 10 PM", maintenance: "Every Monday", temperature: "28°C", capacity: "50 people" },
              { name: "Gym", status: "Open", timing: "24/7", lastCleaning: "2 hours ago", equipment: "Full Set", trainer: "Available" },
              { name: "Tennis Court", status: "Maintenance", nextAvailable: "Tomorrow", courtType: "Hard Court", lights: "Available" },
              { name: "Basketball Court", status: "Open", timing: "8 AM - 8 PM", maintenance: "Every Wednesday", lights: "Available" },
              { name: "Sauna", status: "Closed", reopening: "5 PM", maxCapacity: "6 people", temperature: "85°C" }
            ]
          };
          break;

        case 'cctv':
          if (userRole !== 'ADMIN') {
            setError('Admin access required');
            return;
          }
          data = {
            title: "CCTV Monitoring",
            items: [
              { location: "Main Gate", status: "Active", lastCheck: "10 mins ago", resolution: "4K", recording: "Yes", motionDetection: "Enabled" },
              { location: "Parking Level 1", status: "Active", lastCheck: "15 mins ago", coverage: "100%", nightVision: "Enabled", alerts: "None" },
              { location: "Lobby", status: "Warning", issue: "Poor visibility", maintenance: "Scheduled", lastIncident: "None", coverage: "85%" },
              { location: "Emergency Exit", status: "Active", lastCheck: "5 mins ago", batteryBackup: "Available", recording: "Yes" },
              { location: "Elevator Area", status: "Active", lastCheck: "12 mins ago", resolution: "1080p", coverage: "100%" }
            ]
          };
          break;

        case 'security':
          if (userRole !== 'ADMIN') {
            setError('Admin access required');
            return;
          }
          data = {
            title: "Security Logs",
            items: [
              { time: "10:45 AM", event: "Visitor Entry", location: "Main Gate", visitorName: "John Doe", purpose: "Meeting" },
              { time: "11:30 AM", event: "Fire Alarm Test", location: "Building A", status: "Successful", technician: "Mike Ross" },
              { time: "12:15 PM", event: "Maintenance Access", location: "Server Room", personnel: "Tech Team", duration: "45 mins" },
              { time: "2:30 PM", event: "Suspicious Activity", location: "Parking B2", action: "Security Dispatched", resolved: "Yes" },
              { time: "3:45 PM", event: "Delivery Arrival", location: "Loading Bay", vendor: "FastEx", verified: "Yes" }
            ]
          };
          break;

        case 'electrical':
          if (userRole !== 'MODERATOR') {
            setError('Moderator access required');
            return;
          }
          data = {
            title: "Electrical Panel Status",
            items: [
              { zone: "Block A Main", status: "Normal", consumption: "450 kW/h", voltage: "220V", lastMaintenance: "Last Week", efficiency: "95%" },
              { zone: "Block B", status: "High Load", consumption: "750 kW/h", peakTime: "2 PM", alert: "Monitor Required", efficiency: "87%" },
              { zone: "Emergency Backup", status: "Standby", lastTest: "Yesterday", capacity: "100%", runtime: "48 hours", type: "Diesel" },
              { zone: "Solar Grid", status: "Active", generation: "125 kW/h", efficiency: "92%", panels: "100% Operational" },
              { zone: "Common Areas", status: "Normal", consumption: "200 kW/h", peakHours: "6 PM - 8 PM", optimization: "Enabled" }
            ]
          };
          break;

        case 'maintenance':
          if (userRole !== 'MODERATOR') {
            setError('Moderator access required');
            return;
          }
          data = {
            title: "Maintenance Schedule",
            items: [
              { task: "HVAC Service", date: "Tomorrow", assignee: "John Smith", priority: "High", duration: "4 hours", equipment: "Full Set" },
              { task: "Generator Test", date: "Next Week", assignee: "Mike Wilson", type: "Routine", location: "All Blocks", duration: "2 hours" },
              { task: "Fire Alarm Check", date: "03/20/2024", assignee: "Sarah Johnson", priority: "Critical", coverage: "All Floors" },
              { task: "Plumbing Inspection", date: "03/25/2024", assignee: "Tom Davis", type: "Preventive", location: "Block A & B" },
              { task: "Elevator Maintenance", date: "04/01/2024", assignee: "Tech Team", type: "Scheduled", vendor: "ElevatorCo" }
            ]
          };
          break;

        case 'notices':
          data = {
            title: "Community Notices",
            items: [
              { title: "Monthly Meeting", date: "03/15/2024", time: "6 PM", location: "Community Hall", agenda: "Budget Discussion" },
              { title: "Pool Maintenance", date: "03/18/2024", duration: "2 Days", alternative: "Guest Pool Available" },
              { title: "New Security Measures", date: "Effective Immediately", details: "Updated Access Cards", contact: "Security Office" },
              { title: "Community Event", date: "03/30/2024", event: "Spring Festival", location: "Garden Area", rsvp: "Required" },
              { title: "Parking Updates", date: "04/01/2024", changes: "New Numbering System", implementation: "Phase-wise" }
            ]
          };
          break;
      }

      setModalData(data);
      setSelectedService(service);
      setModalOpen(true);
    } catch (err) {
      setError('Failed to fetch service data');
      console.error(err);
    }
  };

  // Helper function to determine if user can access a service
  const canAccessService = (requiredRole: string | null) => {
    if (!requiredRole) return true; // No role required
    if (!userRole) return false; // No user role (not logged in)
    if (requiredRole === 'ADMIN') return userRole === 'ADMIN';
    if (requiredRole === 'MODERATOR') return userRole === 'MODERATOR' || userRole === 'ADMIN';
    return true; // User role can access basic services
  };

  const services = [
    {
      id: 'amenities',
      title: 'Amenities',
      description: 'View available facilities',
      requiredRole: null // Available to all authenticated users
    },
    {
      id: 'cctv',
      title: 'CCTV Monitoring',
      description: 'View security cameras',
      requiredRole: 'ADMIN'
    },
    {
      id: 'security',
      title: 'Security Logs',
      description: 'View security events',
      requiredRole: 'ADMIN'
    },
    {
      id: 'electrical',
      title: 'Electrical Panel',
      description: 'Monitor power systems',
      requiredRole: 'MODERATOR'
    },
    {
      id: 'maintenance',
      title: 'Maintenance Schedule',
      description: 'View upcoming tasks',
      requiredRole: 'MODERATOR'
    },
    {
      id: 'notices',
      title: 'Community Notices',
      description: 'View community announcements',
      requiredRole: null // Available to all authenticated users
    }
  ];

  return (
    
    <div className="max-w-7xl mx-auto p-4">
        <NavBar />
      <h1 className="text-2xl font-bold mb-4">Services Dashboard</h1>
      <p className="mb-4">Your role: {userRole || 'Not logged in'}</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          {error}
          <button
            className="absolute top-0 bottom-0 right-0 px-4"
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div 
            key={service.id}
            className={`border rounded-lg p-4 transition-colors ${
              canAccessService(service.requiredRole)
                ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
                : 'opacity-75 cursor-not-allowed'
            }`}
            onClick={() => canAccessService(service.requiredRole) && handleServiceClick(service.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
            <p className="text-gray-600">
              {canAccessService(service.requiredRole) 
                ? service.description 
                : `${service.requiredRole} access required`}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalData?.title || ''}
      >
        <div className="space-y-4">
          {modalData?.items && Array.isArray(modalData.items) ? (
            modalData.items.map((item: any, index: number) => (
              <div key={index} className="border-b dark:border-zinc-700 last:border-0 pb-3 last:pb-0">
                {Object.entries(item).map(([key, value]) => (
                  <p key={key} className="text-sm">
                    <span className="font-medium capitalize">{key}: </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value as string}
                    </span>
                  </p>
                ))}
              </div>
            ))
          ) : (
            <p>No items to display</p>
          )}
        </div>
      </Modal>
    </div>
  );
} 