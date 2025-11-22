import React, { useState, useMemo, useEffect } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  X,
  Loader,
  DollarSign,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

function App() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedBillDetails, setSelectedBillDetails] = useState(null);

  useEffect(() => {
    const fetchBillingHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        let url =
          "https://billing-backend-0zk0.onrender.com/api/billing/history";
        if (selectedPatient) {
          url += `?patientId=${encodeURIComponent(selectedPatient)}`;
        }

        const response = await axios.get(url);

        if (response.data && response.data.success && response.data.data) {
          const normalizedBills = response.data.data.map((bill) => {
            const medicines = Array.isArray(bill.medicines)
              ? bill.medicines
              : [];
            const tests = Array.isArray(bill.tests) ? bill.tests : [];

            const items = [
              ...medicines.map((item) => ({
                name: item?.medicineName || "Unnamed Item",
                medicineName: item?.medicineName || null,
                quantity: item?.quantity || 0,
                unitPrice: item?.unitPrice ?? 0,
                totalPrice: item?.totalPrice ?? 0,
                type: item?.medicineName?.toLowerCase().includes("injection")
                  ? "injection"
                  : "medicine",
              })),
              ...tests.map((item) => ({
                name: item?.medicineName || "Unnamed Test",
                medicineName: item?.medicineName || null,
                quantity: item?.quantity || 0,
                unitPrice: item?.unitPrice ?? 0,
                totalPrice: item?.totalPrice ?? 0,
                type: "test",
              })),
            ];

            return {
              id: `${bill.appointmentId || ""}-${bill.patientId || ""}-${
                bill.createdAt || ""
              }`,
              appointmentId: bill.appointmentId || null,
              patientId: bill.patientId || null,
              patientName:
                bill.patientName || `Patient ${bill.patientId || "Unknown"}`,
              doctorName: bill.doctorName || "Unknown",
              department: bill.department || "Unknown",
              billDate: bill.createdAt
                ? new Date(bill.createdAt).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
              createdAt: bill.createdAt || null,
              items,
              consultancyFee: bill.consultancyFee ?? 0,
              total: bill.totalAmount ?? 0,
              totalAmount: bill.totalAmount ?? 0,
              status: bill.status || "paid",
            };
          });

          setBills(normalizedBills);
        } else {
          setBills([]);
        }
      } catch (err) {
        console.error("Failed to fetch billing history:", err);
        setError("Failed to fetch billing history. Please try again.");
        setBills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingHistory();
  }, [selectedPatient]);

  const filteredAndSortedBills = useMemo(() => {
    let filtered = bills.filter((bill) => {
      const matchesSearch =
        bill.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bill.patientId || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDateRange =
        (!dateRange.start || bill.billDate >= dateRange.start) &&
        (!dateRange.end || bill.billDate <= dateRange.end);

      const matchesPatient =
        !selectedPatient || bill.patientId === selectedPatient;

      return matchesSearch && matchesDateRange && matchesPatient;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.billDate || a.createdAt || "");
          bValue = new Date(b.billDate || b.createdAt || "");
          break;
        case "amount":
          aValue = a.total || a.totalAmount || 0;
          bValue = b.total || b.totalAmount || 0;
          break;
        case "patient":
          aValue = (a.patientName || "").toLowerCase();
          bValue = (b.patientName || "").toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [bills, searchTerm, sortBy, sortOrder, dateRange, selectedPatient]);

  const totalRevenue = filteredAndSortedBills.reduce(
    (sum, bill) => sum + (bill.total || bill.totalAmount || 0),
    0
  );
  const paidBills = filteredAndSortedBills.filter(
    (bill) => bill.status === "paid"
  );
  const pendingBills = filteredAndSortedBills.filter(
    (bill) => bill.status === "pending"
  );
  const overdueBills = filteredAndSortedBills.filter(
    (bill) => bill.status === "overdue"
  );

  const exportData = () => {
    const csvContent = [
      ["Patient Name", "Patient ID", "Date", "Total", "Status", "Doctor"],
      ...filteredAndSortedBills.map((bill) => [
        bill.patientName || "",
        bill.patientId,
        bill.billDate ||
          new Date(bill.createdAt || "").toISOString().split("T")[0],
        bill.total || bill.totalAmount || 0,
        bill.status || "paid",
        bill.doctorName,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "billing-history.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "overdue":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setSelectedPatient("");
    setSortBy("date");
    setSortOrder("desc");
  };

  const handleBillClick = (bill) => {
    setSelectedBillDetails(bill);
  };

  const closeModal = () => {
    setSelectedBillDetails(null);
  };

  const refreshData = () => {
    setSelectedPatient((prev) => prev);
  };

  if (loading && bills.length === 0) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "60px 40px",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          <Loader
            size={48}
            style={{
              color: "#3B82F6",
              marginBottom: "20px",
              animation: "spin 1s linear infinite",
            }}
          />
          <h3
            style={{
              color: "#1F2937",
              fontSize: "20px",
              margin: "0 0 8px 0",
              fontWeight: "600",
            }}
          >
            Loading Billing History
          </h3>
          <p
            style={{
              color: "#6B7280",
              fontSize: "14px",
              margin: "0",
            }}
          >
            Please wait while we fetch your data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "60px 40px",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            textAlign: "center",
            maxWidth: "500px",
            border: "1px solid #FEE2E2",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#FEE2E2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <X size={30} color="#DC2626" />
          </div>
          <h3
            style={{
              color: "#DC2626",
              fontSize: "20px",
              margin: "0 0 12px 0",
              fontWeight: "600",
            }}
          >
            Error Loading Data
          </h3>
          <p
            style={{
              color: "#6B7280",
              fontSize: "14px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            {error}
          </p>
          <button
            onClick={refreshData}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3B82F6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563EB")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3B82F6")
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Loading overlay for subsequent loads */}
      {loading && bills.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <Loader
              size={24}
              style={{
                color: "#3B82F6",
                animation: "spin 1s linear infinite",
              }}
            />
            <span style={{ color: "#1F2937", fontWeight: "500" }}>
              Updating data...
            </span>
          </div>
        </div>
      )}

      {/* Analytics Cards */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {[
          {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "#10B981",
            bg: "#ECFDF5",
          },
          {
            title: "Total Bills",
            value: filteredAndSortedBills.length,
            icon: FileText,
            color: "#3B82F6",
            bg: "#EFF6FF",
          },
          {
            title: "Paid Bills",
            value: paidBills.length,
            icon: TrendingUp,
            color: "#10B981",
            bg: "#ECFDF5",
          },
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid #e5e7eb",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "12px",
                    backgroundColor: stat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComponent size={24} color={stat.color} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6B7280",
                      margin: "0 0 4px 0",
                      fontWeight: "500",
                    }}
                  >
                    {stat.title}
                  </p>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#1F2937",
                      margin: "0",
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          {/* Search input */}
          <div style={{ position: "relative", flex: "1", minWidth: "250px" }}>
            <Search
              size={20}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6B7280",
              }}
            />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          {/* Sort selectors */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="patient">Sort by Patient</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: "#3B82F6",
              borderRadius: "8px",
              border: "none",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563EB")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3B82F6")
            }
            aria-expanded={showFilters}
            aria-controls="filter-section"
          >
            <Filter size={16} />
            Filters
            <ChevronDown
              size={16}
              style={{
                transition: "transform 0.3s",
                transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {/* Export button */}
          <button
            onClick={exportData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: "#10B981",
              borderRadius: "8px",
              border: "none",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#059669")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#10B981")
            }
          >
            <Download size={16} />
            Export CSV
          </button>

          {/* Clear filters button */}
          <button
            onClick={clearFilters}
            style={{
              padding: "12px 20px",
              backgroundColor: "#EF4444",
              borderRadius: "8px",
              border: "none",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#DC2626")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#EF4444")
            }
          >
            Clear Filters
          </button>
        </div>

        {/* Filters section */}
        {showFilters && (
          <div
            id="filter-section"
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              marginTop: "16px",
            }}
          >
            {/* Date range filters */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="start-date"
                style={{ marginBottom: "4px", fontWeight: "600" }}
              >
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="end-date"
                style={{ marginBottom: "4px", fontWeight: "600" }}
              >
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            {/* Patient ID filter */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: "200px",
              }}
            >
              <label
                htmlFor="patient-id"
                style={{ marginBottom: "4px", fontWeight: "600" }}
              >
                Patient ID
              </label>
              <input
                id="patient-id"
                type="text"
                placeholder="Enter patient ID"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Billing History Table */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px",
                  borderBottom: "2px solid #e5e7eb",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#6B7280",
                  minWidth: "140px",
                }}
              >
                Patient
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px",
                  borderBottom: "2px solid #e5e7eb",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#6B7280",
                  minWidth: "170px",
                }}
              >
                Doctor
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px",
                  borderBottom: "2px solid #e5e7eb",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#6B7280",
                  minWidth: "170px",
                }}
              >
                Department
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px",
                  borderBottom: "2px solid #e5e7eb",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#6B7280",
                  minWidth: "110px",
                }}
              >
                Date
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "16px",
                  borderBottom: "2px solid #e5e7eb",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#6B7280",
                  minWidth: "130px",
                }}
              >
                Consultancy Fee
              </th>

              <th
                style={{
                  textAlign: "right",
                  padding: "16px",
                  borderBottom: "2px solid #e5e7eb",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#6B7280",
                  minWidth: "110px",
                }}
              >
                Amount
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "16px",
                  borderBottom: "2px solid #e5e7eb",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#6B7280",
                  minWidth: "120px",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedBills.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "16px",
                    color: "#9CA3AF",
                    fontWeight: "500",
                  }}
                >
                  No billing records found.
                </td>
              </tr>
            )}
            {filteredAndSortedBills.map((bill) => (
              <tr
                key={bill.id}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #e5e7eb",
                  transition: "background-color 0.2s ease",
                }}
                onClick={() => handleBillClick(bill)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F3F4F6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleBillClick(bill);
                  }
                }}
                aria-label={`View details for bill of ${
                  bill.patientName
                }, date ${bill.billDate}, amount ₹${
                  bill.total || bill.totalAmount
                }`}
              >
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontWeight: "600", color: "#1F2937" }}>
                    {bill.patientName}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>
                    {bill.patientId}
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#374151" }}>
                  {bill.doctorName}
                </td>
                <td style={{ padding: "12px 16px", color: "#374151" }}>
                  {bill.department}
                </td>
                <td style={{ padding: "12px 16px", color: "#374151" }}>
                  {bill.billDate}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "right",
                    fontWeight: "600",
                    color: "#2563EB",
                  }}
                >
                  ₹{(bill.consultancyFee || 0).toLocaleString()}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "right",
                    fontWeight: "600",
                  }}
                >
                  ₹{(bill.total || bill.totalAmount || 0).toLocaleString()}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <span
                    style={{
                      color: "white",
                      backgroundColor: getStatusColor(bill.status),
                      borderRadius: "9999px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "capitalize",
                      display: "inline-block",
                      minWidth: "70px",
                    }}
                    aria-label={`Status: ${bill.status}`}
                  >
                    {bill.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Billing Details Modal */}
      {selectedBillDetails && (
        <>
          {/* Print Styles */}
          <style>
            {`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 20px !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .screen-only {
            display: none !important;
          }
          .print-header {
            display: block !important;
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 20px;
          }
          .print-footer {
            display: block !important;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #3B82F6;
            text-align: center;
            font-size: 12px;
            color: #6B7280;
          }
        }
      `}
          </style>

          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(59, 130, 246, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3000,
              padding: "20px",
              backdropFilter: "blur(8px)",
            }}
            onClick={closeModal}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="no-print"
              style={{
                position: "fixed",
                top: "40px",
                right: "60px",
                background: "#F3F4F6",
                border: "2px solid #E5E7EB",
                cursor: "pointer",
                fontSize: "18px",
                color: "#2563EB",
                borderRadius: "50%",
                width: "46px",
                height: "46px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 5001,
                boxShadow: "0 4px 20px rgba(59,130,246,0.15)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#2563EB";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "#2563EB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#F3F4F6";
                e.currentTarget.style.color = "#2563EB";
                e.currentTarget.style.borderColor = "#E5E7EB";
              }}
              tabIndex={0}
              aria-label="Close"
            >
              ✕
            </button>

            <div
              id="printable-area"
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                maxWidth: "720px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "32px",
                boxShadow: "0 20px 60px rgba(59, 130, 246, 0.20)",
                position: "relative",
                border: "1px solid #E5E7EB",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Print-only header (only shows when printing) */}
              <div className="print-only" style={{ display: "none" }}>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "24px",
                    borderBottom: "3px solid #3B82F6",
                    paddingBottom: "20px",
                    background: "#F8FAFC",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        background: "#3B82F6",
                        color: "#FFF",
                        padding: "12px",
                        borderRadius: "12px",
                        fontSize: "28px",
                        lineHeight: "24px",
                        boxShadow: "0 2px 8px #3B82F666",
                      }}
                    >
                      ⚡
                    </div>
                    <h1
                      style={{
                        fontSize: "2rem",
                        margin: 0,
                        color: "#2563EB",
                        letterSpacing: "0.8px",
                        fontWeight: 800,
                        fontFamily: "'Inter', sans-serif",
                        textShadow: "0 1px 6px #2563EB14",
                      }}
                    >
                      MediTrack
                    </h1>
                  </div>
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "15px",
                      color: "#374151",
                      opacity: 0.95,
                      letterSpacing: "0.2px",
                    }}
                  >
                    123 Healthcare Avenue, Medical District, Coimbatore - 641001
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B7280" }}>
                    Phone: +91-123-456-7890 &nbsp; | &nbsp; info@meditrack.com
                    &nbsp; | &nbsp; www.meditrack.com
                  </div>
                </div>
              </div>

              {/* Screen-only header and buttons */}
              <div className="screen-only">
                {/* Header with MediTrack Branding (only shows on screen) */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffffff 0%, #f4f4f4ff 100%)",
                    color: "black",
                    padding: "24px",
                    borderRadius: "12px",
                    marginBottom: "24px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "80px",
                      height: "80px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "24px",
                        fontWeight: "bold",
                        letterSpacing: "0.5px",
                      }}
                    >
                      MediTrack
                    </h1>
                  </div>
                  <h2
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "20px",
                      fontWeight: "600",
                      opacity: 0.95,
                    }}
                  >
                    Medical Invoice
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      opacity: 0.9,
                    }}
                  >
                    {selectedBillDetails.patientName}
                  </p>
                </div>

                {/* Print/Download buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  <button
                    onClick={() => window.print()}
                    style={{
                      background:
                        "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "15px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 16px rgba(59,130,246,0.25)",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(59, 130, 246, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 16px rgba(59,130,246,0.25)";
                    }}
                  >
                    🖨️ Print Invoice
                  </button>
                  <button
                    // Replace the PDF generation button onClick handler with this improved version

                    // Replace the entire PDF generation button onClick handler with this corrected version

                    onClick={() => {
                      const doc = new jsPDF("p", "mm", "a4");
                      const pageWidth = doc.internal.pageSize.getWidth();
                      const pageHeight = doc.internal.pageSize.getHeight();
                      const margin = 15;
                      let yPos = margin;

                      // Helper function to add new page if needed
                      const checkPageBreak = (requiredSpace) => {
                        if (yPos + requiredSpace > pageHeight - margin) {
                          doc.addPage();
                          yPos = margin;
                          return true;
                        }
                        return false;
                      };

                      // Set default font
                      doc.setFont("helvetica", "normal");

                      // Hospital Header Block
                      doc.setFillColor(59, 130, 246);
                      doc.rect(0, 0, pageWidth, 35, "F");

                      // Header text
                      doc.setTextColor(255, 255, 255);
                      doc.setFontSize(24);
                      doc.setFont("helvetica", "bold");
                      doc.text("MediTrack", pageWidth / 2, 15, {
                        align: "center",
                      });

                      doc.setFontSize(10);
                      doc.setFont("helvetica", "normal");
                      doc.text(
                        "Advanced Healthcare Management System",
                        pageWidth / 2,
                        22,
                        { align: "center" }
                      );
                      doc.text(
                        "123 Healthcare Avenue, Medical District, Coimbatore - 641001",
                        pageWidth / 2,
                        28,
                        { align: "center" }
                      );

                      yPos = 45;

                      // Contact Info
                      doc.setTextColor(107, 114, 128);
                      doc.setFontSize(8);
                      doc.text(
                        "Phone: +91-123-456-7890 | Email: info@meditrack.com | www.meditrack.com",
                        pageWidth / 2,
                        yPos,
                        { align: "center" }
                      );
                      yPos += 15;

                      // Invoice Title
                      doc.setFillColor(248, 250, 252);
                      doc.roundedRect(
                        margin,
                        yPos - 3,
                        pageWidth - 2 * margin,
                        15,
                        3,
                        3,
                        "F"
                      );
                      doc.setTextColor(31, 41, 55);
                      doc.setFontSize(18);
                      doc.setFont("helvetica", "bold");
                      doc.text("MEDICAL INVOICE", pageWidth / 2, yPos + 6, {
                        align: "center",
                      });
                      yPos += 25;

                      // Patient Information Box
                      checkPageBreak(50);
                      doc.setDrawColor(59, 130, 246);
                      doc.setFillColor(248, 250, 252);
                      doc.setLineWidth(0.5);
                      doc.roundedRect(
                        margin,
                        yPos,
                        pageWidth - 2 * margin,
                        45,
                        3,
                        3,
                        "FD"
                      );

                      // Patient Info Header
                      doc.setTextColor(59, 130, 246);
                      doc.setFontSize(12);
                      doc.setFont("helvetica", "bold");
                      yPos += 10;
                      doc.text("PATIENT INFORMATION", margin + 8, yPos);
                      yPos += 12;

                      // Patient details in proper columns
                      doc.setTextColor(55, 65, 81);
                      doc.setFont("helvetica", "normal");
                      doc.setFontSize(9);

                      const leftColStart = margin + 8;
                      const rightColStart = pageWidth / 2 + 5;
                      const labelStyle = {
                        color: [55, 65, 81],
                        weight: "bold",
                      };
                      const valueStyle = {
                        color: [107, 114, 128],
                        weight: "normal",
                      };

                      // Row 1
                      doc.setFont("helvetica", "bold");
                      doc.text("Patient Name:", leftColStart, yPos);
                      doc.setFont("helvetica", "normal");
                      doc.text(
                        selectedBillDetails.patientName || "N/A",
                        leftColStart + 35,
                        yPos
                      );

                      doc.setFont("helvetica", "bold");
                      doc.text("Doctor:", rightColStart, yPos);
                      doc.setFont("helvetica", "normal");
                      doc.text(
                        `Dr. ${selectedBillDetails.doctorName || "Unknown"}`,
                        rightColStart + 20,
                        yPos
                      );
                      yPos += 6;

                      // Row 2
                      doc.setFont("helvetica", "bold");
                      doc.text("Patient ID:", leftColStart, yPos);
                      doc.setFont("helvetica", "normal");
                      doc.text(
                        selectedBillDetails.patientId || "N/A",
                        leftColStart + 35,
                        yPos
                      );

                      doc.setFont("helvetica", "bold");
                      doc.text("Department:", rightColStart, yPos);
                      doc.setFont("helvetica", "normal");
                      doc.text(
                        selectedBillDetails.department || "General",
                        rightColStart + 25,
                        yPos
                      );
                      yPos += 6;

                      // Row 3
                      doc.setFont("helvetica", "bold");
                      doc.text("Date:", leftColStart, yPos);
                      doc.setFont("helvetica", "normal");
                      doc.text(
                        selectedBillDetails.billDate || "N/A",
                        leftColStart + 35,
                        yPos
                      );

                      doc.setFont("helvetica", "bold");
                      doc.text("Status:", rightColStart, yPos);
                      doc.setFont("helvetica", "normal");
                      doc.text(
                        (selectedBillDetails.status || "Paid").toUpperCase(),
                        rightColStart + 20,
                        yPos
                      );
                      yPos += 6;

                      // Consultancy Fee
                      doc.setFont("helvetica", "bold");
                      doc.setTextColor(34, 197, 94);
                      doc.text("Consultancy Fee:", leftColStart, yPos);
                      doc.text(
                        `Rs. ${(
                          selectedBillDetails.consultancyFee || 0
                        ).toLocaleString()}`,
                        leftColStart + 35,
                        yPos
                      );
                      yPos += 20;

                      // Items Table
                      checkPageBreak(35);
                      doc.setTextColor(31, 41, 55);
                      doc.setFont("helvetica", "bold");
                      doc.setFontSize(12);
                      doc.text("MEDICAL ITEMS & SERVICES", margin, yPos);
                      yPos += 12;

                      // Define table structure
                      const tableStartY = yPos;
                      const tableWidth = pageWidth - 2 * margin;
                      const rowHeight = 8;

                      // Column definitions with exact positions
                      const columns = [
                        { title: "Item Name", x: margin, width: 70 },
                        { title: "Qty", x: margin + 70, width: 20 },
                        { title: "Unit Price", x: margin + 90, width: 30 },
                        { title: "Amount", x: margin + 120, width: 30 },
                        { title: "Type", x: margin + 150, width: 25 },
                      ];

                      // Draw table header
                      doc.setFillColor(59, 130, 246);
                      doc.rect(margin, yPos, tableWidth, rowHeight + 2, "F");

                      doc.setTextColor(255, 255, 255);
                      doc.setFont("helvetica", "bold");
                      doc.setFontSize(9);

                      // Header text with proper positioning
                      columns.forEach((col) => {
                        if (col.title === "Item Name") {
                          doc.text(col.title, col.x + 2, yPos + 6);
                        } else {
                          doc.text(col.title, col.x + col.width / 2, yPos + 6, {
                            align: "center",
                          });
                        }
                      });

                      yPos += rowHeight + 2;

                      // Draw table border
                      doc.setDrawColor(200, 200, 200);
                      doc.setLineWidth(0.1);

                      // Table rows
                      doc.setFont("helvetica", "normal");
                      doc.setTextColor(55, 65, 81);
                      doc.setFontSize(8);

                      selectedBillDetails.items.forEach((item, index) => {
                        checkPageBreak(rowHeight + 3);

                        // Alternate row background
                        if (index % 2 === 0) {
                          doc.setFillColor(249, 250, 251);
                          doc.rect(margin, yPos, tableWidth, rowHeight, "F");
                        }

                        // Item data
                        const itemName = (item.name || "Unnamed").substring(
                          0,
                          35
                        ); // Truncate long names
                        const quantity = (item.quantity || 0).toString();
                        const unitPrice = `Rs. ${(
                          item.unitPrice || 0
                        ).toLocaleString()}`;
                        const totalPrice = `Rs. ${(
                          item.totalPrice || 0
                        ).toLocaleString()}`;
                        const type =
                          (item.type || "N/A").charAt(0).toUpperCase() +
                          (item.type || "N/A").slice(1);

                        // Position text in columns
                        doc.text(itemName, columns[0].x + 2, yPos + 5); // Item Name (left aligned)
                        doc.text(
                          quantity,
                          columns[1].x + columns[1].width / 2,
                          yPos + 5,
                          { align: "center" }
                        ); // Qty (centered)
                        doc.text(
                          unitPrice,
                          columns[2].x + columns[2].width / 2,
                          yPos + 5,
                          { align: "center" }
                        ); // Unit Price (centered)
                        doc.text(
                          totalPrice,
                          columns[3].x + columns[3].width / 2,
                          yPos + 5,
                          { align: "center" }
                        ); // Amount (centered)
                        doc.text(
                          type,
                          columns[4].x + columns[4].width / 2,
                          yPos + 5,
                          { align: "center" }
                        ); // Type (centered)

                        yPos += rowHeight;
                      });

                      // Draw table borders
                      doc.setDrawColor(200, 200, 200);
                      doc.setLineWidth(0.2);

                      // Horizontal lines
                      const tableEndY = yPos;
                      const numRows = selectedBillDetails.items.length + 1; // +1 for header

                      for (let i = 0; i <= numRows; i++) {
                        const lineY =
                          tableStartY + i * (rowHeight + (i === 1 ? 2 : 0)); // Extra space after header
                        doc.line(margin, lineY, margin + tableWidth, lineY);
                      }

                      // Vertical lines
                      let currentX = margin;
                      doc.line(currentX, tableStartY, currentX, tableEndY); // Left border

                      columns.forEach((col) => {
                        currentX += col.width;
                        doc.line(currentX, tableStartY, currentX, tableEndY);
                      });

                      // Total Section
                      yPos += 15;
                      checkPageBreak(25);

                      const totalBoxWidth = 80;
                      const totalBoxHeight = 20;
                      const totalBoxX = pageWidth - margin - totalBoxWidth;

                      doc.setFillColor(59, 130, 246);
                      doc.roundedRect(
                        totalBoxX,
                        yPos,
                        totalBoxWidth,
                        totalBoxHeight,
                        3,
                        3,
                        "F"
                      );

                      doc.setTextColor(255, 255, 255);
                      doc.setFont("helvetica", "bold");
                      doc.setFontSize(10);
                      doc.text(
                        "TOTAL AMOUNT",
                        totalBoxX + totalBoxWidth / 2,
                        yPos + 7,
                        { align: "center" }
                      );

                      doc.setFontSize(14);
                      const totalAmount = `Rs. ${(
                        selectedBillDetails.total ||
                        selectedBillDetails.totalAmount ||
                        0
                      ).toLocaleString()}`;
                      doc.text(
                        totalAmount,
                        totalBoxX + totalBoxWidth / 2,
                        yPos + 16,
                        { align: "center" }
                      );

                      // Footer
                      const footerY = pageHeight - 20;
                      doc.setDrawColor(59, 130, 246);
                      doc.setLineWidth(0.5);
                      doc.line(margin, footerY, pageWidth - margin, footerY);

                      doc.setTextColor(107, 114, 128);
                      doc.setFont("helvetica", "normal");
                      doc.setFontSize(9);
                      doc.text(
                        "Thank you for choosing MediTrack. Wishing you good health!",
                        pageWidth / 2,
                        footerY + 6,
                        { align: "center" }
                      );

                      doc.setFontSize(7);
                      doc.text(
                        "This is a computer-generated invoice. For queries, contact us at info@meditrack.com",
                        pageWidth / 2,
                        footerY + 12,
                        { align: "center" }
                      );

                      // Save the PDF
                      const filename = `MediTrack_Invoice_${
                        selectedBillDetails.patientName?.replace(
                          /[^a-zA-Z0-9]/g,
                          "_"
                        ) || "Patient"
                      }_${selectedBillDetails.patientId || "Unknown"}.pdf`;
                      doc.save(filename);
                    }}
                  >
                    📄 Download PDF
                  </button>
                </div>
              </div>

              {/* Patient Information */}
              <div
                style={{
                  background: "#F8FAFC",
                  border: "2px solid #E5E7EB",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "24px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: getStatusColor(
                      selectedBillDetails.status || "paid"
                    ),
                    color: "white",
                    borderRadius: "20px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {selectedBillDetails.status || "paid"}
                </div>

                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1F2937",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  👤 Patient Information
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div style={{ marginBottom: "12px" }}>
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#374151",
                          display: "inline-block",
                          minWidth: "100px",
                        }}
                      >
                        Patient ID:
                      </span>
                      <span
                        style={{
                          color: "#6B7280",
                          fontFamily: "monospace",
                          background: "white",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          marginLeft: "8px",
                          border: "1px solid #D1D5DB",
                        }}
                      >
                        {selectedBillDetails.patientId}
                      </span>
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                      <span style={{ fontWeight: "600", color: "#374151" }}>
                        Doctor:{" "}
                      </span>
                      <span style={{ color: "#3B82F6", fontWeight: "500" }}>
                        👨‍⚕️ Dr. {selectedBillDetails.doctorName}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontWeight: "600", color: "#374151" }}>
                        Department:{" "}
                      </span>
                      <span style={{ color: "#6B7280" }}>
                        {selectedBillDetails.department || "General"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: "12px" }}>
                      <span style={{ fontWeight: "600", color: "#374151" }}>
                        Date:{" "}
                      </span>
                      <span style={{ color: "#6B7280" }}>
                        📅 {selectedBillDetails.billDate}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontWeight: "600", color: "#374151" }}>
                        Consultancy Fee:{" "}
                      </span>
                      <span
                        style={{
                          color: "#059669",
                          fontWeight: "600",
                          background: "#ECFDF5",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          border: "1px solid #A7F3D0",
                        }}
                      >
                        ₹
                        {(
                          selectedBillDetails.consultancyFee || 0
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div
                style={{
                  background: "white",
                  border: "2px solid #E5E7EB",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
                    color: "white",
                    padding: "16px 20px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    💊 Medical Items & Services
                  </h3>
                </div>

                {selectedBillDetails.items.length === 0 ? (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#6B7280",
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                      📋
                    </div>
                    <p style={{ margin: 0, fontSize: "16px" }}>
                      No items found for this invoice.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr style={{ background: "#F8FAFC" }}>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "16px",
                              borderBottom: "2px solid #E5E7EB",
                              fontWeight: "600",
                              color: "#374151",
                              fontSize: "14px",
                            }}
                          >
                            Item Name
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "16px",
                              borderBottom: "2px solid #E5E7EB",
                              fontWeight: "600",
                              color: "#374151",
                              fontSize: "14px",
                              width: "80px",
                            }}
                          >
                            Qty
                          </th>
                          <th
                            style={{
                              textAlign: "right",
                              padding: "16px",
                              borderBottom: "2px solid #E5E7EB",
                              fontWeight: "600",
                              color: "#374151",
                              fontSize: "14px",
                              width: "120px",
                            }}
                          >
                            Unit Price
                          </th>
                          <th
                            style={{
                              textAlign: "right",
                              padding: "16px",
                              borderBottom: "2px solid #E5E7EB",
                              fontWeight: "600",
                              color: "#374151",
                              fontSize: "14px",
                              width: "120px",
                            }}
                          >
                            Amount
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "16px",
                              borderBottom: "2px solid #E5E7EB",
                              fontWeight: "600",
                              color: "#374151",
                              fontSize: "14px",
                              width: "100px",
                            }}
                          >
                            Type
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBillDetails.items.map((item, idx) => (
                          <tr
                            key={`${item.name}-${idx}`}
                            style={{
                              background: idx % 2 === 0 ? "white" : "#FAFBFC",
                              transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.closest("tr").style.background =
                                "#EBF8FF")
                            }
                            onMouseLeave={(e) =>
                              (e.target.closest("tr").style.background =
                                idx % 2 === 0 ? "white" : "#FAFBFC")
                            }
                          >
                            <td
                              style={{
                                padding: "16px",
                                color: "#374151",
                                fontWeight: "500",
                                borderBottom: "1px solid #F3F4F6",
                              }}
                            >
                              {item.name}
                            </td>
                            <td
                              style={{
                                padding: "16px",
                                textAlign: "center",
                                color: "#6B7280",
                                borderBottom: "1px solid #F3F4F6",
                                fontWeight: "600",
                              }}
                            >
                              {item.quantity || "-"}
                            </td>
                            <td
                              style={{
                                padding: "16px",
                                textAlign: "right",
                                color: "#374151",
                                fontWeight: "500",
                                borderBottom: "1px solid #F3F4F6",
                              }}
                            >
                              ₹{item.unitPrice?.toLocaleString() || "-"}
                            </td>
                            <td
                              style={{
                                padding: "16px",
                                textAlign: "right",
                                color: "#059669",
                                fontWeight: "600",
                                borderBottom: "1px solid #F3F4F6",
                              }}
                            >
                              ₹{item.totalPrice?.toLocaleString() || "-"}
                            </td>
                            <td
                              style={{
                                padding: "16px",
                                textAlign: "center",
                                borderBottom: "1px solid #F3F4F6",
                              }}
                            >
                              <span
                                style={{
                                  textTransform: "capitalize",
                                  color: "white",
                                  background:
                                    item.type === "medicine"
                                      ? "#059669"
                                      : item.type === "test"
                                      ? "#3B82F6"
                                      : item.type === "injection"
                                      ? "#F59E0B"
                                      : "#6B7280",
                                  fontWeight: "600",
                                  padding: "4px 12px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                }}
                              >
                                {item.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Total Amount */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #f5f5f5ff 0%, #f7f7f7ff 100%)",
                  color: "black",
                  padding: "20px",
                  borderRadius: "12px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-30px",
                    right: "-30px",
                    width: "100px",
                    height: "100px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                  }}
                ></div>
                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "14px",
                    opacity: 0.9,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontWeight: "600",
                  }}
                >
                  Total Amount
                </p>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "32px",
                    fontWeight: "700",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  ₹
                  {(
                    selectedBillDetails.total ||
                    selectedBillDetails.totalAmount ||
                    0
                  ).toLocaleString()}
                </h3>
              </div>

              {/* Print Footer */}
              <div className="print-only" style={{ display: "none" }}>
                <div
                  style={{
                    marginTop: "30px",
                    paddingTop: "15px",
                    borderTop: "2px solid #3B82F6",
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#6B7280",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px 0",
                      fontWeight: "600",
                      color: "#3B82F6",
                    }}
                  >
                    Thank you for choosing MediTrack
                  </p>
                  <p style={{ margin: 0 }}>
                    Wishing you good health! • For support: info@meditrack.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
