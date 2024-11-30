"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
    
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          window.location.href = '/signin';
          return;
        }

        // Fetch different endpoints based on role
        const endpoints = [
          '/api/v1/services/amenities', // Available to all
          ...(role === 'ADMIN' ? [
            '/api/v1/services/cctv',
            '/api/v1/services/security-logs'
          ] : []),
          ...(role === 'MODERATOR' ? [
            '/api/v1/services/electrical-panel',
            '/api/v1/services/maintenance-schedule'
          ] : [])
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint => 
            axios.get(`http://localhost:3001${endpoint}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          )
        );

        const allServices = responses.flatMap(res => res.data);
        setServices(allServices);
      } catch (err) {
        setError('Failed to fetch services');
        console.error(err);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Services Dashboard</h1>
      <p className="mb-4">Your role: {userRole}</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Amenities (available to all) */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Amenities</h2>
          {services.filter(s => s.type === 'amenity').map((amenity: any) => (
            <div key={amenity.id} className="mb-2">
              <p className="font-medium">{amenity.name}</p>
              <p className="text-sm text-gray-600">Status: {amenity.status}</p>
              <p className="text-sm text-gray-600">Timing: {amenity.timing}</p>
            </div>
          ))}
        </div>

        {/* Admin-only services */}
        {userRole === 'ADMIN' && (
          <>
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">CCTV Monitoring</h2>
              {services.filter(s => s.type === 'camera').map((camera: any) => (
                <div key={camera.id} className="mb-2">
                  <p className="font-medium">{camera.location}</p>
                  <p className="text-sm text-gray-600">Status: {camera.status}</p>
                </div>
              ))}
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Security Logs</h2>
              {services.filter(s => s.type === 'log').map((log: any) => (
                <div key={log.id} className="mb-2">
                  <p className="font-medium">{log.event}</p>
                  <p className="text-sm text-gray-600">
                    Time: {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Moderator-only services */}
        {userRole === 'MODERATOR' && (
          <>
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Electrical Panel</h2>
              {services.filter(s => s.type === 'panel').map((panel: any) => (
                <div key={panel.id} className="mb-2">
                  <p className="font-medium">{panel.zone}</p>
                  <p className="text-sm text-gray-600">Status: {panel.status}</p>
                  <p className="text-sm text-gray-600">
                    Power: {panel.power_consumption}
                  </p>
                </div>
              ))}
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Maintenance Schedule</h2>
              {services.filter(s => s.type === 'schedule').map((task: any) => (
                <div key={task.id} className="mb-2">
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-gray-600">Date: {task.date}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 