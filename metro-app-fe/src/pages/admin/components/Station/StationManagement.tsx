import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RotateCcw,
  Settings,
} from "lucide-react";
import { Modal, Form, Input, InputNumber, Button, message } from "antd";
import {
  apiGetStations,
  apiCreateStation,
  apiUpdateStation,
  apiDeleteStation,
  apiGetStationByName,
  apiUpdateStationStatus,
} from "../../../../apis/station.api";
import type { Station, StationRequest, Status } from "../../../../types/station.type";
import LoaderContainer from "../../../../components/Loader/LoaderContainer";

export default function StationManagement() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [form] = Form.useForm();

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
      console.error("Error fetching stations:", error);
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
      console.error("Error searching stations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: StationRequest) => {
    try {
      if (editingStation) {
        // Update existing station - use StationRequest type for update
        const updateData: StationRequest = {
          stationCode: values.stationCode,
          name: values.name,
          address: values.address,
          latitude: values.latitude,
          longitude: values.longitude,
        };
        const response = await apiUpdateStation(updateData, editingStation.stationId);
        if (response?.data) {
          setStations(
            stations.map((s) =>
              s.stationId === editingStation.stationId ? response.data : s
            )
          );
          message.success("Station updated successfully!");
        }
      } else {
        // Create new station
        const response = await apiCreateStation(values);
        if (response?.data) {
          setStations([...stations, response.data]);
          message.success("Station created successfully!");
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving station:", error);
      message.error("Failed to save station. Please try again.");
    }
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
    form.setFieldsValue({
      stationCode: station.stationCode,
      name: station.name,
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingStation(null);
    form.resetFields();
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingStation(null);
    form.resetFields();
  };

  const handleViewDetails = (station: Station) => {
    setSelectedStation(station);
    setShowDescriptionModal(true);
  };

  const handleDelete = async (station: Station) => {
    Modal.confirm({
      title: 'Xóa trạm',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa đài này không?</p>
          <div className="mt-2 p-3 bg-gray-50 rounded">
            <p><strong>Ga tàu:</strong> {station.name}</p>
            <p><strong>Mã số:</strong> {station.stationCode}</p>
            <p><strong>Địa chỉ:</strong> {station.address}</p>
          </div>
          <p className="mt-2 text-red-600 text-sm">Hành động này không thể hoàn tác.</p>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await apiDeleteStation(station.stationId);
          setStations(stations.filter((s) => s.stationId !== station.stationId));
          message.success("Station deleted successfully!");
        } catch (error) {
          console.error("Error deleting station:", error);
          message.error("Failed to delete station. Please try again.");
        }
      },
    });
  };

  const handleStatusToggle = async (station: Station) => {
    // Cycle through status values: active -> maintenance -> decommissioned -> active
    const statusCycle: Status[] = ['active', 'maintenance', 'decommissioned'];
    const currentIndex = statusCycle.indexOf(station.status as Status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    Modal.confirm({
      title: 'Cập nhật trạng thái trạm',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn thay đổi trạng thái của đài không?</p>
          <div className="mt-2 p-3 bg-gray-50 rounded">
            <p><strong>Ga tàu:</strong> {station.name}</p>
            <p><strong>Trạng thái hiện tại:</strong> {station.status}</p>
            <p><strong>Trạng thái mới:</strong> {nextStatus}</p>
          </div>
        </div>
      ),
      okText: 'Cập nhật',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await apiUpdateStationStatus(station.stationId, nextStatus);
          if (response?.data) {
            setStations(
              stations.map((s) =>
                s.stationId === station.stationId 
                  ? { ...s, status: nextStatus }
                  : s
              )
            );
            message.success(`Station status updated to ${nextStatus}!`);
          }
        } catch (error) {
          console.error("Error updating station status:", error);
          message.error("Failed to update station status. Please try again.");
        }
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === "active";
    const isDecommissioned = status === "decommissioned";
    const isMaintenance = status === "maintenance";
    
    let badgeClass = "";
    let icon = null;
    let text = "";
    
    if (isActive) {
      badgeClass = "bg-green-100 text-green-800";
      icon = <CheckCircle size={12} />;
      text = "Hoạt động";
    } else if (isDecommissioned) {
      badgeClass = "bg-red-100 text-red-800";
      icon = <XCircle size={12} />;
      text = "Đã ngừng hoạt động";
    } else if (isMaintenance) {
      badgeClass = "bg-yellow-100 text-yellow-800";
      icon = <Clock size={12} />;
      text = "Bảo trì";
    } else {
      badgeClass = "bg-gray-100 text-gray-800";
      icon = <XCircle size={12} />;
      text = "Không xác định";
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý trạm
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các nhà ga tàu điện và thông tin của họ
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Thêm trạm
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
              placeholder="Tìm kiếm các trạm theo tên..."
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
            Tìm kiếm
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              fetchStations();
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Stations Grid */}
      {loading ? (
        <LoaderContainer />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <div
              key={station.stationId}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {station.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-mono">
                      {station.stationCode}
                    </p>
                  </div>
                  {getStatusBadge(station.status)}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    <span className="text-gray-700">{station.address}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Vĩ độ:</span>
                      <p className="font-medium text-gray-900">
                        {station.latitude.toFixed(6)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Kinh độ:</span>
                      <p className="font-medium text-gray-900">
                        {station.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>
                      Đã cập nhật: {new Date(station.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleViewDetails(station)}
                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <Eye size={16} />
                    Chi tiết
                  </button>
                  <button
                    onClick={() => handleStatusToggle(station)}
                    className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm ${
                      station.status === 'active' 
                        ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
                        : station.status === 'maintenance'
                        ? 'bg-red-50 hover:bg-red-100 text-red-700'
                        : 'bg-green-50 hover:bg-green-100 text-green-700'
                    }`}
                    title={`Thay đổi trạng thái từ ${station.status}`}
                  >
                    {station.status === 'active' ? (
                      <Settings size={16} />
                    ) : station.status === 'maintenance' ? (
                      <XCircle size={16} />
                    ) : (
                      <RotateCcw size={16} />
                    )}
                    Trạng thái
                  </button>
                  <button
                    onClick={() => handleEdit(station)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <Edit size={16} />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(station)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    Xóa
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy trạm nào
          </h3>
          <p className="text-gray-600">
            Bắt đầu bằng cách thêm trạm đầu tiên của bạn
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} />
            <span>{editingStation ? "Chỉnh sửa trạm" : "Thêm trạm mới"}</span>
          </div>
        }
        open={showForm}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Mã trạm"
            name="stationCode"
            rules={[
              { required: true, message: "Vui lòng nhập mã trạm" },
              { pattern: /^[A-Z0-9]+$/, message: "Mã trạm chỉ được chứa chữ in hoa và số" }
            ]}
          >
            <Input placeholder="e.g., ST001" />
          </Form.Item>

          <Form.Item
            label="Tên trạm"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên trạm" },
              { min: 2, message: "Tên trạm phải có ít nhất 2 ký tự" }
            ]}
          >
            <Input placeholder="Nhập tên trạm" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ" },
              { min: 10, message: "Địa chỉ phải có ít nhất 10 ký tự" }
            ]}
          >
            <Input.TextArea rows={3} placeholder="Nhập địa chỉ đầy đủ" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Vĩ độ"
              name="latitude"
              rules={[
                { required: true, message: "Vui lòng nhập vĩ độ" },
                { type: "number", min: -90, max: 90, message: "Vĩ độ phải nằm trong khoảng từ -90 đến 90" }
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="0.000000"
                step={0.000001}
                precision={6}
              />
            </Form.Item>

            <Form.Item
              label="Kinh độ"
              name="longitude"
              rules={[
                { required: true, message: "Vui lòng nhập kinh độ" },
                { type: "number", min: -180, max: 180, message: "Kinh độ phải nằm trong khoảng từ -180 đến 180" }
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="0.000000"
                step={0.000001}
                precision={6}
              />
            </Form.Item>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCloseModal} className="flex-1">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" className="flex-1">
              {editingStation ? "Cập nhật trạm" : "Tạo trạm"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Description Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} />
            <span>Chi tiết trạm</span>
          </div>
        }
        open={showDescriptionModal}
        onCancel={() => setShowDescriptionModal(false)}
        footer={null}
        width={600}
      >
        {selectedStation && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Thông tin cơ bản
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-blue-700 font-medium">Tên trạm:</span>
                  <p className="text-blue-900 text-lg">{selectedStation.name}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Mã trạm:</span>
                  <p className="text-blue-900 font-mono">{selectedStation.stationCode}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Địa chỉ:</span>
                  <p className="text-blue-900">{selectedStation.address}</p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Tọa độ vị trí
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-green-700 font-medium">Vĩ độ:</span>
                  <p className="text-green-900 font-mono">{selectedStation.latitude.toFixed(6)}</p>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Kinh độ:</span>
                  <p className="text-green-900 font-mono">{selectedStation.longitude.toFixed(6)}</p>
                </div>
              </div>
            </div>

            {/* Status and Metadata */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle size={16} />
                Trạng thái & Metadata
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-700 font-medium">Trạng thái:</span>
                  <div className="mt-1">
                    {getStatusBadge(selectedStation.status)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">ID trạm:</span>
                  <p className="text-gray-900">{selectedStation.stationId}</p>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Được tạo vào lúc:</span>
                  <p className="text-gray-900">{new Date(selectedStation.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Cập nhật vào lúc:</span>
                  <p className="text-gray-900">{new Date(selectedStation.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
