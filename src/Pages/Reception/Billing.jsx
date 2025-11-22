import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReceptionBilling = () => {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [billDate, setBillDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [consultancyFee, setConsultancyFee] = useState(0);
  const [medicines, setMedicines] = useState([
    { name: "", quantity: 1, rate: 0 },
  ]);
  const [tests, setTests] = useState([{ name: "", rate: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [notes, setNotes] = useState("");
  const [savedBills, setSavedBills] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchPatientName = async (pid) => {
    if (!pid) {
      setPatientName("");
      return;
    }
    try {
      const res = await axios.get(
        `https://billing-backend-0zk0.onrender.com/api/patient/${pid}`
      );
      console.log("Fetched patient:", res.data);
      if (res.data && res.data.name) setPatientName(res.data.name);
      else setPatientName("");
    } catch (error) {
      setPatientName("");
    }
  };

  // Fetch bill using patientId and (optionally) patient name
  const fetchBillByPatientId = async (enteredPatientId) => {
    if (!enteredPatientId) return;
    try {
      const res = await axios.get(
        `https://billing-backend-0zk0.onrender.com/api/billing/${enteredPatientId}`
      );
      if (res.data && res.data.success && res.data.data) {
        const billing = res.data.data;

        if (billing.patientName) setPatientName(billing.patientName);
        else fetchPatientName(enteredPatientId);

        setConsultancyFee(0);

        setMedicines(
          (billing.medicines || []).map((item) => ({
            name: item.medicineName,
            quantity: item.quantity,
            rate: item.unitPrice,
          }))
        );

        setTests(
          (billing.tests || []).map((item) => ({
            name: item.medicineName,
            rate: item.unitPrice,
          }))
        );
        setDiscount((billing.discount / billing.subtotal) * 100 || 0);
        setBillDate(
          billing.createdAt
            ? new Date(billing.createdAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0]
        );
      } else {
        toast.info("No billing found for this patient ID");
        resetForm();
      }
    } catch (error) {
      toast.error("Failed to fetch billing data!");
      resetForm();
    }
  };

  // Medicines
  const handleMedicinesChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = field === "name" ? value : parseFloat(value) || 0;
    setMedicines(updated);
  };
  const addMedicine = () =>
    setMedicines([...medicines, { name: "", quantity: 1, rate: 0 }]);
  const removeMedicine = (index) =>
    setMedicines(medicines.filter((_, i) => i !== index));

  // Tests
  const handleTestsChange = (index, field, value) => {
    const updated = [...tests];
    updated[index][field] = field === "name" ? value : parseFloat(value) || 0;
    setTests(updated);
  };
  const addTest = () => setTests([...tests, { name: "", rate: 0 }]);
  const removeTest = (index) => setTests(tests.filter((_, i) => i !== index));

  const medicinesSubtotal = medicines.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const testsSubtotal = tests.reduce((sum, item) => sum + item.rate, 0);
  const subtotal = medicinesSubtotal + testsSubtotal + consultancyFee;
  const discountAmount = (discount / 100) * subtotal;
  const taxAmount = 0.1 * (subtotal - discountAmount);
  const total = subtotal - discountAmount + taxAmount;

  const resetForm = () => {
    setPatientId("");
    setPatientName("");
    setBillDate(new Date().toISOString().split("T")[0]);
    setConsultancyFee(0);
    setMedicines([{ name: "", quantity: 1, rate: 0 }]);
    setTests([{ name: "", rate: 0 }]);
    setDiscount(0);
    setPaymentMethod("Cash");
    setNotes("");
  };

  const saveBill = () => {
    const bill = {
      id: Date.now(),
      patientId,
      patientName,
      billDate,
      consultancyFee,
      items: [...medicines, ...tests].filter((item) => item.name.trim() !== ""),
      discount,
      paymentMethod,
      notes,
      medicines: medicines.filter((item) => item.name.trim() !== ""),
      tests: tests.filter((item) => item.name.trim() !== ""),
      medicinesSubtotal,
      testsSubtotal,
      subtotal,
      discountAmount,
      taxAmount,
      total,
      timestamp: new Date().toLocaleString(),
    };
setSavedBills((prevBills) => [...prevBills, bill]);

    resetForm();
    toast.success("Bill saved successfully!");
  };

  const processPayment = () => {
    if (!patientId || !patientName) {
      toast.error("Please fill in patient details before processing payment!");
      return;
    }
    if (total <= 0) {
      toast.error("Total amount must be greater than 0!");
      return;
    }
    toast.success(
      `Payment of ₹${total.toFixed(
        2
      )} processed successfully via ${paymentMethod}!`
    );
  };

  const predefinedServices = [
    { name: "Blood Test", rate: 300 },
    { name: "X-Ray", rate: 800 },
    { name: "ECG", rate: 200 },
    { name: "Ultrasound", rate: 1200 },
    { name: "Medicine", rate: 150 },
    { name: "Lab Report", rate: 250 },
  ];

  const predefinedFees = [
    { label: "General Consultation", fee: 500 },
    { label: "Specialist Consultation", fee: 750 },
  ];

  const quickAddMedicine = (service) => {
    const newItem = { name: service.name, quantity: 1, rate: service.rate };
    setMedicines([...medicines, newItem]);
  };
  const quickAddTest = (service) => {
    const newItem = { name: service.name, rate: service.rate };
    setTests([...tests, newItem]);
  };

  const selectFee = (feeOption) => {
    setConsultancyFee(feeOption.fee);
  };

  return (
    <div>
      <ToastContainer />
      {/* Header */}
      {showHistory && (
        <div style={styles.historySection}>
          <h3 style={styles.sectionTitle}>📋 Billing History</h3>
          {savedBills.length === 0 ? (
            <p style={styles.emptyHistory}>No bills saved yet.</p>
          ) : (
            <div style={styles.historyList}>
              {savedBills.map((bill) => (
                <div
                  key={bill.id}
                  style={styles.historyItem}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div style={styles.historyHeader}>
                    <strong>{bill.patientName || "Unknown Patient"}</strong>
                    <span style={styles.historyDate}>{bill.timestamp}</span>
                  </div>
                  <div style={styles.historyDetails}>
                    <span>ID: {bill.patientId}</span>
                    <span>Total: ₹{bill.total.toFixed(2)}</span>
                    <span>Method: {bill.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Single Unified Card */}
      <div style={styles.unifiedCard}>
        {/* Patient Information */}
        <div style={styles.cardSection}>
          <h3 style={styles.sectionTitle}>👤 Patient Information</h3>
          <div style={styles.inputGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Patient ID:</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onBlur={() => fetchBillByPatientId(patientId)}
                style={styles.input}
                placeholder="Enter patient ID"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlurCapture={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Patient Name:</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                style={styles.input}
                placeholder="Enter patient name"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Bill Date:</label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>
        </div>

        {/* Doctor Consultancy Section */}
        <div style={styles.cardSection}>
          <h3 style={styles.sectionTitle}>👨‍⚕️ Doctor Consultancy</h3>
          <div style={styles.doctorSection}>
            <div style={styles.quickDoctors}>
              <label style={styles.label}>
                Quick Select Consultation Type:
              </label>
              <div style={styles.doctorButtons}>
                {predefinedFees.map((feeOption, index) => (
                  <button
                    key={index}
                    onClick={() => selectFee(feeOption)}
                    style={styles.quickDoctorBtn}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 12px 35px rgba(16, 185, 129, 0.35)";
                      e.target.style.background =
                        "linear-gradient(135deg, #059669, #047857)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 8px 25px rgba(16, 185, 129, 0.25)";
                      e.target.style.background =
                        "linear-gradient(135deg, #10b981, #059669)";
                    }}
                  >
                    {feeOption.label} (₹{feeOption.fee})
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Consultancy Fee (₹):</label>
                <input
                  type="number"
                  value={consultancyFee}
                  onChange={(e) =>
                    setConsultancyFee(parseFloat(e.target.value) || 0)
                  }
                  style={styles.input}
                  placeholder="Enter consultancy fee"
                  min="0"
                  step="0.01"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Medicines Section */}
        <div style={styles.cardSection}>
          <h3 style={styles.sectionTitle}>💊 Medicines</h3>
          {medicines.map((item, index) => (
            <div key={index} style={styles.itemRow}>
              <input
                type="text"
                placeholder="Medicine name"
                value={item.name}
                onChange={(e) =>
                  handleMedicinesChange(index, "name", e.target.value)
                }
                style={styles.itemInput}
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  handleMedicinesChange(index, "quantity", e.target.value)
                }
                style={styles.qtyInput}
                min="1"
              />
              <input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) =>
                  handleMedicinesChange(index, "rate", e.target.value)
                }
                style={styles.rateInput}
                min="0"
                step="0.01"
              />
              <span style={styles.amount}>
                ₹{(item.quantity * item.rate).toFixed(2)}
              </span>
              <button
                onClick={() => removeMedicine(index)}
                style={styles.removeBtn}
                disabled={medicines.length === 1}
              >
                ❌
              </button>
            </div>
          ))}
          <button onClick={addMedicine} style={styles.addBtn}>
            ➕ Add Medicine
          </button>
        </div>

        {/* Tests Section */}
        <div style={styles.cardSection}>
          <h3 style={styles.sectionTitle}>🧪 Tests</h3>
          {tests.map((item, index) => (
            <div key={index} style={styles.itemRow}>
              <input
                type="text"
                placeholder="Test name"
                value={item.name}
                onChange={(e) =>
                  handleTestsChange(index, "name", e.target.value)
                }
                style={styles.itemInput}
              />
              <input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) =>
                  handleTestsChange(index, "rate", e.target.value)
                }
                style={styles.rateInput}
                min="0"
                step="0.01"
              />
              <span style={styles.amount}>₹{item.rate.toFixed(2)}</span>
              <button
                onClick={() => removeTest(index)}
                style={styles.removeBtn}
                disabled={tests.length === 1}
              >
                ❌
              </button>
            </div>
          ))}
          <button onClick={addTest} style={styles.addBtn}>
            ➕ Add Test
          </button>
        </div>

        {/* Payment Section */}
        <div style={styles.cardSection}>
          <h3 style={styles.sectionTitle}>💳 Payment Details</h3>
          <div style={styles.paymentGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Discount (%):</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                style={styles.input}
                min="0"
                max="100"
                step="0.1"
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Payment Method:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="Cash">💵 Cash</option>
                <option value="Card">💳 Card</option>
                <option value="UPI">📱 UPI</option>
                <option value="Insurance">🏥 Insurance</option>
              </select>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={styles.textarea}
              placeholder="Additional notes or remarks..."
              rows="3"
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Bill Summary */}
        <div style={styles.cardSection}>
          <h3 style={styles.summaryTitle}>💰 Bill Summary</h3>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryLeft}>
              <div style={styles.summaryRow}>
                <span>Doctor Consultancy:</span>
                <span>₹{consultancyFee.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Medicines:</span>
                <span>₹{medicinesSubtotal.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Tests:</span>
                <span>₹{testsSubtotal.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div style={styles.summaryRow}>
                <span>Discount ({discount}%):</span>
                <span style={styles.discount}>
                  -₹{discountAmount.toFixed(2)}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span>Tax (10%):</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div style={styles.totalRow}>
                <span>Total Amount:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <div style={styles.summaryRight}>
              <button
                onClick={saveBill}
                style={styles.saveBtn}
                disabled={!patientId || !patientName}
                onMouseEnter={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow =
                      "0 15px 40px rgba(102, 126, 234, 0.5)";
                    e.target.style.background =
                      "linear-gradient(135deg, #764ba2, #667eea)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 10px 30px rgba(102, 126, 234, 0.4)";
                    e.target.style.background =
                      "linear-gradient(135deg, #667eea, #764ba2)";
                  }
                }}
              >
                💾 Save Bill
              </button>
              <button
                style={styles.payBtn}
                onClick={processPayment}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow =
                    "0 15px 40px rgba(16, 185, 129, 0.5)";
                  e.target.style.background =
                    "linear-gradient(135deg, #059669, #047857)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 10px 30px rgba(16, 185, 129, 0.4)";
                  e.target.style.background =
                    "linear-gradient(135deg, #10b981, #059669)";
                }}
              >
                🎯 Process Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    maxWidth: "1400px",
    margin: "0 auto",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    minHeight: "100vh",
    color: "#333",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    padding: "20px 30px",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    flexWrap: "wrap",
    gap: "15px",
  },
  title: {
    margin: 0,
    fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)",
    background: "linear-gradient(135deg, #667eea, #764ba2, #f093fb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "800",
    textAlign: "center",
    flex: "1 1 auto",
    letterSpacing: "-0.02em",
  },
  headerButtons: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  historyBtn: {
    backgroundColor: "linear-gradient(135deg, #667eea, #764ba2)",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
    transform: "translateY(0)",
  },
  resetBtn: {
    backgroundColor: "#64748b",
    background: "linear-gradient(135deg, #64748b, #94a3b8)",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
    boxShadow: "0 8px 25px rgba(100, 116, 139, 0.3)",
    transform: "translateY(0)",
  },
  historySection: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    padding: "25px",
    borderRadius: "20px",
    marginBottom: "25px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  historyList: {
    maxHeight: "350px",
    overflowY: "auto",
    paddingRight: "10px",
  },
  historyItem: {
    padding: "20px",
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    borderRadius: "15px",
    marginBottom: "15px",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
    cursor: "pointer",
  },
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    flexWrap: "wrap",
    gap: "8px",
  },
  historyDate: {
    fontSize: "0.9rem",
    color: "#64748b",
    fontWeight: "500",
  },
  historyDetails: {
    display: "flex",
    gap: "15px",
    fontSize: "0.9rem",
    color: "#64748b",
    flexWrap: "wrap",
    fontWeight: "500",
  },
  emptyHistory: {
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
    fontSize: "1.1rem",
    padding: "30px",
  },
  unifiedCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    padding: "40px",
    borderRadius: "25px",
    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.15)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    position: "relative",
    overflow: "hidden",
  },
  cardSection: {
    marginBottom: "35px",
    paddingBottom: "25px",
    borderBottom: "2px solid rgba(102, 126, 234, 0.1)",
    position: "relative",
  },
  sectionTitle: {
    margin: "0 0 25px 0",
    fontSize: "clamp(1.3rem, 3.5vw, 1.6rem)",
    fontWeight: "700",
    color: "#1e293b",
    paddingBottom: "15px",
    borderBottom: "3px solid transparent",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    position: "relative",
  },
  doctorSection: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  quickDoctors: {
    marginBottom: "20px",
  },
  doctorButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },
  quickDoctorBtn: {
    padding: "15px 20px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    boxShadow: "0 8px 25px rgba(16, 185, 129, 0.25)",
    transform: "translateY(0)",
  },
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#374151",
    fontSize: "15px",
    letterSpacing: "0.01em",
  },
  input: {
    width: "100%",
    padding: "15px 18px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "15px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    fontFamily: "inherit",
  },
  select: {
    width: "100%",
    padding: "15px 18px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "15px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    padding: "15px 18px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "15px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    minHeight: "100px",
  },
  quickServices: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
  },
  quickServiceBtn: {
    padding: "15px 18px",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.25)",
    transform: "translateY(0)",
  },
  itemsContainer: {
    maxHeight: "450px",
    overflowY: "auto",
    paddingRight: "10px",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px",
    padding: "18px",
    background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
    borderRadius: "15px",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    flexWrap: "wrap",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
  },
  itemInput: {
    flex: "2 1 140px",
    minWidth: "120px",
    padding: "12px 15px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    transition: "all 0.3s ease",
    backgroundColor: "white",
    fontFamily: "inherit",
  },
  qtyInput: {
    flex: "0 1 70px",
    minWidth: "60px",
    padding: "12px 15px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    transition: "all 0.3s ease",
    backgroundColor: "white",
    textAlign: "center",
    fontFamily: "inherit",
  },
  rateInput: {
    flex: "1 1 90px",
    minWidth: "80px",
    padding: "12px 15px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    transition: "all 0.3s ease",
    backgroundColor: "white",
    fontFamily: "inherit",
  },
  amount: {
    flex: "1 1 90px",
    fontWeight: "700",
    color: "#059669",
    fontSize: "16px",
    textAlign: "center",
    minWidth: "80px",
    padding: "8px",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: "8px",
  },
  removeBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
    transform: "translateY(0)",
  },
  addBtn: {
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    border: "none",
    padding: "15px 25px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    width: "100%",
    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.25)",
    transform: "translateY(0)",
  },
  paymentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },
  summaryTitle: {
    margin: "0 0 25px 0",
    fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)",
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    alignItems: "start",
  },
  summaryLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "25px",
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    borderRadius: "15px",
    border: "1px solid rgba(226, 232, 240, 0.8)",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    fontSize: "16px",
    borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
    fontWeight: "500",
    color: "#374151",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 0",
    fontSize: "clamp(18px, 3.5vw, 24px)",
    fontWeight: "800",
    borderTop: "3px solid #667eea",
    borderBottom: "none",
    color: "#1e293b",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginTop: "15px",
  },
  discount: {
    color: "#ef4444",
    fontWeight: "700",
  },
  summaryRight: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  saveBtn: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    padding: "18px 25px",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    width: "100%",
    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
    transform: "translateY(0)",
    letterSpacing: "0.5px",
  },
  payBtn: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    padding: "18px 25px",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    width: "100%",
    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
    transform: "translateY(0)",
    letterSpacing: "0.5px",
  },
};


export default ReceptionBilling;
