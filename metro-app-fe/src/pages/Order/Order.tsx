import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  NodeIndexOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Card, Col, Divider, Row, Typography, Tag, Space } from "antd";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { apiCreateOrderDays, apiCreateOrderSingle } from "../../apis/order.api";
import { apiCreatePaypalPayment } from "../../apis/paypal.api";
import { apiCreateVnPayPayment } from "../../apis/vnpay.api";
import LoaderContainer from "../../components/Loader/LoaderContainer";
import Button from "../../components/Minh/Button";
import { FE_PATH } from "../../constants/path";
import type {
  OrderPageState,
  OrderTicketDaysRequest,
  OrderTicketSingleRequest,
} from "../../types/order.type";
const { Title, Text } = Typography;

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderPageState | null>(null);

  useEffect(() => {
    // Get order data from navigation state
    const state = location.state as OrderPageState;
    if (!state || !state.selectedPaymentMethod) {
      toast.error("Không có dữ liệu. Trở về trang mua vé");
      navigate(FE_PATH.BUY_TICKET);
      return;
    }
    setOrderData(state);
  }, [location.state, navigate]);

  const handlePayment = async () => {
    if (!orderData || !orderData.selectedPaymentMethod) {
      toast.error("Không có phương thức thanh toán");
      return;
    }

    setLoading(true);
    let createdOrderId: number;

    try {
      // Create order first and get the order ID
      if (orderData.orderType === "pass") {
        const response = await apiCreateOrderDays(
          orderData.orderRequest as OrderTicketDaysRequest
        );
        if (response?.data) {
          createdOrderId = response.data.orderId;
        } else {
          toast.error("Tạo đơn thất bại: " + response?.message);
          setLoading(false);
          return;
        }
      } else {
        const response = await apiCreateOrderSingle(
          orderData.orderRequest as OrderTicketSingleRequest
        );
        if (response?.data) {
          createdOrderId = response.data.orderId;
        } else {
          toast.error("Tạo đơn thất bại: " + response?.message);
          setLoading(false);
          return;
        }
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(
        error?.response?.message || "Có lỗi gì đó bất thường!"
      );
      setLoading(false);
      return;
    }

    // Now proceed with payment using the created order ID
    const selectedMethod = orderData.selectedPaymentMethod;
    try {
      let paymentResponse;

      if (selectedMethod.paymentMethodName.toLowerCase().includes("vnpay")) {
        paymentResponse = await apiCreateVnPayPayment(createdOrderId);
        if (paymentResponse?.data) {
          // Redirect to VNPay payment URL
          window.location.href = paymentResponse.data.paymentUrl;
          return;
        }
      } else if (
        selectedMethod.paymentMethodName.toLowerCase().includes("paypal")
      ) {
        paymentResponse = await apiCreatePaypalPayment(createdOrderId);
        if (paymentResponse?.data) {
          // Redirect to PayPal approval URL
          window.location.href = paymentResponse.data.approvalLink;
          return;
        }
      }

      if (!paymentResponse) {
        toast.error("Không thể khởi tạo thanh toán");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.message ||
          "Khởi tạo thanh toán thất bại. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!orderData) return 0;
    return orderData.amount * (orderData.quantity || 1);
  };

  if (!orderData) {
    return <LoaderContainer />;
  }

  return (
    <div style={{ minHeight: "100vh", padding: "2rem 0" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Title
            level={1}
            style={{
              color: "#059669",
              marginBottom: "0.5rem",
              fontSize: "2.5rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #059669, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Xác nhận thanh toán
          </Title>
          <Text
            style={{
              fontSize: "1.125rem",
              color: "#6b7280",
              fontWeight: "400",
            }}
          >
            Xem chi tiết vé
          </Text>
        </div>

        <Row gutter={[32, 32]}>
          {/* Order Summary */}
          <Col xs={24} lg={14}>
            <Card
              style={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                marginBottom: "2rem",
                background: "#ffffff",
                overflow: "hidden",
              }}
              bodyStyle={{ padding: "2rem" }}
            >
              <Title
                level={3}
                style={{
                  color: "#059669",
                  marginBottom: "1.5rem",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CheckCircleOutlined
                  style={{ marginRight: "0.5rem", fontSize: "1.25rem" }}
                />
                Tổng hợp
              </Title>

              {orderData.orderType === "single" ? (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                      padding: "1.5rem",
                      borderRadius: "12px",
                      border: "1px solid #d1fae5",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <EnvironmentOutlined
                        style={{
                          color: "#059669",
                          marginRight: "0.5rem",
                          fontSize: "1.125rem",
                        }}
                      />
                      <Text
                        strong
                        style={{
                          color: "#047857",
                          fontSize: "1.125rem",
                          fontWeight: "600",
                        }}
                      >
                        Single Journey Ticket
                      </Text>
                    </div>

                    {/* Route Information */}
                    {orderData.routeInfo && (
                      <div style={{ marginBottom: "1.5rem" }}>
                        <div
                          style={{
                            background: "#ffffff",
                            padding: "1rem",
                            borderRadius: "8px",
                            border: "1px solid #d1fae5",
                            marginBottom: "1rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <NodeIndexOutlined
                              style={{
                                color: "#059669",
                                marginRight: "0.5rem",
                                fontSize: "1rem",
                              }}
                            />
                            <Text
                              strong
                              style={{
                                color: "#047857",
                                fontSize: "1rem",
                                fontWeight: "600",
                              }}
                            >
                              Route Information
                            </Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Tag
                              color="green"
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: "500",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "6px",
                              }}
                            >
                              {orderData.routeInfo.routeCode}
                            </Tag>
                            <Text
                              style={{
                                fontSize: "1rem",
                                color: "#374151",
                                fontWeight: "500",
                              }}
                            >
                              {orderData.routeInfo.routeName}
                            </Text>
                          </div>
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        gap: "1rem",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div>
                        <Text
                          style={{
                            fontSize: "0.875rem",
                            color: "#6b7280",
                            fontWeight: "500",
                          }}
                        >
                          From:
                        </Text>
                        <div
                          style={{
                            fontWeight: "600",
                            fontSize: "1rem",
                            color: "#1f2937",
                            marginTop: "0.25rem",
                          }}
                        >
                          {orderData.startStation?.name}
                        </div>
                        <Text style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                          ({orderData.startStation?.stationCode})
                        </Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0.5rem",
                        }}
                      >
                        <RightOutlined
                          style={{
                            color: "#059669",
                            fontSize: "1.25rem",
                            fontWeight: "bold",
                          }}
                        />
                      </div>
                      <div>
                        <Text
                          style={{
                            fontSize: "0.875rem",
                            color: "#6b7280",
                            fontWeight: "500",
                          }}
                        >
                          To:
                        </Text>
                        <div
                          style={{
                            fontWeight: "600",
                            fontSize: "1rem",
                            color: "#1f2937",
                            marginTop: "0.25rem",
                          }}
                        >
                          {orderData.endStation?.name}
                        </div>
                        <Text style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                          ({orderData.endStation?.stationCode})
                        </Text>
                      </div>
                    </div>

                    {/* Journey Details */}
                    {orderData.journeyDetails && (
                      <div style={{ marginBottom: "1.5rem" }}>
                        <div
                          style={{
                            background: "#ffffff",
                            padding: "1rem",
                            borderRadius: "8px",
                            border: "1px solid #d1fae5",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "0.75rem",
                            }}
                          >
                            <InfoCircleOutlined
                              style={{
                                color: "#059669",
                                marginRight: "0.5rem",
                                fontSize: "1rem",
                              }}
                            />
                            <Text
                              strong
                              style={{
                                color: "#047857",
                                fontSize: "1rem",
                                fontWeight: "600",
                              }}
                            >
                              Chi tiết tuyến đường
                            </Text>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: "1rem",
                            }}
                          >
                            <div style={{ textAlign: "center" }}>
                              <Text
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                  display: "block",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                Khoảng cách
                              </Text>
                              <Text
                                strong
                                style={{
                                  fontSize: "1rem",
                                  color: "#059669",
                                  fontWeight: "600",
                                }}
                              >
                                {orderData.journeyDetails.distance?.toFixed(1) || "N/A"} km
                              </Text>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <Text
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                  display: "block",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                Thời gian
                              </Text>
                              <Text
                                strong
                                style={{
                                  fontSize: "1rem",
                                  color: "#059669",
                                  fontWeight: "600",
                                }}
                              >
                                {orderData.journeyDetails.estimatedDuration || "N/A"} min
                              </Text>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <Text
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                  display: "block",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                Số trạm dừng
                              </Text>
                              <Text
                                strong
                                style={{
                                  fontSize: "1rem",
                                  color: "#059669",
                                  fontWeight: "600",
                                }}
                              >
                                {orderData.journeyDetails.stopsCount || "N/A"}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ticket Validity */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div
                        style={{
                          background: "#ffffff",
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1px solid #d1fae5",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "0.75rem",
                          }}
                        >
                          <CalendarOutlined
                            style={{
                              color: "#059669",
                              marginRight: "0.5rem",
                              fontSize: "1rem",
                            }}
                          />
                          <Text
                            strong
                            style={{
                              color: "#047857",
                              fontSize: "1rem",
                              fontWeight: "600",
                            }}
                          >
                            Khoảng thời gian sử dụng vé
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <Text
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                display: "block",
                                marginBottom: "0.25rem",
                              }}
                            >
                              Có thời hạn từ:
                            </Text>
                            <Text
                              strong
                              style={{
                                fontSize: "0.875rem",
                                color: "#059669",
                                fontWeight: "600",
                              }}
                            >
                              {new Date().toLocaleDateString("vi-VN")}
                            </Text>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <Text
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                display: "block",
                                marginBottom: "0.25rem",
                              }}
                            >
                              Có thời hạn đến: 
                            </Text>
                            <Text
                              strong
                              style={{
                                fontSize: "0.875rem",
                                color: "#059669",
                                fontWeight: "600",
                              }}
                            >
                              {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN")}
                            </Text>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: "0.75rem",
                            padding: "0.5rem",
                            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                            borderRadius: "6px",
                            border: "1px solid #f59e0b",
                            textAlign: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "0.75rem",
                              color: "#92400e",
                              fontWeight: "500",
                            }}
                          >
                            ⚠️ Hạn sử dụng vé trong vòng 30 ngày
                          </Text>
                        </div>
                      </div>
                    </div>

                    <Divider
                      style={{ margin: "1rem 0", borderColor: "#a7f3d0" }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <Text style={{ color: "#374151", fontWeight: "500" }}>
                        Giá tiền :
                      </Text>
                      <Text
                        strong
                        style={{
                          color: "#059669",
                          fontSize: "1.125rem",
                          fontWeight: "600",
                        }}
                      >
                        {orderData.fareMatrix?.price.toLocaleString("vi-VN")}{" "}
                        VND
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#374151", fontWeight: "500" }}>
                        Số lượng:
                      </Text>
                      <Text
                        strong
                        style={{ fontSize: "1.125rem", fontWeight: "600" }}
                      >
                        {orderData.quantity || 1}
                      </Text>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                      padding: "1.5rem",
                      borderRadius: "12px",
                      border: "1px solid #d1fae5",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <ClockCircleOutlined
                        style={{
                          color: "#059669",
                          marginRight: "0.5rem",
                          fontSize: "1.125rem",
                        }}
                      />
                      <Text
                        strong
                        style={{
                          color: "#047857",
                          fontSize: "1.125rem",
                          fontWeight: "600",
                        }}
                      >
                        Vé tàu metro
                      </Text>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                      <Title
                        level={4}
                        style={{
                          color: "#059669",
                          marginBottom: "0.75rem",
                          fontSize: "1.25rem",
                          fontWeight: "600",
                        }}
                      >
                        {orderData.ticketType?.name}
                      </Title>
                      <Text
                        style={{
                          color: "#6b7280",
                          display: "block",
                          marginBottom: "1rem",
                          fontSize: "0.875rem",
                          lineHeight: "1.5",
                        }}
                      >
                        {orderData.ticketType?.description}
                      </Text>
                      <div
                        style={{
                          background: "#ffffff",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          border: "1px solid #d1fae5",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "0.875rem",
                            color: "#047857",
                            fontWeight: "500",
                          }}
                        >
                          <ClockCircleOutlined
                            style={{ marginRight: "0.25rem" }}
                          />
                          Hạn sử dụng: {orderData.ticketType?.validityDuration}{" "}
                          ngày
                        </Text>
                      </div>

                      {/* Pass Validity Dates */}
                      <div style={{ marginTop: "1rem" }}>
                        <div
                          style={{
                            background: "#ffffff",
                            padding: "1rem",
                            borderRadius: "8px",
                            border: "1px solid #d1fae5",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "0.75rem",
                            }}
                          >
                            <CalendarOutlined
                              style={{
                                color: "#059669",
                                marginRight: "0.5rem",
                                fontSize: "1rem",
                              }}
                            />
                            <Text
                              strong
                              style={{
                                color: "#047857",
                                fontSize: "1rem",
                                fontWeight: "600",
                              }}
                            >
                              Khoảng thời gian sử dụng vé
                            </Text>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "1rem",
                            }}
                          >
                            <div style={{ textAlign: "center" }}>
                              <Text
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                  display: "block",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                Thời hạn từ:
                              </Text>
                              <Text
                                strong
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#059669",
                                  fontWeight: "600",
                                }}
                              >
                                {new Date().toLocaleDateString("vi-VN")}
                              </Text>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <Text
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                  display: "block",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                Hết hạn:
                              </Text>
                              <Text
                                strong
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#059669",
                                  fontWeight: "600",
                                }}
                              >
                                {new Date(Date.now() + (orderData.ticketType?.validityDuration || 0) * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN")}
                              </Text>
                            </div>
                          </div>
                          <div
                            style={{
                              marginTop: "0.75rem",
                              padding: "0.5rem",
                              background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                              borderRadius: "6px",
                              border: "1px solid #16a34a",
                              textAlign: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: "0.75rem",
                                color: "#15803d",
                                fontWeight: "500",
                              }}
                            >
                              ✅ Vé có thời hạn kích hoạt trong vòng 90 ngày
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Divider
                      style={{ margin: "1rem 0", borderColor: "#a7f3d0" }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <Text style={{ color: "#374151", fontWeight: "500" }}>
                        Giá vé:
                      </Text>
                      <Text
                        strong
                        style={{
                          color: "#059669",
                          fontSize: "1.125rem",
                          fontWeight: "600",
                        }}
                      >
                        {orderData.ticketType?.price.toLocaleString("vi-VN")}{" "}
                        VND
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#374151", fontWeight: "500" }}>
                        Số lượng:
                      </Text>
                      <Text
                        strong
                        style={{ fontSize: "1.125rem", fontWeight: "600" }}
                      >
                        {orderData.quantity || 1}
                      </Text>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Selected Payment Method */}
            <Card
              style={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                background: "#ffffff",
                overflow: "hidden",
              }}
              bodyStyle={{ padding: "2rem" }}
            >
              <Title
                level={3}
                style={{
                  color: "#059669",
                  marginBottom: "1.5rem",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CreditCardOutlined
                  style={{ marginRight: "0.5rem", fontSize: "1.25rem" }}
                />
                Chọn phương thức thanh toán
              </Title>

              {orderData.selectedPaymentMethod && (
                <Card
                  style={{
                    border: "2px solid #10b981",
                    background:
                      "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
                  }}
                  bodyStyle={{ padding: "1.5rem" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "3rem",
                        height: "3rem",
                        background: "linear-gradient(135deg, #059669, #10b981)",
                        borderRadius: "12px",
                        marginRight: "1rem",
                        boxShadow: "0 4px 8px rgba(5, 150, 105, 0.3)",
                      }}
                    >
                      <CreditCardOutlined
                        style={{ fontSize: "1.25rem", color: "#ffffff" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text
                        strong
                        style={{
                          fontSize: "1.125rem",
                          color: "#059669",
                          display: "block",
                          marginBottom: "0.25rem",
                          fontWeight: "600",
                        }}
                      >
                        {orderData.selectedPaymentMethod.paymentMethodName}
                      </Text>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "0.5rem",
                            height: "0.5rem",
                            background: "#10b981",
                            borderRadius: "50%",
                            marginRight: "0.5rem",
                          }}
                        />
                        Xử lí thanh toán
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "1.5rem",
                        height: "1.5rem",
                        background: "#059669",
                        borderRadius: "50%",
                        marginLeft: "0.75rem",
                      }}
                    >
                      <CheckCircleOutlined
                        style={{ fontSize: "0.875rem", color: "#ffffff" }}
                      />
                    </div>
                  </div>
                </Card>
              )}
            </Card>

            {/* Purchase Information */}
            <Card
              style={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                background: "#ffffff",
                overflow: "hidden",
                marginTop: "2rem",
              }}
              bodyStyle={{ padding: "2rem" }}
            >
              <Title
                level={3}
                style={{
                  color: "#059669",
                  marginBottom: "1.5rem",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CalendarOutlined
                  style={{ marginRight: "0.5rem", fontSize: "1.25rem" }}
                />
                Thông tin thanh toán
              </Title>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <div>
                      <Text
                        style={{
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          fontWeight: "500",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Loại vé:
                      </Text>
                      <Tag
                        color={orderData.orderType === "single" ? "blue" : "green"}
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "6px",
                          textTransform: "capitalize",
                        }}
                      >
                        {orderData.orderType === "single" ? "Single Journey" : "Metro Pass"}
                      </Tag>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div>
                      <Text
                        style={{
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          fontWeight: "500",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Thời gian mua:
                      </Text>
                      <Text
                        style={{
                          fontSize: "1rem",
                          color: "#374151",
                          fontWeight: "500",
                        }}
                      >
                        {orderData.purchaseTimestamp
                          ? new Date(orderData.purchaseTimestamp).toLocaleString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          : new Date().toLocaleString("vi-VN")}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div>
                      <Text
                        style={{
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          fontWeight: "500",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Số lượng:
                      </Text>
                      <Text
                        style={{
                          fontSize: "1.25rem",
                          color: "#059669",
                          fontWeight: "600",
                        }}
                      >
                        {orderData.quantity || 1} ticket{(orderData.quantity || 1) > 1 ? "s" : ""}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div>
                      <Text
                        style={{
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          fontWeight: "500",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Trạng thái:
                      </Text>
                      <Tag
                        color="orange"
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "6px",
                        }}
                      >
                        Chờ thanh toán
                      </Tag>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          {/* Order Total & Actions */}
          <Col xs={24} lg={10}>
            <Card
              style={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                position: "sticky",
                top: "1rem",
                background: "#ffffff",
                overflow: "hidden",
              }}
              bodyStyle={{ padding: "2rem" }}
            >
              <Title
                level={3}
                style={{
                  color: "#059669",
                  marginBottom: "1.5rem",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                Tổng tiền
              </Title>

              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <Text style={{ fontSize: "1rem", color: "#374151" }}>
                    Tiền vé:
                  </Text>
                  <Text style={{ fontSize: "1rem", fontWeight: "500" }}>
                    {orderData.orderSummary?.subtotal?.toLocaleString("vi-VN") || 
                     calculateTotal().toLocaleString("vi-VN")} VND
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <Text style={{ fontSize: "1rem", color: "#374151" }}>
                    Tiền phí:
                  </Text>
                  <Text style={{ fontSize: "1rem", fontWeight: "500" }}>
                    {orderData.orderSummary?.processingFee?.toLocaleString("vi-VN") || "0"} VND
                  </Text>
                </div>
                <Divider style={{ margin: "1rem 0", borderColor: "#e5e7eb" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    strong
                    style={{
                      fontSize: "1.125rem",
                      color: "#1f2937",
                      fontWeight: "600",
                    }}
                  >
                    Tổng:
                  </Text>
                  <Text
                    strong
                    style={{
                      fontSize: "1.5rem",
                      color: "#059669",
                      fontWeight: "700",
                    }}
                  >
                    {orderData.orderSummary?.total?.toLocaleString("vi-VN") || 
                     calculateTotal().toLocaleString("vi-VN")} VND
                  </Text>
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <Button
                  size="large"
                  loading={loading}
                  onClick={handlePayment}
                  disabled={!orderData.selectedPaymentMethod}
                  icon={<CreditCardOutlined />}
                  variant="primary"
                  hoverEffect="scale"
                  customStyle={{
                    width: "100%",
                    marginBottom: "1rem",
                    height: "3rem",
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    borderRadius: "12px",
                  }}
                >
                  Tiến hành thanh toán
                </Button>

                <Button
                  size="large"
                  onClick={() => navigate(FE_PATH.BUY_TICKET)}
                  variant="secondary"
                  customStyle={{
                    width: "100%",
                    height: "3rem",
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    borderRadius: "12px",
                  }}
                >
                  Trở về trang mua vé
                </Button>
              </div>

              <div
                style={{
                  marginTop: "2rem",
                  padding: "1.5rem",
                  background:
                    "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Text
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    lineHeight: "1.5",
                  }}
                >
                  <CheckCircleOutlined
                    style={{
                      color: "#10b981",
                      marginRight: "0.5rem",
                      fontSize: "1rem",
                    }}
                  />
                  Thanh toán của bạn được bảo mật bằng mã hóa tiêu chuẩn công nghiệp
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
