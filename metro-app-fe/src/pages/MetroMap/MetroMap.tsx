import { Modal } from "antd";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Clock, Map as MapIcon, MapPin, Navigation, CheckCircle, XCircle, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { apiGetRoutes } from "../../apis/route.api";
import { apiGetSchedulesByStation } from "../../apis/schedule.api";
import {
  apiGetBusStation,
  apiGetBusStationDetail,
} from "../../apis/station.api";
import { apiGetStationRoutesByRouteId } from "../../apis/stationeroute.api";
import LoaderContainer from "../../components/Loader/LoaderContainer";
import type { RoutesResponse } from "../../types/route.type";
import type { SchedulesResponse } from "../../types/schedule.type";
import type {
  BusStation,
  BusStationDetail,
  Station,
  StationRouteResponse,
  Status,
} from "../../types/station.type";
import { formatTime } from "../../utils/format.datetime";
import "./MetroMap.css";

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom station icons
const createStationIcon = (status: Status) => {
  let color = "#6b7280"; // default gray
  if (status === "active") {
    color = "#10b981"; // green
  } else if (status === "maintenance") {
    color = "#f59e0b"; // yellow
  } else if (status === "decommissioned") {
    color = "#ef4444"; // red
  }
  
  return L.divIcon({
    className: "custom-station-marker",
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
    popupAnchor: [0, -10],
  });
};

// Custom bus station icons
const createBusStationIcon = (isActive: number) => {
  console.log("test111", isActive);
  const color = isActive === 1 ? "#f59e0b" : "#6b7280";
  return L.divIcon({
    className: "custom-bus-marker",
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
    popupAnchor: [0, -12],
  });
};

