import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { apiGetStations, apiCreateStation, apiUpdateStation, apiDeleteStation, apiGetStationByName } from '../../../../apis/station.api';
import type { StationResponse, StationRequest } from '../../../../types/station.type';

interface StationFormData {
  stationCode: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  sequenceOrder: number;
  routeId: number;
}

export default function StationManagement() {
  const [stations, setStations] = useState<StationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState<StationResponse | null>(null);
  const [formData, setFormData] = useState<StationFormData>({
    stationCode: '',
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    sequenceOrder: 0,
    routeId: 0
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const response = await apiGetStations();
      if (response?.data) {
        setStations(response.data);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchStations();
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiGetStationByName(searchTerm);
      if (response?.data) {
        setStations(response.data);
      }
    } catch (error) {
      console.error('Error searching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStation) {
        // Update existing station
        const updatedStation: StationResponse = {
          ...editingStation,
          ...formData
        };
        const response = await apiUpdateStation(updatedStation, editingStation.stationId);
        if (response?.data) {
          setStations(stations.map(s => s.stationId === editingStation.stationId ? response.data : s));
        }
      } else {
        // Create new station
        const newStation: StationRequest = formData;
        const response = await apiCreateStation(newStation);
        if (response?.data) {
          setStations([...stations, response.data]);
        }
      }
      
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving station:', error);
    }
  };

  const handleEdit = (station: StationResponse) => {
    setEditingStation(station);
    setFormData({
      stationCode: station.stationCode,
      name: station.name,
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
      sequenceOrder: station.sequenceOrder,
      routeId: station.routeId
    });
    setShowModal(true);
  };

  const handleDelete = async (stationId: number) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        await apiDeleteStation(stationId);
        setStations(stations.filter(s => s.stationId !== stationId));
      } catch (error) {
        console.error('Error deleting station:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      stationCode: '',
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      sequenceOrder: 0,
      routeId: 0
    });
    setEditingStation(null);
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === 'open';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Station Management</h1>
            <p className="text-gray-600 mt-1">Manage metro stations and their information</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Station
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search stations by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => {
              setSearchTerm('');
              fetchStations();
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Stations Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <div key={station.stationId} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{station.name}</h3>
                    <p className="text-sm text-gray-600 font-mono">{station.stationCode}</p>
                  </div>
                  {getStatusBadge(station.status)}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-gray-700">{station.address}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Latitude:</span>
                      <p className="font-medium text-gray-900">{station.latitude.toFixed(6)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Longitude:</span>
                      <p className="font-medium text-gray-900">{station.longitude.toFixed(6)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Route ID:</span>
                      <p className="font-medium text-gray-900">{station.routeId}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Sequence:</span>
                      <p className="font-medium text-gray-900">{station.sequenceOrder}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>Updated: {new Date(station.updateAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(station)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(station.stationId)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {stations.length === 0 && !loading && (
        <div className="text-center py-12">
          <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stations found</h3>
          <p className="text-gray-600">Get started by adding your first station.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingStation ? 'Edit Station' : 'Add New Station'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station Code</label>
                  <input
                    type="text"
                    required
                    value={formData.stationCode}
                    onChange={(e) => setFormData({...formData, stationCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., ST001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Station name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Full address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.000000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Route ID</label>
                    <input
                      type="number"
                      required
                      value={formData.routeId}
                      onChange={(e) => setFormData({...formData, routeId: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sequence Order</label>
                    <input
                      type="number"
                      required
                      value={formData.sequenceOrder}
                      onChange={(e) => setFormData({...formData, sequenceOrder: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingStation ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}