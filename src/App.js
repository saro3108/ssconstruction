import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  Divider,
  IconButton,
} from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CompanyLogo from "./1.png";

const App = () => {
  // Constant company details
  const company = {
    name: "Selvasri construction Ltd",
    address: "12 Markfield Drive, Flanderwell, Rotherham, S66 2JD",
    phone: "07721544675",
    email: "selva@selvasriconstruction.co.uk ",
  };

  // ✅ Editable states
  const [client, setClient] = useState({ name: "", address: "" });
  const [invoice, setInvoice] = useState({
    number: "",
    date: "",
    dueDate: "",
    vat: 20, 
  });

  const [items, setItems] = useState([{ description: "", quantity: 0, price: 0 }]);

  // ✅ Handle dynamic table rows
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "quantity" || field === "price" ? Number(value) : value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 0, price: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // ✅ Totals Calculation
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const vatAmount = (subtotal * invoice.vat) / 100;
  const grandTotal = subtotal + vatAmount;

  // ✅ Generate PDF
  const handleDownload = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // 🔹 Header Background
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 40, "F");

    // 🔹 Company Logo
    const img = new Image();
    img.src = CompanyLogo;
    doc.addImage(img, "PNG", 15, 8, 30, 24);

    // 🔹 Company Info
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(company.name, 50, 15);
    doc.setFontSize(10);
    doc.text(company.address, 50, 22);
    doc.text(`Phone: ${company.phone}`, 50, 27);
    doc.text(`Email: ${company.email}`, 50, 32);

    // 🔹 Invoice Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 160, 20);

    // 🔹 Client & Invoice Details
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("BILL TO:", 15, 50);
    doc.setFont("helvetica", "normal");
    doc.text(client.name || "______________", 15, 56);
    doc.text(client.address || "______________", 15, 61);

    doc.setFont("helvetica", "bold");
    doc.text("Invoice No:", 140, 50);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.number || "_____", 180, 50);

    doc.setFont("helvetica", "bold");
    doc.text("Invoice Date:", 140, 56);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.date || "_____", 180, 56);

    doc.setFont("helvetica", "bold");
    doc.text("Due Date:", 140, 61);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.dueDate || "_____", 180, 61);

    // 🔹 Invoice Table
    const tableColumn = ["S.No", "Description", "Qty", "Unit Price", "Total"];
    const tableRows = items.map((item, index) => [
      index + 1,
      item.description || "—",
      item.quantity,
      item.price.toFixed(2),
      (item.quantity * item.price).toFixed(2),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: "center",
      },
      bodyStyles: { valign: "middle" },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { halign: "center", cellWidth: 20 },
        1: { cellWidth: 80 },
        2: { halign: "center", cellWidth: 20 },
        3: { halign: "right", cellWidth: 30 },
        4: { halign: "right", cellWidth: 30 },
      },
    });

    // 🔹 Totals Section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 140, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(subtotal.toFixed(2), 180, finalY);

    doc.setFont("helvetica", "bold");
    doc.text(`VAT (${invoice.vat}%):`, 140, finalY + 7);
    doc.setFont("helvetica", "normal");
    doc.text(vatAmount.toFixed(2), 180, finalY + 7);

    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", 140, finalY + 14);
    doc.setFont("helvetica", "normal");
    doc.text(grandTotal.toFixed(2), 180, finalY + 14);

    // 🔹 Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 280, 195, 280);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Bank: HDFC Bank | A/C No: 123456789 | IFSC: HDFC000123", 15, 286);
    doc.text("Thank you for your business!", 15, 292);

    // ✅ Save PDF
    doc.save(`${invoice.number || "invoice"}.pdf`);
  };

  return (
    <Box sx={{ p: 4, maxWidth: "850px", mx: "auto", boxShadow: 3, bgcolor: "#fff", borderRadius: 2 }}>
      {/* Logo & Title */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <img src={CompanyLogo} alt="Company Logo" style={{ height: "60px" }} />
        <Typography variant="h5" fontWeight="bold">
          Tax Invoice
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Client Info */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            Bill To:
          </Typography>
          <TextField
            variant="standard"
            placeholder="Client Name"
            value={client.name}
            onChange={(e) => setClient({ ...client, name: e.target.value })}
            sx={{ mb: 1, width: "250px" }}
          />
          <TextField
            variant="standard"
            placeholder="Client Address"
            value={client.address}
            onChange={(e) => setClient({ ...client, address: e.target.value })}
            sx={{ width: "250px" }}
          />
        </Box>

        <Box>
          <TextField
            label="Invoice No"
            variant="standard"
            placeholder="INV-001"
            value={invoice.number}
            onChange={(e) => setInvoice({ ...invoice, number: e.target.value })}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Invoice Date"
            variant="standard"
            type="date"
            value={invoice.date}
            onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
            sx={{ mb: 1, ml: 2 }}
          />
          <TextField
            label="Due Date"
            variant="standard"
            type="date"
            value={invoice.dueDate}
            onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
            sx={{ ml: 2 }}
          />
          <TextField
            label="VAT (%)"
            variant="standard"
            type="number"
            value={invoice.vat}
            onChange={(e) => setInvoice({ ...invoice, vat: e.target.value })}
            sx={{ ml: 2 }}
          />
        </Box>
      </Box>

      {/* Items Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Total</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  variant="standard"
                  placeholder="Item Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  variant="standard"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  variant="standard"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", e.target.value)}
                />
              </TableCell>
              <TableCell>{(item.quantity * item.price).toFixed(2)}</TableCell>
              <TableCell>
                <IconButton onClick={() => removeItem(index)} color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={5}>
              <Button startIcon={<AddCircle />} onClick={addItem} variant="outlined" color="primary">
                Add Item
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Download Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleDownload}>
          Download PDF
        </Button>
      </Box>
    </Box>
  );
};

export default App;
