import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { MapPin, Navigation, Clock, Map as MapIcon } from 'lucide-react';
import { Modal } from 'antd';
import L from 'leaflet';
import { apiGetStations, apiGetBusStation, apiGetBusStationDetail } from '../../apis/station.api';
import { formatTime } from '../../utils/format.datetime';
import { apiGetRoutes } from '../../apis/route.api';
import { apiGetSchedulesByStation } from '../../apis/schedule.api';
import type { Station, BusStation, BusStationDetail } from '../../types/station.type';
import type { RoutesResponse } from '../../types/route.type';
import type { SchedulesResponse } from '../../types/schedule.type';
import 'leaflet/dist/leaflet.css';
import './MetroMap.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom station icons
const createStationIcon = (status: string) => {
  const color = status === 'open' ? '#10b981' : '#ef4444';
  return L.divIcon({
    className: 'custom-station-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: white;
        "></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

// Custom bus station icons
const createBusStationIcon = (isActive: number) => {
  console.log("test111", isActive);
  const color = isActive === 1 ? '#f59e0b' : '#6b7280';
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: white;
        border-radius: 6px;
        border: 2px solid ${color};
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V16C20 17.1046 19.1046 18 18 18H16L15 20H9L8 18H6C4.89543 18 4 17.1046 4 16V6Z" fill="${color}"/>
          <rect x="6" y="7" width="3" height="2" rx="0.5" fill="white"/>
          <rect x="10" y="7" width="4" height="2" rx="0.5" fill="white"/>
          <rect x="15" y="7" width="3" height="2" rx="0.5" fill="white"/>
          <circle cx="8" cy="15" r="1.5" fill="white"/>
          <circle cx="16" cy="15" r="1.5" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [14, 14],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};


const MetroMap: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [busStations, setBusStations] = useState<BusStation[]>([]);
  const [routes, setRoutes] = useState<RoutesResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedBusStation, setSelectedBusStation] = useState<BusStation | null>(null);
  const [busStationDetail, setBusStationDetail] = useState<BusStationDetail | null>(null);
  const [busStationDetailLoading, setBusStationDetailLoading] = useState(false);
  const [schedules, setSchedules] = useState<SchedulesResponse[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [mapView, setMapView] = useState<'map' | 'schematic'>('map');
  const [showBusStations, setShowBusStations] = useState(true);


  // Fetch schedules for selected station
  const fetchSchedules = async (stationId: number) => {
    setSchedulesLoading(true);
    try {
      const response = await apiGetSchedulesByStation(stationId);
      if (response?.data) {
        setSchedules(response.data);
      } else {
        setSchedules([]);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
    } finally {
      setSchedulesLoading(false);
    }
  };

  // Fetch bus station details
  const fetchBusStationDetail = async (stationId: string) => {
    setBusStationDetailLoading(true);
    try {
      const response = await apiGetBusStationDetail(stationId);
      if (response?.data) {
        setBusStationDetail(response.data);
      } else {
        setBusStationDetail(null);
      }
    } catch (error) {
      console.error('Error fetching bus station details:', error);
      setBusStationDetail(null);
    } finally {
      setBusStationDetailLoading(false);
    }
  };

  // Handle station selection with schedule fetching
  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setSelectedBusStation(null);
    fetchSchedules(station.stationId);
  };

  const handleBusStationSelect = (busStation: BusStation) => {
    setSelectedBusStation(busStation);
    setSelectedStation(null);
    setSchedules([]);
    fetchBusStationDetail(busStation.id.toString());
  };

  const handleCloseModal = () => {
    setSelectedStation(null);
    setSelectedBusStation(null);
    setBusStationDetail(null);
    setSchedules([]);
  };

  // Get displayed bus stations
  const getDisplayedBusStations = (): BusStation[] => {
    if (!showBusStations) return [];
    
    return busStations.filter(busStation => {
      return busStation.latitude && busStation.longitude;
    });
  };

  // Calculate map center based on stations
  const getMapCenter = (): [number, number] => {
    const displayedBusStations = getDisplayedBusStations();
    const allStations = [...stations, ...displayedBusStations];
    if (allStations.length === 0) return [10.8231, 106.6297]; // Default to Ho Chi Minh City
    
    const validStations = allStations.filter(s => s.latitude && s.longitude);
    if (validStations.length === 0) return [10.8231, 106.6297];
    
    const avgLat = validStations.reduce((sum, station) => sum + station.latitude, 0) / validStations.length;
    const avgLng = validStations.reduce((sum, station) => sum + station.longitude, 0) / validStations.length;
    
    return [avgLat, avgLng];
  };

  // Create polyline coordinates for route visualization
  const getRoutePolylines = () => {
    const stationsByRoute = stations.reduce((acc, station) => {
      if (!acc[station.routeId]) acc[station.routeId] = [];
      acc[station.routeId].push(station);
      return acc;
    }, {} as Record<number, Station[]>);

    return Object.entries(stationsByRoute).map(([routeId, routeStations]) => {
      const sortedStations = routeStations
        .filter(s => s.latitude && s.longitude)
        .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
      
      const coordinates: [number, number][] = sortedStations.map(station => [
        station.latitude,
        station.longitude
      ]);
      
      return {
        routeId: parseInt(routeId),
        coordinates,
        route: routes.find(r => r.routeId === parseInt(routeId))
      };
    }).filter(route => route.coordinates.length > 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stationsResponse, routesResponse, busStationsResponse] = await Promise.all([
          apiGetStations(),
          apiGetRoutes(),
          apiGetBusStation()
        ]);

        if (stationsResponse?.data) {
          // Sort stations by sequence order for proper display
          const sortedStations = stationsResponse.data.sort((a, b) => a.sequenceOrder - b.sequenceOrder);
          setStations(sortedStations);
        }

        if (routesResponse?.data) {
          setRoutes(routesResponse.data);
        }
        
        if (busStationsResponse?.data) {
          console.log("debug", busStationsResponse.data); 
          setBusStations(busStationsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching metro data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mapCenter = getMapCenter();
  const routePolylines = getRoutePolylines();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Metro Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Metro Map</h1>
          <p className="text-lg text-gray-600">
            Interactive metro system map with real-time station information
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setMapView('map')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center ${
                mapView === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Interactive Map
            </button>
            <button
              onClick={() => setMapView('schematic')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center ${
                mapView === 'schematic'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Schematic View
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Route Overview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Navigation className="w-6 h-6 mr-2 text-blue-600" />
              Route Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((route) => {
                const routeStations = stations.filter(s => s.routeId === route.routeId);
                return (
                  <div key={route.routeId} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900">{route.routeName}</h3>
                    <p className="text-sm text-gray-600 mb-2">Code: {route.routeCode}</p>
                    <p className="text-sm text-gray-600 mb-2">Distance: {route.distanceInKm} km</p>
                    <p className="text-sm text-gray-600">Stations: {routeStations.length}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Map View */}
          {mapView === 'map' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapIcon className="w-6 h-6 mr-2 text-blue-600" />
                Interactive Metro Map
              </h2>
              
              <div className="h-96 rounded-lg overflow-hidden border border-gray-200 relative">
                {/* Map Controls */}
                <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
                  <div className="flex flex-col space-y-3">
                    <div className="border-b pb-2">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={showBusStations}
                          onChange={(e) => setShowBusStations(e.target.checked)}
                          className="rounded"
                        />
                        <span>Show Bus Stations</span>
                      </label>
                    </div>
                    {showBusStations && (
                      <div className="text-xs text-gray-500">
                        Showing {getDisplayedBusStations().length} of {busStations.length} bus stations
                      </div>
                    )}
                  </div>
                </div>
                
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Route Lines */}
                  {routePolylines.map((routeLine) => (
                    <Polyline
                      key={routeLine.routeId}
                      positions={routeLine.coordinates}
                      color="#2563eb"
                      weight={4}
                      opacity={0.8}
                    />
                  ))}
                  
                  {/* Station Markers */}
                  {stations
                    .filter(station => station.latitude && station.longitude)
                    .map((station) => (
                      <Marker
                        key={station.stationId}
                        position={[station.latitude, station.longitude]}
                        icon={createStationIcon(station.status)}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold text-lg mb-2">{station.name}</h3>
                            <div className="space-y-1 text-sm">
                              <p><strong>Code:</strong> {station.stationCode}</p>
                              <p><strong>Sequence:</strong> {station.sequenceOrder}</p>
                              <p><strong>Status:</strong> 
                                <span className={`ml-1 font-medium ${
                                  station.status === 'open' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {station.status}
                                </span>
                              </p>
                              <p><strong>Route:</strong> {routes.find(r => r.routeId === station.routeId)?.routeName}</p>
                              {station.address && (
                                <p><strong>Address:</strong> {station.address}</p>
                              )}
                            </div>
                            <button
                                onClick={() => handleStationSelect(station)}
                                className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                              >
                                View Details
                              </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))
                  }

                  {/* Bus Station Markers */}
                  {getDisplayedBusStations().map((busStation) => (
                      <Marker
                        key={busStation.id}
                        position={[busStation.latitude, busStation.longitude]}
                        icon={createBusStationIcon(busStation.isActive)}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold text-lg mb-2">{busStation.name}</h3>
                            <div className="space-y-1 text-sm">
                              <p><strong>Code:</strong> {busStation.code}</p>
                              <p><strong>Status:</strong> 
                                <span className={`ml-1 font-medium ${
                                  busStation.isActive===1 ? 'text-amber-600' : 'text-gray-600'
                                }`}>
                                  {busStation.isActive===1 ? 'Active' : 'Inactive'}
                                </span>
                              </p>
                              <p><strong>Type:</strong> Bus Station</p>
                              {busStation.address && (
                                <p><strong>Address:</strong> {busStation.address}</p>
                              )}
                            </div>
                            <button
                                onClick={() => handleBusStationSelect(busStation)}
                                className="mt-2 px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 transition-colors"
                              >
                                View Details
                              </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))
                  }
                </MapContainer>
              </div>
            </div>
          )}

          {/* Schematic View */}
          {mapView === 'schematic' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                Metro Line Schematic
              </h2>
              
              {/* Route Lines */}
              <div className="space-y-8">
                {routes.map((route) => {
                  const routeStations = stations
                    .filter(s => s.routeId === route.routeId)
                    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
                  
                  return (
                    <div key={route.routeId} className="relative">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {route.routeName} ({route.routeCode})
                      </h3>
                      
                      {/* Station Line */}
                      <div className="relative">
                        {/* Horizontal line */}
                        <div className="absolute top-6 left-6 right-6 h-1 bg-blue-600 rounded"></div>
                        
                        {/* Stations */}
                        <div className="flex justify-between items-start relative z-10">
                          {routeStations.map((station) => (
                            <div key={station.stationId} className="flex flex-col items-center">
                              {/* Station Circle */}
                              <button
                                 onClick={() => handleStationSelect(station)}
                                 className={`w-12 h-12 rounded-full border-4 border-white shadow-lg transition-all duration-200 hover:scale-110 ${
                                   station.status === 'open' 
                                     ? 'bg-green-500 hover:bg-green-600' 
                                     : 'bg-red-500 hover:bg-red-600'
                                 }`}
                                 title={`${station.name} - ${station.status}`}
                               >
                                <MapPin className="w-6 h-6 text-white mx-auto" />
                              </button>
                              
                              {/* Station Info */}
                              <div className="mt-2 text-center">
                                <p className="text-sm font-medium text-gray-900">{station.name}</p>
                                <p className="text-xs text-gray-500">{station.stationCode}</p>
                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                  station.status === 'open'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  <Clock className="w-3 h-3 mr-1" />
                                  {station.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Station Grid */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Stations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {stations.map((station) => (
                <div
                   key={station.stationId}
                   onClick={() => handleStationSelect(station)}
                   className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 border-l-4 border-blue-600"
                 >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{station.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${
                      station.status === 'open' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Code: {station.stationCode}</p>
                  <p className="text-sm text-gray-600 mb-1">Sequence: {station.sequenceOrder}</p>
                  <p className="text-sm text-gray-600">Route: {routes.find(r => r.routeId === station.routeId)?.routeName}</p>
                  {station.latitude && station.longitude && (
                    <p className="text-xs text-gray-500 mt-1">
                      📍 {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Station Detail Modal - Antd Modal */}
        <Modal
          title={
            selectedStation ? (
              <div className="bg-blue-600 text-white p-4 -m-6 mb-4 rounded-t-lg">
                <h1 className="text-2xl font-bold">{selectedStation?.name}</h1>
                <p className="text-blue-100 mt-1">
                  {selectedStation && routes.find(r => r.routeId === selectedStation.routeId)?.routeName} - {selectedStation?.stationCode}
                </p>
              </div>
            ) : selectedBusStation ? (
              <div className="bg-amber-600 text-white p-4 -m-6 mb-4 rounded-t-lg">
                <h1 className="text-2xl font-bold">{selectedBusStation?.name}</h1>
                <p className="text-amber-100 mt-1">
                  Bus Station - {selectedBusStation?.code}
                </p>
              </div>
            ) : null
          }
          open={!!(selectedStation || selectedBusStation)}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
          style={{ top: 20 }}
          bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }}
        >

          {selectedStation && (
            <>
              {/* Station Information */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Station Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Station Code:</span>
                      <span className="font-medium">{selectedStation.stationCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sequence Order:</span>
                      <span className="font-medium">{selectedStation.sequenceOrder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium flex items-center ${
                        selectedStation.status === 'open' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          selectedStation.status === 'open' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        {selectedStation.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">
                        {routes.find(r => r.routeId === selectedStation.routeId)?.routeName}
                      </span>
                    </div>
                    {selectedStation.latitude && selectedStation.longitude && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coordinates:</span>
                        <span className="font-medium text-sm">
                          {selectedStation.latitude.toFixed(4)}, {selectedStation.longitude.toFixed(4)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedStation.address && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium mt-1">{selectedStation.address}</p>
                  </div>
                )}
              </div>

              {/* Schedule Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Train Schedules
                </h2>
                
                {schedulesLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading schedules...</span>
                  </div>
                ) : schedules.length > 0 ? (
                  <div className="space-y-4">
                    {/* Forward Direction */}
                    {schedules.filter(s => s.direction === 'forward').length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <Navigation className="w-4 h-4 mr-2 text-green-600" />
                          Forward Direction
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {schedules
                            .filter(s => s.direction === 'forward')
                            .map((schedule) => (
                              <div key={schedule.scheduleId} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-green-800">Arrival</span>
                                  <span className="text-lg font-bold text-green-900">{schedule.timeArrival}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-green-800">Departure</span>
                                  <span className="text-lg font-bold text-green-900">{schedule.timeDeparture}</span>
                                </div>
                                {schedule.description && (
                                  <p className="text-xs text-green-700 mt-2">{schedule.description}</p>
                                )}
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}
                    
                    {/* Backward Direction */}
                    {schedules.filter(s => s.direction === 'backward').length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <Navigation className="w-4 h-4 mr-2 text-orange-600 transform rotate-180" />
                          Backward Direction
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {schedules
                            .filter(s => s.direction === 'backward')
                            .map((schedule) => (
                              <div key={schedule.scheduleId} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-orange-800">Arrival</span>
                                  <span className="text-lg font-bold text-orange-900">{schedule.timeArrival}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-orange-800">Departure</span>
                                  <span className="text-lg font-bold text-orange-900">{schedule.timeDeparture}</span>
                                </div>
                                {schedule.description && (
                                  <p className="text-xs text-orange-700 mt-2">{schedule.description}</p>
                                )}
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No schedules available for this station</p>
                  </div>
                )}
              </div>
            </>
          )}

          {selectedBusStation && (
            <>
              {/* Bus Station Information */}
              <div className="bg-amber-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                  Bus Station Information
                </h2>
                
                {busStationDetailLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading bus station details...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Station Code:</span>
                          <span className="font-medium">{selectedBusStation.code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium flex items-center ${
                            selectedBusStation.isActive===1 ? 'text-amber-600' : 'text-gray-600'
                          }`}>
                            <div className={`w-2 h-2 rounded mr-2 ${
                              selectedBusStation.isActive===1 ? 'bg-amber-500' : 'bg-gray-500'
                            }`}></div>
                            {selectedBusStation.isActive===1 ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Station ID:</span>
                          <span className="font-medium">{selectedBusStation.id}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">Bus Station</span>
                        </div>
                        {busStationDetail && busStationDetail.code && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Station Code:</span>
                            <span className="font-medium">{busStationDetail.code}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${
                            selectedBusStation.isActive === 1 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {selectedBusStation.isActive === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {selectedBusStation.latitude && selectedBusStation.longitude && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Coordinates:</span>
                            <span className="font-medium text-sm">
                              {selectedBusStation.latitude.toFixed(4)}, {selectedBusStation.longitude.toFixed(4)}
                            </span>
                          </div>
                        )}
                        {busStationDetail && busStationDetail.routes && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Available Routes:</span>
                            <span className="font-medium">{busStationDetail.routes.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedBusStation.address && (
                      <div className="mt-4 pt-4 border-t border-amber-200">
                        <span className="text-gray-600">Address:</span>
                        <p className="font-medium mt-1">{selectedBusStation.address}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Bus Routes Information */}
              {busStationDetail && busStationDetail.routes && busStationDetail.routes.length > 0 && (
                <div className="bg-white rounded-lg border border-amber-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Navigation className="w-5 h-5 mr-2 text-amber-600" />
                    Available Bus Routes
                  </h3>
                  
                  <div className="space-y-4">
                    {busStationDetail.routes.map((route) => (
                      <div key={route.id} className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                        {/* Route Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-xl text-amber-900 mb-2 truncate" title={route.name}>{route.name}</h4>
                            <div className="flex items-center gap-3">
                              <span className="bg-amber-200 px-3 py-1 rounded-full font-medium text-amber-800">Route #{route.route_num}</span>
                              <span className="text-amber-700 font-medium truncate" title={route.direction}>{route.direction}</span>
                              
                            </div>
                          </div>
                         
                        </div>
                        
                        {/* Route Details Grid */}
                         <div className="grid grid-cols-2 gap-4">
                           <div className="bg-white rounded-lg p-3 border border-amber-100">
                             <span className="text-amber-700 font-medium text-sm flex items-center gap-2 mb-1">
                               <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                               Distance: {route.distance} km
                             </span>
                          
                           </div>
                           
                           <div className="bg-white rounded-lg p-3 border border-amber-100">
                             <span className="text-amber-700 font-medium text-sm flex items-center gap-2 mb-1">
                               <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                               Duration: {route.duration} min
                             </span>
                             
                           </div>
                           
                           <div className="bg-white rounded-lg p-3 border border-amber-100">
                             <span className="text-amber-700 font-medium text-sm flex items-center gap-2 mb-1">
                               <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                               Start Time: {formatTime(route.start_time)}
                             </span>
                      
                           </div>
                           
                           <div className="bg-white rounded-lg p-3 border border-amber-100">
                             <span className="text-amber-700 font-medium text-sm flex items-center gap-2 mb-1">
                               <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                               End Time: {formatTime(route.end_time)}
                             </span>
                            
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bus Station Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Bus Station Information</h4>
                    <p className="text-sm text-blue-800">
                      {busStationDetail && busStationDetail.routes && busStationDetail.routes.length > 0 
                        ? 'Bus route information is displayed above. For detailed schedules and real-time updates, please check with the local bus transportation authority.'
                        : 'This is a bus station. Bus schedule information is not currently available through the metro system. For bus schedules and routes, please check with the local bus transportation authority.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MetroMap;