import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Route,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Modal, Form, Select, InputNumber, Button, message } from "antd";
import {
  apiGetStationRoutesByRouteId,
  apiSaveStationRoute,
  apiUpdateStationRoute,
  apiDeleteStationRoute,
  apiUpdateStationRouteStatus,
} from "../../../../apis/stationeroute.api";
import { apiGetRoutes } from "../../../../apis/route.api";
import { apiGetStations } from "../../../../apis/station.api";
import type {
  StationRouteResponse,
  StationRouteRequest,
  Station,
  Status,
} from "../../../../types/station.type";
import type { RoutesResponse } from "../../../../types/route.type";
import LoaderContainer from "../../../../components/Loader/LoaderContainer";


export default function StationRouteManagement() {
  const [form] = Form.useForm();
  const [stationRoutes, setStationRoutes] = useState<StationRouteResponse[]>([]);
  const [routes, setRoutes] = useState<RoutesResponse[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStationRoute, setEditingStationRoute] = useState<StationRouteResponse | null>(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedStationRoute, setSelectedStationRoute] = useState<StationRouteResponse | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedRouteId) {
      fetchStationRoutes(selectedRouteId);
    }
  }, [selectedRouteId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [routesResponse, stationsResponse] = await Promise.all([
        apiGetRoutes(),
        apiGetStations(),
      ]);

      if (routesResponse?.data) {
        setRoutes(routesResponse.data);
        if (routesResponse.data.length > 0) {
          setSelectedRouteId(routesResponse.data[0].routeId);
        }
      }

      if (stationsResponse?.data) {
        setStations(stationsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStationRoutes = async (routeId: number) => {
    try {
      const response = await apiGetStationRoutesByRouteId(routeId);
      if (response?.data) {
        setStationRoutes(response.data);
      }
    } catch (error) {
      console.error("Error fetching station routes:", error);
    }
  };

  const handleSubmit = async (values: StationRouteRequest) => {
    try {
      if (editingStationRoute) {
        await apiUpdateStationRoute(editingStationRoute.id, values);
        message.success("Station route updated successfully!");
      } else {
        const response = await apiSaveStationRoute(values);
        if (response?.data) {
          message.success("Station route created successfully!");
        } else {
          message.error("Failed to create station route");
        }
      }
      
      setShowModal(false);
      form.resetFields();
      setEditingStationRoute(null);
      if (selectedRouteId) {
        fetchStationRoutes(selectedRouteId);
      }
    } catch (error) {
      console.error("Error submitting station route:", error);
      message.error(editingStationRoute ? "Failed to update station route" : "Failed to create station route");
    }
  };

  const handleEdit = (stationRoute: StationRouteResponse) => {
    setEditingStationRoute(stationRoute);
    form.setFieldsValue({
      routeId: stationRoute.RouteId,
      stationId: stationRoute.stationsResponse.stationId,
      sequenceOrder: stationRoute.sequenceOrder,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingStationRoute(null);
    form.resetFields();
    if (selectedRouteId) {
      form.setFieldsValue({ routeId: selectedRouteId });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    form.resetFields();
    setEditingStationRoute(null);
  };

  const handleDelete = (stationRoute: StationRouteResponse) => {
    Modal.confirm({
      title: "Delete Station Route",
      content: (
        <div>
          <p>Are you sure you want to delete this station route?</p>
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p><strong>Station:</strong> {stationRoute.stationsResponse?.name || 'Unknown'}</p>
            <p><strong>Route ID:</strong> {stationRoute.RouteId}</p>
            <p><strong>Sequence Order:</strong> {stationRoute.sequenceOrder}</p>
          </div>
          <p className="mt-2 text-red-600 text-sm">This action cannot be undone.</p>
        </div>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await apiDeleteStationRoute(stationRoute.id);
          setStationRoutes(stationRoutes.filter((sr) => sr.id !== stationRoute.id));
          message.success("Station route deleted successfully!");
        } catch (error) {
          console.error("Error deleting station route:", error);
          message.error("Failed to delete station route");
        }
      },
    });
  };

  const handleStatusToggle = async (id: number, currentStatus: Status) => {
    // Cycle through status values: active -> maintenance -> decommissioned -> active
    let newStatus: Status;
    if (currentStatus === "active") {
      newStatus = "maintenance";
    } else if (currentStatus === "maintenance") {
      newStatus = "decommissioned";
    } else {
      newStatus = "active";
    }
    
    try {
      const response = await apiUpdateStationRouteStatus(id, newStatus);
      if (response?.data) {
        // Update the station route status in the local state
        setStationRoutes(
          stationRoutes.map((sr) =>
            sr.id === id ? { ...sr, status: newStatus } : sr
          )
        );
        message.success(`Status updated to ${newStatus}!`);
      } else {
        message.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status");
    }
  };

  const handleViewDetails = (stationRoute: StationRouteResponse) => {
    setSelectedStationRoute(stationRoute);
    setShowDescriptionModal(true);
  };

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
      icon = <Clock size={12} />;
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

  const selectedRoute = routes.find(r => r.routeId === selectedRouteId);
  const sortedStationRoutes = [...stationRoutes].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  if (loading) {
    return <LoaderContainer />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Station Route Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage station assignments to routes and their sequence order
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            disabled={!selectedRouteId}
          >
            <Plus size={20} />
            Add Station to Route
          </button>
        </div>

        {/* Route Selection */}
        <div className="flex gap-3 items-center">
          <label className="text-sm font-medium text-gray-700">Select Route:</label>
          <select
            value={selectedRouteId || ""}
            onChange={(e) => setSelectedRouteId(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a route</option>
            {routes.map((route) => (
              <option key={route.routeId} value={route.routeId}>
                {route.routeName} ({route.routeCode})
              </option>
            ))}
          </select>
          {selectedRoute && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Route size={16} />
              <span>{selectedRoute.distanceInKm} km</span>
            </div>
          )}
        </div>
      </div>

      {/* Station Routes List */}
      {selectedRouteId ? (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Stations on {selectedRoute?.routeName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {sortedStationRoutes.length} stations assigned
            </p>
          </div>

          {sortedStationRoutes.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {sortedStationRoutes.map((stationRoute, index) => (
                <div key={stationRoute.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {stationRoute.sequenceOrder}
                          </span>
                        </div>
                        {index < sortedStationRoutes.length - 1 && (
                          <ArrowRight className="text-gray-400" size={16} />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <MapPin className="text-green-600" size={16} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {stationRoute.stationsResponse.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {stationRoute.stationsResponse.stationCode} • {stationRoute.stationsResponse.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(stationRoute.status)}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(stationRoute)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleStatusToggle(stationRoute.id, stationRoute.status)}
                          className={`p-2 rounded-lg transition-colors ${
                            stationRoute.status === "active"
                              ? "text-yellow-600 hover:bg-yellow-50"
                              : stationRoute.status === "maintenance"
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={
                            stationRoute.status === "active"
                              ? "Set to Maintenance"
                              : stationRoute.status === "maintenance"
                              ? "Set to Decommissioned"
                              : "Set to Active"
                          }
                        >
                          {stationRoute.status === "active" ? (
                            <Clock size={16} />
                          ) : stationRoute.status === "maintenance" ? (
                            <XCircle size={16} />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(stationRoute)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(stationRoute)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 ml-12 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>Created: {new Date(stationRoute.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>Updated: {new Date(stationRoute.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No stations assigned to this route</p>
              <button
                onClick={handleAdd}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Add the first station
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Route className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">Please select a route to manage its stations</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} />
            <span>{editingStationRoute ? "Edit Station Route" : "Add Station to Route"}</span>
          </div>
        }
        open={showModal}
        onCancel={handleCloseModal}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Route"
            name="routeId"
            rules={[{ required: true, message: "Please select a route" }]}
          >
            <Select
              placeholder="Select a route"
              showSearch
              optionFilterProp="children"
            >
              {routes.map((route) => (
                <Select.Option key={route.routeId} value={route.routeId}>
                  {route.routeName} ({route.routeCode})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Station"
            name="stationId"
            rules={[{ required: true, message: "Please select a station" }]}
          >
            <Select
              placeholder="Select a station"
              showSearch
              optionFilterProp="children"
            >
              {stations.map((station) => (
                <Select.Option key={station.stationId} value={station.stationId}>
                  {station.name} ({station.stationCode})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Sequence Order"
            name="sequenceOrder"
            rules={[
              { required: true, message: "Please enter sequence order" },
              { type: "number", min: 1, message: "Sequence order must be at least 1" }
            ]}
            extra="Order in which this station appears on the route"
          >
            <InputNumber
              className="w-full"
              placeholder="Enter sequence order"
              min={1}
            />
          </Form.Item>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="flex-1">
              {editingStationRoute ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Description Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} />
            <span>Station Route Details</span>
          </div>
        }
        open={showDescriptionModal}
        onCancel={() => setShowDescriptionModal(false)}
        footer={null}
        width={600}
      >
        {selectedStationRoute && (
          <div className="space-y-6">
            {/* Route Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Route size={16} />
                Route Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Route ID:</span>
                  <p className="text-blue-900">{selectedStationRoute.RouteId}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Sequence Order:</span>
                  <p className="text-blue-900">{selectedStationRoute.sequenceOrder}</p>
                </div>
              </div>
            </div>

            {/* Station Information */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Station Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-green-700 font-medium">Station Name:</span>
                  <p className="text-green-900 text-lg">{selectedStationRoute.stationsResponse.name}</p>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Station Code:</span>
                  <p className="text-green-900 font-mono">{selectedStationRoute.stationsResponse.stationCode}</p>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Address:</span>
                  <p className="text-green-900">{selectedStationRoute.stationsResponse.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-green-700 font-medium">Latitude:</span>
                    <p className="text-green-900">{selectedStationRoute.stationsResponse.latitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Longitude:</span>
                    <p className="text-green-900">{selectedStationRoute.stationsResponse.longitude.toFixed(6)}</p>
                  </div>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Station Status:</span>
                  <p className="text-green-900">{selectedStationRoute.stationsResponse.status}</p>
                </div>
              </div>
            </div>

            {/* Status and Metadata */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle size={16} />
                Status & Metadata
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-700 font-medium">Status:</span>
                  <div className="mt-1">
                    {getStatusBadge(selectedStationRoute.status)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Is Deleted:</span>
                  <p className="text-gray-900">{selectedStationRoute.isDeleted ? "Yes" : "No"}</p>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Created At:</span>
                  <p className="text-gray-900">{new Date(selectedStationRoute.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Updated At:</span>
                  <p className="text-gray-900">{new Date(selectedStationRoute.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}