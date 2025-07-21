import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Route,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  Eye,
} from "lucide-react";
import { Modal, Form, Input, InputNumber, Button, message } from "antd";
import {
  apiGetRoutes,
  apiCreateRoute,
  apiUpdateRoute,
  apiDeleteRoute,
  apiSearchRoute,
} from "../../../../apis/route.api";
import type { RoutesResponse, RoutesRequest } from "../../../../types/route.type";
import LoaderContainer from "../../../../components/Loader/LoaderContainer";


export default function RouteManagement() {
  const [form] = Form.useForm();
  const [routes, setRoutes] = useState<RoutesResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RoutesResponse | null>(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RoutesResponse | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await apiGetRoutes();
      if (response?.data) {
        setRoutes(response.data);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchRoutes();
      return;
    }

    setLoading(true);
    try {
      const response = await apiSearchRoute(searchTerm);
      if (response?.data) {
        setRoutes(response.data);
      }
    } catch (error) {
      console.error("Error searching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: RoutesRequest) => {
    try {
      if (editingRoute) {
        const response = await apiUpdateRoute(values, editingRoute.routeId);
        if (response?.data) {
          setRoutes(
            routes.map((r) =>
              r.routeId === editingRoute.routeId ? response.data : r
            )
          );
        }
        message.success("Route updated successfully!");
      } else {
        const response = await apiCreateRoute(values);
        if (response?.data) {
          setRoutes([...routes, response.data]);
        }
        message.success("Route created successfully!");
      }
      
      setShowModal(false);
      form.resetFields();
      setEditingRoute(null);
    } catch (error) {
      console.error("Error saving route:", error);
      message.error(editingRoute ? "Failed to update route" : "Failed to create route");
    }
  };

  const handleEdit = (route: RoutesResponse) => {
    setEditingRoute(route);
    form.setFieldsValue({
      routeName: route.routeName,
      routeCode: route.routeCode,
      distanceInKm: route.distanceInKm,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingRoute(null);
    form.resetFields();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    form.resetFields();
    setEditingRoute(null);
  };

  const handleViewDetails = (route: RoutesResponse) => {
    setSelectedRoute(route);
    setShowDescriptionModal(true);
  };

  const handleDelete = (route: RoutesResponse) => {
    Modal.confirm({
      title: "Delete Route",
      content: (
        <div>
          <p>Are you sure you want to delete this route?</p>
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p><strong>Route Name:</strong> {route.routeName}</p>
            <p><strong>Route Code:</strong> {route.routeCode}</p>
            <p><strong>Distance:</strong> {route.distanceInKm} km</p>
          </div>
          <p className="mt-2 text-red-600 text-sm">This action cannot be undone.</p>
        </div>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await apiDeleteRoute(route.routeId);
          setRoutes(routes.filter((r) => r.routeId !== route.routeId));
          message.success("Route deleted successfully!");
        } catch (error) {
          console.error("Error deleting route:", error);
          message.error("Failed to delete route");
        }
      },
    });
  };

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
              Route Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage metro routes and their information
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Route
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search routes by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
              setSearchTerm("");
              fetchRoutes();
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <div
            key={route.routeId}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Route className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {route.routeName}
                  </h3>
                  <p className="text-sm text-gray-500">{route.routeCode}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(route)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleEdit(route)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(route)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Navigation size={16} />
                <span>Distance: {route.distanceInKm} km</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>Created: {new Date(route.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>Updated: {new Date(route.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {routes.length === 0 && (
        <div className="text-center py-12">
          <Route className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No routes found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Route className="text-blue-600" size={20} />
            <span>{editingRoute ? "Edit Route" : "Add New Route"}</span>
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
            label="Route Name"
            name="routeName"
            rules={[
              { required: true, message: "Please enter route name" },
              { min: 2, message: "Route name must be at least 2 characters" }
            ]}
          >
            <Input placeholder="Enter route name" />
          </Form.Item>

          <Form.Item
            label="Route Code"
            name="routeCode"
            rules={[
              { required: true, message: "Please enter route code" },
              { pattern: /^[A-Z0-9]+$/, message: "Route code should contain only uppercase letters and numbers" }
            ]}
          >
            <Input placeholder="e.g., RT001" />
          </Form.Item>

          <Form.Item
            label="Distance (km)"
            name="distanceInKm"
            rules={[
              { required: true, message: "Please enter distance" },
              { type: "number", min: 0.1, message: "Distance must be greater than 0" }
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="Enter distance in kilometers"
              step={0.1}
              min={0.1}
              precision={1}
            />
          </Form.Item>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="flex-1">
              {editingRoute ? "Update Route" : "Create Route"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Description Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Route className="text-blue-600" size={20} />
            <span>Route Details</span>
          </div>
        }
        open={showDescriptionModal}
        onCancel={() => setShowDescriptionModal(false)}
        footer={null}
        width={600}
      >
        {selectedRoute && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Route size={16} />
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-blue-700 font-medium">Route Name:</span>
                  <p className="text-blue-900 text-lg">{selectedRoute.routeName}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Route Code:</span>
                  <p className="text-blue-900 font-mono">{selectedRoute.routeCode}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Route ID:</span>
                  <p className="text-blue-900">{selectedRoute.routeId}</p>
                </div>
              </div>
            </div>

            {/* Distance Information */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <Navigation size={16} />
                Distance Information
              </h3>
              <div>
                <span className="text-green-700 font-medium">Total Distance:</span>
                <p className="text-green-900 text-2xl font-bold">{selectedRoute.distanceInKm} km</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock size={16} />
                Metadata
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-700 font-medium">Created At:</span>
                  <p className="text-gray-900">{new Date(selectedRoute.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Updated At:</span>
                  <p className="text-gray-900">{new Date(selectedRoute.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}