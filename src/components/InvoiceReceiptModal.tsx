import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Mail, Phone, MapPin, Award, Sparkles, Copy, Check } from 'lucide-react';
import { Order } from '../types.ts';
import { formatCustomization } from '../utils/customizationFormatter.ts';

interface InvoiceReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceReceiptModal({ order, isOpen, onClose }: InvoiceReceiptModalProps) {
  const [copied, setCopied] = React.useState(false);
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    // 1. Try dedicated iframe print to bypass preview container constraints
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice #${order.orderNumber} - The Velvet Cake Co.</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  color: #2D2926;
                  background: #FFFFFF;
                  padding: 30px;
                  margin: 0;
                }
                .invoice-box {
                  max-width: 800px;
                  margin: auto;
                  padding: 30px;
                  border: 1px solid #E8DFC8;
                  border-radius: 12px;
                }
                .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  border-bottom: 2px solid #7D0A0A;
                  padding-bottom: 20px;
                  margin-bottom: 25px;
                }
                .brand-title {
                  font-size: 26px;
                  font-family: Georgia, serif;
                  font-weight: bold;
                  color: #7D0A0A;
                  margin: 0;
                }
                .brand-sub {
                  font-size: 12px;
                  color: #8C6D4F;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                }
                .info-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px;
                  margin-bottom: 25px;
                  font-size: 13px;
                }
                .info-col h4 {
                  margin: 0 0 8px 0;
                  color: #7D0A0A;
                  font-size: 14px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 25px;
                  font-size: 13px;
                }
                th {
                  background-color: #FAF7F2;
                  color: #7D0A0A;
                  text-align: left;
                  padding: 10px;
                  border-bottom: 1px solid #E8DFC8;
                }
                td {
                  padding: 10px;
                  border-bottom: 1px solid #F4EBE1;
                }
                .total-section {
                  margin-left: auto;
                  width: 280px;
                  font-size: 13px;
                }
                .total-row {
                  display: flex;
                  justify-content: space-between;
                  padding: 6px 0;
                }
                .grand-total {
                  font-size: 18px;
                  font-weight: bold;
                  color: #7D0A0A;
                  border-top: 2px solid #7D0A0A;
                  padding-top: 8px;
                  margin-top: 6px;
                }
                .footer {
                  margin-top: 35px;
                  text-align: center;
                  font-size: 11px;
                  color: #8C6D4F;
                  border-top: 1px dashed #E8DFC8;
                  padding-top: 15px;
                }
                .stamp {
                  display: inline-block;
                  padding: 4px 12px;
                  border: 2px solid #10B981;
                  color: #10B981;
                  font-weight: bold;
                  border-radius: 6px;
                  text-transform: uppercase;
                  font-size: 12px;
                  margin-top: 10px;
                }
                @media print {
                  body { padding: 0; }
                  .invoice-box { border: none; }
                }
              </style>
            </head>
            <body>
              <div class="invoice-box">
                <div class="header">
                  <div>
                    <h1 class="brand-title">The Velvet Cake Co.</h1>
                    <div class="brand-sub">Bespoke Artisanal Patisserie & Bakery</div>
                    <div style="font-size: 12px; color: #6E5A4E; margin-top: 6px;">
                      245 Lexington Avenue, New York, NY 10016<br/>
                      Executive Master Patissier: Rana Amir Shahzad<br/>
                      Email: ranaamirshahzad630@gmail.com | Phone: +1 (212) 555-CAKE
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 20px; font-weight: bold; color: #2D2926;">INVOICE</div>
                    <div style="font-size: 13px; font-family: monospace; color: #7D0A0A; font-weight: bold;">
                      #${order.orderNumber}
                    </div>
                    <div style="font-size: 12px; color: #6E5A4E; margin-top: 4px;">
                      Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}<br/>
                      Payment: ${order.paymentMethod || 'Credit Card (Paid)'}
                    </div>
                    <div class="stamp">PAID & CONFIRMED</div>
                  </div>
                </div>

                <div class="info-grid">
                  <div class="info-col">
                    <h4>Billed & Delivered To:</h4>
                    <strong>${order.customerName}</strong><br/>
                    Email: ${order.customerEmail}<br/>
                    Phone: ${order.customerPhone || 'N/A'}<br/>
                    ${order.deliveryAddress ? `Address: ${order.deliveryAddress}` : ''}
                  </div>
                  <div class="info-col">
                    <h4>Delivery & Fulfillment:</h4>
                    <strong>Method:</strong> ${order.deliveryMethod?.replace(/_/g, ' ')}<br/>
                    <strong>Scheduled Date:</strong> ${new Date(order.preferredDate).toLocaleDateString()}<br/>
                    <strong>Status:</strong> ${order.orderStatus}
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th style="text-align: center;">Qty</th>
                      <th style="text-align: right;">Unit Price</th>
                      <th style="text-align: right;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.orderItems?.map(item => {
                      const customStr = formatCustomization(item.customization);
                      return `
                      <tr>
                        <td>
                          <strong>${item.product?.name || 'Artisan Patisserie Item'}</strong>
                          ${customStr ? `<div style="font-size: 11px; color: #8C6D4F; margin-top: 2px;">• ${customStr}</div>` : ''}
                        </td>
                        <td style="text-align: center;">${item.quantity}</td>
                        <td style="text-align: right;">$${(item.unitPrice || 0).toFixed(2)}</td>
                        <td style="text-align: right;">$${((item.unitPrice || 0) * item.quantity).toFixed(2)}</td>
                      </tr>
                    `;
                    }).join('') || ''}
                  </tbody>
                </table>

                <div class="total-section">
                  <div class="total-row">
                    <span>Subtotal:</span>
                    <span>$${order.subtotal?.toFixed(2)}</span>
                  </div>
                  <div class="total-row">
                    <span>Delivery Courier Fee:</span>
                    <span>${order.deliveryFee === 0 ? 'COMPLIMENTARY' : `$${order.deliveryFee?.toFixed(2)}`}</span>
                  </div>
                  <div class="total-row grand-total">
                    <span>Grand Total Paid:</span>
                    <span>$${order.total?.toFixed(2)}</span>
                  </div>
                </div>

                <div class="footer">
                  Thank you for celebrating with The Velvet Cake Co. We cherish the opportunity to sweeten your special day.<br/>
                  For any modifications or inquiries, please contact our patisserie concierge at orders@thevelvetcakeco.com.
                </div>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        // Fallback to standard window.print()
        window.print();
      }
    } catch (e) {
      window.print();
    }
  };

  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="printable-invoice-dialog relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-8"
        >
          {/* Action Bar (Top Controls) */}
          <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#E8DFC8] flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-serif font-bold text-[#7D0A0A] text-sm sm:text-base">
                Official Digital Tax Invoice & Receipt
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-[#7D0A0A] hover:bg-[#5E0707] text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#6E5A4E] hover:text-[#7D0A0A] hover:bg-[#E8DFC8]/50 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div ref={printContentRef} className="p-6 sm:p-8 space-y-6 text-[#2D2926] bg-white printable-invoice-container">
            
            {/* Header / Brand */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-[#7D0A0A]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#7D0A0A] tracking-tight">
                    The Velvet Cake Co.
                  </span>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C6D4F] font-bold">
                  Bespoke Artisanal Patisserie
                </p>
                <p className="text-xs text-[#6E5A4E] leading-relaxed pt-1">
                  245 Lexington Avenue, New York, NY 10016<br />
                  Owner & Executive Pastry Chef: <strong className="text-[#2D2926]">Rana Amir Shahzad</strong><br />
                  Direct: ranaamirshahzad630@gmail.com | +1 (212) 555-CAKE
                </p>
              </div>

              <div className="sm:text-right space-y-1 bg-[#FAF7F2] sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none w-full sm:w-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D4F] block">
                  Official Invoice
                </span>
                <div className="flex sm:justify-end items-center gap-2">
                  <span className="font-mono font-bold text-[#7D0A0A] text-lg">
                    #{order.orderNumber}
                  </span>
                  <button
                    onClick={handleCopyInvoiceNumber}
                    className="p-1 text-[#8C6D4F] hover:text-[#7D0A0A] transition-colors no-print"
                    title="Copy Order Number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-[#6E5A4E]">
                  Issued: {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Payment Settled</span>
                </div>
              </div>
            </div>

            {/* Customer & Fulfillment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-[#FDFCF0] p-4 rounded-2xl border border-[#E8DFC8]">
              <div className="space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-[#7D0A0A] text-[11px] block">
                  Customer & Billing Info:
                </span>
                <p className="font-bold text-[#2D2926] text-sm">{order.customerName}</p>
                <p className="text-[#6E5A4E] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8C6D4F]" /> {order.customerEmail}
                </p>
                {order.customerPhone && (
                  <p className="text-[#6E5A4E] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8C6D4F]" /> {order.customerPhone}
                  </p>
                )}
                {order.deliveryAddress && (
                  <p className="text-[#6E5A4E] flex items-start gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8C6D4F] shrink-0 mt-0.5" />
                    <span>{order.deliveryAddress}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-[#7D0A0A] text-[11px] block">
                  Order & Schedule Details:
                </span>
                <p><strong className="text-[#2D2926]">Fulfillment:</strong> {order.deliveryMethod?.replace(/_/g, ' ')}</p>
                <p><strong className="text-[#2D2926]">Celebration Date:</strong> {new Date(order.preferredDate).toLocaleDateString()}</p>
                <p><strong className="text-[#2D2926]">Payment Method:</strong> {order.paymentMethod || 'Credit Card'}</p>
                <p><strong className="text-[#2D2926]">Preparation Status:</strong> <span className="font-semibold text-emerald-700">{order.orderStatus}</span></p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8DFC8] bg-[#FAF7F2] text-[#7D0A0A] uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Item Details</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EBE1]">
                  {order.orderItems?.map((item, idx) => {
                    const customDesc = formatCustomization(item.customization);
                    return (
                      <tr key={idx}>
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#2D2926] block">
                            {item.product?.name || 'Artisan Specialty Cake'}
                          </span>
                          {customDesc && (
                            <span className="text-[11px] text-[#8C6D4F] font-medium block pt-0.5">
                              ✦ {customDesc}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-medium text-[#2D2926]">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right text-[#6E5A4E]">
                          ${(item.unitPrice || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-[#2D2926]">
                          ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between text-[#6E5A4E]">
                  <span>Subtotal:</span>
                  <span className="font-medium text-[#2D2926]">${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6E5A4E]">
                  <span>Climate-Controlled Courier:</span>
                  <span className="font-medium text-[#2D2926]">
                    {order.deliveryFee === 0 ? 'FREE (Complimentary)' : `$${order.deliveryFee?.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#6E5A4E]">
                  <span>Sales Tax (NYC 8.875%):</span>
                  <span className="font-medium text-[#2D2926]">Included</span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-[#7D0A0A] font-bold text-sm text-[#7D0A0A]">
                  <span>Total Amount Paid:</span>
                  <span className="text-base">${order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer / Patisserie Guarantee */}
            <div className="border-t border-dashed border-[#E8DFC8] pt-4 text-center space-y-1 text-[11px] text-[#8C6D4F]">
              <p className="font-serif italic text-xs text-[#2D2926]">
                "Every celebration deserves something extraordinary."
              </p>
              <p>
                All items freshly baked with European cultured butter, Valrhona chocolate, and organic dairy.
              </p>
              <p className="text-[10px] text-[#A69080]">
                The Velvet Cake Co. • NYC License #NY-89421 • Lexington Avenue Patisserie Studio
              </p>
            </div>

          </div>

          {/* Bottom Actions for Mobile */}
          <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DFC8] flex justify-end gap-3 no-print">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#E8DFC8] text-xs font-semibold text-[#4A3B32] hover:bg-white transition-colors"
            >
              Close Window
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-full bg-[#7D0A0A] hover:bg-[#5E0707] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice Document</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
