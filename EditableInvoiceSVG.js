import React, { useState, useRef } from "react";

const EditableText = ({ x, y, fontSize, fill, initialText, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const handleDoubleClick = () => setEditing(true);
  const handleBlur = () => setEditing(false);
  const handleChange = (e) => {
    setText(e.target.value);
    onChange(e.target.value);
  };

  if (editing) {
    return (
      <foreignObject x={x} y={y - fontSize} width="260" height="40">
        <input
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            font: `${fontSize}px Arial`,
            background: "transparent",
            border: "none",
            outline: "none",
            width: "100%",
          }}
          autoFocus
        />
      </foreignObject>
    );
  }

  return (
    <text x={x} y={y} fontFamily="Arial" fontSize={fontSize} fill={fill} onDoubleClick={handleDoubleClick}>
      {text}
    </text>
  );
};

const EditableInvoiceSVG = () => {
  const [canvasUrl, setCanvasUrl] = useState("");
  const [svgUrl, setSvgUrl] = useState("");
  const svgRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const [invoiceData, setInvoiceData] = useState({
    companyName: "Company Name",
    addressLine1: "Address Line 1",
    cityStateZip: "City, State, ZIP",
    invoiceNumber: "12345",
    date: "2024-07-28",
    items: [
      { description: "Item 1", quantity: "2", price: "$10.00", total: "$20.00" },
      { description: "Item 2", quantity: "1", price: "$15.00", total: "$15.00" },
      { description: "Item 3", quantity: "3", price: "$7.00", total: "$21.00" },
      { description: "Item 4", quantity: "4", price: "$5.00", total: "$20.00" },
    ],
  });

  const updateInvoiceData = (key, value) => {
    setInvoiceData((prevData) => ({ ...prevData, [key]: value }));
  };

  const calculateItemTotal = (quantity, price) => {
    const qtyNumber = parseFloat(quantity) || 0;
    const priceNumber = parseFloat(price.replace("$", "")) || 0;
    return (qtyNumber * priceNumber).toFixed(2);
  };

  const updateItem = (index, field, value) => {
    setInvoiceData((prevData) => {
      const newItems = [...prevData.items];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === "quantity" || field === "price") {
        newItems[index].total = `$${calculateItemTotal(newItems[index].quantity, newItems[index].price)}`;
      }

      return { ...prevData, items: newItems };
    });
  };

  const calculateTotal = (items) => {
    return items
      .reduce((sum, item) => {
        const itemTotal = parseFloat(item.total.replace("$", "")) || 0;
        return sum + itemTotal;
      }, 0)
      .toFixed(2);
  };

  const addToCanva = async () => {
    setIsUploading(true);
    try {
      const svgElement = svgRef.current;

      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;

        // const svgData = new XMLSerializer().serializeToString(svgElement);
        // const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        // const url = URL.createObjectURL(svgBlob);
        // setSvgUrl(url);
        // Upload the SVG to Canva
        // const result = await upload({
        //   type: "IMAGE",
        //   mimeType: "image/svg+xml",
        //   url: dataUrl,
        // });

        // Add the uploaded image to the Canva design
        // await addNativeElement({
        //   type: "IMAGE",
        //   ref: result.ref,
        // });
        setSvgUrl(svgDataUrl);
        alert("3D successfully added to your Canva design!");
      }
    } catch (error) {
      console.error("Error adding to Canva:", error);
      alert("Failed to add 3D Text to Canva. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <svg ref={svgRef} width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#e0e0e0", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" />

        {/* <!-- Canva Logo --> */}
        <text x="20" y="20" font-family="Arial" font-size="24" font-weight="bold" fill="#7d2ae8">
          Canva
        </text>
        <circle cx="90" cy="10" r="8" fill="#00c4cc" />
  
        <EditableText x={20} y={40} fontSize={24} fill="#333" initialText="Invoice ||   Mycompany" onChange={(value) => {}} />

        <text x={20} y={60} fontFamily="Arial" fontSize={14} fill="#333">
          Invoice To:
        </text>
        <EditableText x={30} y={80} fontSize={14} fill="#555" initialText={invoiceData.companyName} onChange={(value) => updateInvoiceData("companyName", value)} />
        <EditableText x={30} y={100} fontSize={14} fill="#555" initialText={invoiceData.addressLine1} onChange={(value) => updateInvoiceData("addressLine1", value)} />
        <EditableText x={30} y={120} fontSize={14} fill="#555" initialText={invoiceData.cityStateZip} onChange={(value) => updateInvoiceData("cityStateZip", value)} />

        <EditableText x={400} y={80} fontSize={14} fill="#555" initialText={`Invoice #: ${invoiceData.invoiceNumber}`} onChange={(value) => updateInvoiceData("invoiceNumber", value.replace("Invoice #: ", ""))} />
        <EditableText x={400} y={100} fontSize={14} fill="#555" initialText={`Date: ${invoiceData.date}`} onChange={(value) => updateInvoiceData("date", value.replace("Date: ", ""))} />

        <rect x={15} y={150} width={570} height={30} fill="#333" rx={5} ry={5} />
        <text x={20} y={170} fontFamily="Arial" fontSize={14} fill="#fff">
          Item Description
        </text>
        <text x={400} y={170} fontFamily="Arial" fontSize={14} fill="#fff">
          Quantity
        </text>
        <text x={480} y={170} fontFamily="Arial" fontSize={14} fill="#fff">
          Price
        </text>
        <text x={540} y={170} fontFamily="Arial" fontSize={14} fill="#fff">
          Total
        </text>

        {invoiceData.items.map((item, index) => (
          <g key={index}>
            <rect x={15} y={180 + index * 30} width={570} height={30} fill={index % 2 === 0 ? "#abf128" : "#ffffff"} rx={5} ry={5} />
            <EditableText x={20} y={200 + index * 30} fontSize={14} fill="#555" initialText={item.description} onChange={(value) => updateItem(index, "description", value)} />
            <EditableText x={400} y={200 + index * 30} fontSize={14} fill="#555" initialText={item.quantity} onChange={(value) => updateItem(index, "quantity", value)} />
            <EditableText x={480} y={200 + index * 30} fontSize={14} fill="#555" initialText={item.price} onChange={(value) => updateItem(index, "price", value)} />
            <text x={540} y={200 + index * 30} fontFamily="Arial" fontSize={14} fill="#555">
              {item.total}
            </text>
          </g>
        ))}

        <text x={460} y={340} fontFamily="Arial" fontSize={16} fill="#000">
          Total:
        </text>
        <text x={540} y={340} fontFamily="Arial" fontSize={16} fill="#000">
          ${calculateTotal(invoiceData.items)}
        </text>
      </svg>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" onClick={addToCanva} style={{ marginTop: "20px" }}>
        Save svg as URL
      </button>
      {svgUrl && (
        <div>
          <h3>Canvas Data URL:</h3>
          <textarea readOnly value={svgUrl} rows={5} cols={50} />
          <a href={svgUrl} download="canvas-image.svg">
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

export default EditableInvoiceSVG;
