import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { CheckCircle, ShoppingBag, Print } from '@mui/icons-material';

const ReceiptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receipt = location.state?.receipt;

  if (!receipt) {
    return (
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            No receipt found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handlePrintBill = () => {
    // Generate bill content
    const billContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vibe Commerce - Bill ${receipt.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #1976d2; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { color: #1976d2; font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .bill-title { font-size: 24px; font-weight: bold; color: #333; }
            .order-info { margin: 30px 0; }
            .order-info table { width: 100%; border-collapse: collapse; }
            .order-info td { padding: 10px; border-bottom: 1px solid #eee; }
            .order-info td:first-child { font-weight: bold; width: 30%; }
            .items-section { margin: 30px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .items-table th { background-color: #f5f5f5; font-weight: bold; }
            .total-section { margin-top: 30px; text-align: right; }
            .total-amount { font-size: 24px; font-weight: bold; color: #2e7d32; }
            .footer { margin-top: 50px; text-align: center; color: #666; font-size: 14px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Vibe Commerce</div>
            <div class="bill-title">INVOICE / RECEIPT</div>
          </div>
          
          <div class="order-info">
            <table>
              <tr>
                <td>Order ID:</td>
                <td>${receipt.orderId || 'N/A'}</td>
              </tr>
              <tr>
                <td>Customer Name:</td>
                <td>${receipt.customerName || 'N/A'}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>${receipt.customerEmail || 'N/A'}</td>
              </tr>
              <tr>
                <td>Order Date:</td>
                <td>${receipt.orderDate ? new Date(receipt.orderDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}</td>
              </tr>
            </table>
          </div>
          
          <div class="items-section">
            <h3>Items Ordered</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${receipt.items && receipt.items.length > 0 ? 
                  receipt.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.qty}</td>
                      <td>$${item.price?.toFixed(2) || '0.00'}</td>
                      <td>$${((item.qty || 0) * (item.price || 0)).toFixed(2)}</td>
                    </tr>
                  `).join('') : 
                  '<tr><td colspan="4">No items found</td></tr>'
                }
              </tbody>
            </table>
          </div>
          
          <div class="total-section">
            <div class="total-amount">Total Amount: $${receipt.total?.toFixed(2) || '0.00'}</div>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with Vibe Commerce!</p>
            <p>This is a computer-generated receipt.</p>
          </div>
        </body>
      </html>
    `;

    // Create a new window with the bill content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(billContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      printWindow.print();
      // Optional: Close the window after printing
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'success.main' }}>
            Order Confirmed!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Thank you for your purchase. Your order has been successfully processed.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Receipt Details */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Order Details
          </Typography>
          
          <List>
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary="Order ID" 
                secondary={receipt.orderId || 'N/A'} 
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary="Customer Name" 
                secondary={receipt.customerName || 'N/A'} 
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary="Email" 
                secondary={receipt.customerEmail || 'N/A'} 
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary="Total Amount" 
                secondary={`$${receipt.total?.toFixed(2) || '0.00'}`} 
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary="Order Date" 
                secondary={receipt.orderDate ? new Date(receipt.orderDate).toLocaleDateString() : 'N/A'} 
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Items */}
        {receipt.items && receipt.items.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Items Ordered
            </Typography>
            
            <List>
              {receipt.items.map((item, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.qty} × $${item.price?.toFixed(2) || '0.00'}`}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ${((item.qty || 0) * (item.price || 0)).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Print />}
            onClick={handlePrintBill}
            sx={{ px: 4 }}
          >
            Print Bill
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBag />}
            onClick={handleContinueShopping}
            sx={{ px: 4 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

ReceiptPage.propTypes = {
  // Props are passed via location.state
};

export default ReceiptPage;