const MetroMap: React.FC = () => {
  const [routes, setRoutes] = useState<RoutesResponse[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [stationRoutes, setStationRoutes] = useState<StationRouteResponse[]>([]);
  const [busStations, setBusStations] = useState<BusStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stationRoutesLoading, setStationRoutesLoading] = useState(false);
  const [selectedStationRoute, setSelectedStationRoute] = useState<StationRouteResponse | null>(null);
  const [selectedBusStation, setSelectedBusStation] = useState<BusStation | null>(null);
  const [busStationDetail, setBusStationDetail] = useState<BusStationDetail | null>(null);
  const [busStationDetailLoading, setBusStationDetailLoading] = useState(false);
  const [schedules, setSchedules] = useState<SchedulesResponse[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [mapView, setMapView] = useState<"map" | "schematic">("map");
  const [showBusStations, setShowBusStations] = useState(true);

  // Fetch station routes for selected route
  const fetchStationRoutes = async (routeId: number) => {
    setStationRoutesLoading(true);
    try {
      const response = await apiGetStationRoutesByRouteId(routeId);
      if (response?.data) {
        // Sort by sequence order
        const sortedStationRoutes = response.data.sort((a, b) => a.sequenceOrder - b.sequenceOrder);
        setStationRoutes(sortedStationRoutes);
      } else {
        setStationRoutes([]);
      }
    } catch (error) {
      console.error("Error fetching station routes:", error);
      setStationRoutes([]);
    } finally {
      setStationRoutesLoading(false);
    }
  };

  // Handle route selection
  const handleRouteSelect = (routeId: number) => {
    setSelectedRouteId(routeId);
    setSelectedStationRoute(null);
    setSelectedBusStation(null);
    setSchedules([]);
    fetchStationRoutes(routeId);
  };

  // Fetch schedules for selected station
  const fetchSchedules = async (stationId: number) => {
    console.log("Fetching schedules for station ID:", stationId);
    setSchedulesLoading(true);
    try {
      const response = await apiGetSchedulesByStation(stationId);
      console.log("Schedule API response:", response);
      
      if (response?.data) {
        console.log("Schedules found:", response.data.length, response.data);
        setSchedules(response.data);
      } else {
        console.log("No schedule data in response");
        setSchedules([]);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
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
      console.error("Error fetching bus station details:", error);
      setBusStationDetail(null);
    } finally {
      setBusStationDetailLoading(false);
    }
  };

  // Handle station route selection with schedule fetching
  const handleStationRouteSelect = (stationRoute: StationRouteResponse) => {
    setSelectedStationRoute(stationRoute);
    setSelectedBusStation(null);
    fetchSchedules(stationRoute.stationsResponse.stationId);
  };

  const handleBusStationSelect = (busStation: BusStation) => {
    setSelectedBusStation(busStation);
    setSelectedStationRoute(null);
    setSchedules([]);
    fetchBusStationDetail(busStation.id.toString());
  };

  const handleCloseModal = () => {
    setSelectedStationRoute(null);
    setSelectedBusStation(null);
    setBusStationDetail(null);
    setSchedules([]);
  };

  // Get status badge for station route
  const getStatusBadge = (status: Status) => {
    const isActive = status === "active";
    const isDecommissioned = status === "decommissioned";
    const isMaintenance = status === "maintenance";
    
    let badgeClass = "";
    let icon = null;
    let text = "";
    
    if (isActive) {
      badgeClass = "bg-green-100 text-green-800";
      icon = <CheckCircle size={12} />;
      text = "Active";
    } else if (isDecommissioned) {
      badgeClass = "bg-red-100 text-red-800";
      icon = <XCircle size={12} />;
      text = "Decommissioned";
    } else if (isMaintenance) {
      badgeClass = "bg-yellow-100 text-yellow-800";
      icon = <Settings size={12} />;
      text = "Maintenance";
    } else {
      badgeClass = "bg-gray-100 text-gray-800";
      icon = <XCircle size={12} />;
      text = "Unknown";
    }
    
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
      >
        {icon}
        {text}
      </span>
    );
  };

  // Get displayed bus stations
  const getDisplayedBusStations = (): BusStation[] => {
    if (!showBusStations) return [];

    return busStations.filter((busStation) => {
      return busStation.latitude && busStation.longitude;
    });
  };

  // Calculate map center based on station routes and bus stations
  const getMapCenter = (): [number, number] => {
    const displayedBusStations = getDisplayedBusStations();
    const stationCoords = stationRoutes
      .filter(sr => sr.stationsResponse.latitude && sr.stationsResponse.longitude)
      .map(sr => ({ latitude: sr.stationsResponse.latitude, longitude: sr.stationsResponse.longitude }));
    
    const allStations = [...stationCoords, ...displayedBusStations];
    if (allStations.length === 0) return [10.8231, 106.6297]; // Default to Ho Chi Minh City

    const validStations = allStations.filter((s) => s.latitude && s.longitude);
    if (validStations.length === 0) return [10.8231, 106.6297];

    const avgLat =
      validStations.reduce((sum, station) => sum + station.latitude, 0) /
      validStations.length;
    const avgLng =
      validStations.reduce((sum, station) => sum + station.longitude, 0) /
      validStations.length;

    return [avgLat, avgLng];
  };

  // Create polyline coordinates for route visualization
  const getRoutePolylines = () => {
    if (!selectedRouteId || stationRoutes.length === 0) return [];

    const coordinates: [number, number][] = stationRoutes
      .filter((sr) => sr.stationsResponse.latitude && sr.stationsResponse.longitude)
      .map((sr) => [sr.stationsResponse.latitude, sr.stationsResponse.longitude]);

    if (coordinates.length < 2) return [];

    const selectedRoute = routes.find(r => r.routeId === selectedRouteId);
    
    return [{
      routeId: selectedRouteId,
      coordinates,
      route: selectedRoute,
    }];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [routesResponse, busStationsResponse] = await Promise.all([
          apiGetRoutes(),
          apiGetBusStation(),
        ]);

        if (routesResponse?.data) {
          setRoutes(routesResponse.data);
        }

        if (busStationsResponse?.data) {
          setBusStations(busStationsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching metro data:", error);
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
              onClick={() => setMapView("map")}
              className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center ${
                mapView === "map"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Interactive Map
            </button>
            <button
              onClick={() => setMapView("schematic")}
              className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center ${
                mapView === "schematic"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Schematic View
            </button>
          </div>
        </div>

        {/* Route Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Navigation className="w-6 h-6 mr-2 text-blue-600" />
            Select Metro Route
          </h2>
          <p className="text-gray-600 mb-4">
            Choose a metro route to view its stations and real-time information
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route) => (
              <button
                key={route.routeId}
                onClick={() => handleRouteSelect(route.routeId)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedRouteId === route.routeId
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {route.routeName}
                  </h3>
                  {selectedRouteId === route.routeId && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {route.description || "Metro route"}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {selectedRouteId === route.routeId && stationRoutes.length > 0
                    ? `${stationRoutes.length} stations`
                    : "Click to view stations"}
                </div>
              </button>
            ))}
          </div>

          {selectedRouteId && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">
                    {routes.find(r => r.routeId === selectedRouteId)?.routeName} Selected
                  </h4>
                  <p className="text-sm text-blue-700">
                    {stationRoutesLoading 
                      ? "Loading stations..." 
                      : `${stationRoutes.length} stations loaded`}
                  </p>
                </div>
                {stationRoutesLoading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Interactive Map View */}
          {mapView === "map" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapIcon className="w-6 h-6 mr-2 text-blue-600" />
                Interactive Metro Map
              </h2>

              {!selectedRouteId ? (
                <div className="h-96 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <MapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Select a Route to View Stations
                    </h3>
                    <p className="text-gray-500">
                      Choose a metro route above to see its stations on the map
                    </p>
                  </div>
                </div>
              ) : (
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
                        Showing {getDisplayedBusStations().length} of{" "}
                        {busStations.length} bus stations
                      </div>
                    )}
                  </div>
                </div>

                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
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

                  {/* Station Route Markers */}
                  {stationRoutes
                    .filter((sr) => sr.stationsResponse.latitude && sr.stationsResponse.longitude)
                    .map((stationRoute) => (
                      <Marker
                        key={stationRoute.id}
                        position={[stationRoute.stationsResponse.latitude, stationRoute.stationsResponse.longitude]}
                        icon={createStationIcon(stationRoute.status)}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold text-lg mb-2">
                              {stationRoute.stationsResponse.name}
                            </h3>
                            <div className="space-y-1 text-sm">
                              <p>
                                <strong>Code:</strong> {stationRoute.stationsResponse.stationCode}
                              </p>
                              <p>
                                <strong>Sequence:</strong> {stationRoute.sequenceOrder}
                              </p>
                              <p>
                                <strong>Status:</strong>
                                <span className="ml-1">
                                  {getStatusBadge(stationRoute.status)}
                                </span>
                              </p>
                              <p>
                                <strong>Route:</strong>{" "}
                                {routes.find(r => r.routeId === selectedRouteId)?.routeName}
                              </p>
                              {stationRoute.stationsResponse.address && (
                                <p>
                                  <strong>Address:</strong> {stationRoute.stationsResponse.address}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleStationRouteSelect(stationRoute)}
                              className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                  {/* Bus Station Markers */}
                  {getDisplayedBusStations().map((busStation) => (
                    <Marker
                      key={busStation.id}
                      position={[busStation.latitude, busStation.longitude]}
                      icon={createBusStationIcon(busStation.isActive)}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-lg mb-2">
                            {busStation.name}
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p>
                              <strong>Code:</strong> {busStation.code}
                            </p>
                            <p>
                              <strong>Status:</strong>
                              <span
                                className={`ml-1 font-medium ${
                                  busStation.isActive === 1
                                    ? "text-amber-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {busStation.isActive === 1 ? "Active" : "Inactive"}
                              </span>
                            </p>
                            <p>
                              <strong>Type:</strong> Bus Station
                            </p>
                            {busStation.address && (
                              <p>
                                <strong>Address:</strong> {busStation.address}
                              </p>
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
                  ))}
                </MapContainer>
              </div>
              )}
            </div>
          )}




        </div>

        {/* Station Details Modal */}
        <Modal
          title={
            selectedStationRoute
              ? `${selectedStationRoute.stationsResponse.name} Details`
              : selectedBusStation
              ? `${selectedBusStation.name} Details`
              : "Station Details"
          }
          open={!!(selectedStationRoute || selectedBusStation)}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
        >
          {selectedStationRoute && (
            <div className="space-y-6">
              {/* Station Info */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Station Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-700 font-medium">Name</p>
                    <p className="text-green-900 text-lg">{selectedStationRoute.stationsResponse.name}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Code</p>
                    <p className="text-green-900 font-mono">{selectedStationRoute.stationsResponse.stationCode}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Address</p>
                    <p className="text-green-900">{selectedStationRoute.stationsResponse.address}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Sequence Order</p>
                    <p className="text-green-900">{selectedStationRoute.sequenceOrder}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Latitude</p>
                    <p className="text-green-900">{selectedStationRoute.stationsResponse.latitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Longitude</p>
                    <p className="text-green-900">{selectedStationRoute.stationsResponse.longitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Status</p>
                    <div className="text-green-900">{getStatusBadge(selectedStationRoute.status)}</div>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Route</p>
                    <p className="text-green-900">{routes.find(r => r.routeId === selectedRouteId)?.routeName}</p>
                  </div>
                </div>
              </div>

              {/* Schedules */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Train Schedules
                  {/* Debug info */}
                  <span className="ml-2 text-xs text-blue-600 font-normal">
                    (Station ID: {selectedStationRoute.stationsResponse.stationId})
                  </span>
                </h3>
                
                {/* Debug button */}
                <button
                  onClick={() => fetchSchedules(selectedStationRoute.stationsResponse.stationId)}
                  className="mb-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  🔄 Refresh Schedules
                </button>
                
                {schedulesLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : schedules.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {schedules.map((schedule) => (
                      <div
                        key={schedule.scheduleId}
                        className="bg-white rounded p-3 text-sm border border-blue-200"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-blue-900">
                            Departure: {formatTime(schedule.timeDeparture)}
                          </span>
                          <span className="text-blue-700">
                            Arrival: {formatTime(schedule.timeArrival)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-blue-600">
                          <span className={`px-2 py-1 rounded ${
                            schedule.direction === 'forward' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {schedule.direction === 'forward' ? '→ Forward' : '← Backward'}
                          </span>
                          {schedule.description && (
                            <span className="italic">{schedule.description}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-blue-700">No schedules available for this station.</p>
                )}
              </div>
            </div>
          )}

          {selectedBusStation && busStationDetail && (
            <div className="space-y-6">
              {/* Bus Station Info */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Bus Station Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-amber-700 font-medium">Name</p>
                    <p className="text-amber-900 text-lg">{busStationDetail.name}</p>
                  </div>
                  <div>
                    <p className="text-amber-700 font-medium">Code</p>
                    <p className="text-amber-900 font-mono">{busStationDetail.code}</p>
                  </div>
                  <div>
                    <p className="text-amber-700 font-medium">Address</p>
                    <p className="text-amber-900">{busStationDetail.address}</p>
                  </div>
                  <div>
                    <p className="text-amber-700 font-medium">Status</p>
                    <p className="text-amber-900">
                      {busStationDetail.isActive === 1 ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-700 font-medium">Latitude</p>
                    <p className="text-amber-900">{busStationDetail.latitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-amber-700 font-medium">Longitude</p>
                    <p className="text-amber-900">{busStationDetail.longitude.toFixed(6)}</p>
                  </div>
                </div>
              </div>

              {/* Bus Routes */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  Bus Routes
                </h3>
                {busStationDetail.routes && busStationDetail.routes.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {busStationDetail.routes.map((route) => (
                      <div
                        key={route.id}
                        className="bg-white rounded p-3 text-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-amber-900">
                            {route.name} ({route.route_num})
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              route.is_active === 1
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {route.is_active === 1 ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="text-amber-700">
                          <p>Distance: {route.distance} km</p>
                          <p>Duration: {route.duration} min</p>
                          <p>
                            Schedule: {route.start_time} - {route.end_time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-amber-700">No bus routes available for this station.</p>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MetroMap;
