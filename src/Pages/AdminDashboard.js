import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import AdminTaskbar from '../components/AdminTaskbar';
import ReportsList from '../components/ReportsList';
import '../cssFolder/AdminDashboard.css';

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentFirst, setRecentFirst] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    const token = localStorage.getItem('token'); // Get token

    if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
    }

    // Fetch from the new API endpoint
    fetch("http://141.147.83.47:8083/api/violence-notifications", {
        headers: {
            'Authorization': `Bearer ${token}`, // Add Authorization header
            'Accept': 'application/json', // Optional: Specify expected response type
        }
    })
      .then((res) => {
          if (!res.ok) {
              // Handle HTTP errors (e.g., 401 Unauthorized, 404 Not Found, 500 Server Error)
              throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
      })
      .then((data) => {
        // Access the reports from the 'violence_notifications' key
        const fetchedReports = data.violence_notifications || [];
        console.log("Fetched Reports:", fetchedReports); // Log raw fetched data

        // Add a default 'isRead: false' status locally if not provided by API
        const reportsWithReadStatus = fetchedReports.map(r => ({
            ...r,
            isRead: r.isRead === undefined ? false : r.isRead // Assume false if not present
        }));

        // Filter using the correct field name 'camera_num'
        const filtered = reportsWithReadStatus.filter(r => r.camera_num >= 1 && r.camera_num <= 4);
        console.log("Filtered Reports:", filtered); // Log after filtering

        // Sort using the correct field name 'created_at'
        // Create a new sorted array to avoid mutating state directly
        const sorted = recentFirst
          ? [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          : filtered;
        console.log("Sorted Reports (before setting state):", sorted); // Log final data before setReports

        setReports(sorted);
        // Calculate unread count based on the locally managed 'isRead' status
        const unread = sorted.filter(r => !r.isRead);
        setUnreadCount(unread.length);
      })
      .catch((err) => {
          console.error("Failed to fetch reports:", err);
          setError(`Failed to load reports: ${err.message}`); // Set error state
      })
      .finally(() => {
          setLoading(false); // Stop loading regardless of success or error
      });
  }, [recentFirst]); // Re-fetch when sorting preference changes

  const markAsRead = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Cannot mark as read: No token found.");
        setError("Authentication error. Please log in again."); // Show error to user
        return;
    }

    // Find the report to prevent decrementing count if already read or not found
    const reportToUpdate = reports.find(r => r.id === id);
    if (!reportToUpdate || reportToUpdate.isRead) {
        // console.log(`Report ${id} is already marked as read or not found.`);
        return; // Don't proceed if already read or not found
    }

    // Update locally first using the correct ID field 'id'
    setReports(prev =>
      prev.map(r =>
        r.id === id ? { ...r, isRead: true } : r
      )
    );
    // Only decrement count if it was actually unread
    setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));

    // --- Backend Update (Needs Verification) ---
    // NOTE: This assumes a PATCH endpoint exists at /api/violence-notifications/{id}
    //       and accepts { "isRead": true } or similar. Confirm with backend.
    // console.warn(`Attempting to PATCH report ${id} as read. Ensure backend endpoint exists and supports this.`);
    fetch(`http://141.147.83.47:8083/api/violence-notifications/${id}`, { // Use the correct ID and base URL
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`, // Add Authorization header
        'Accept': 'application/json',
      },
      body: JSON.stringify({ isRead: true }), // Assuming backend expects 'isRead'
    })
      .then((res) => {
        if (!res.ok) {
          // If update fails, revert local state and show error
          console.error(`Failed to update report ${id} on server: ${res.status}`);
          setReports(prev => prev.map(r => r.id === id ? { ...r, isRead: false } : r)); // Revert local state
          setUnreadCount(prev => prev + 1); // Increment count back
          setError(`Failed to mark report ${id} as read on server. Please try again.`); // Show error
          throw new Error(`Server failed to mark report ${id} as read.`);
        }
        console.log(`Report ${id} successfully marked as read on server.`);
        setError(null); // Clear error on success
        // Optionally re-fetch data here to ensure consistency, or trust local state
      })
      .catch((err) => {
        console.error("Failed to update report on server:", err);
        // Error state is already set in the .then block if !res.ok
        // If the fetch itself fails (network error), the state is already reverted above.
      });
  };

  // --- Render Logic ---
  // Handle loading and error states
  if (loading) {
      // You might want a more sophisticated loading indicator
      return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>Loading reports...</div>;
  }

  // Display error prominently if one occurred
  if (error) {
      return <div style={{ color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', margin: '20px' }}>Error: {error}</div>;
  }

  return (
    <div>
      <AdminTaskbar unreadCount={unreadCount} />
      {/* Add a log here to see the prop being passed */}
      {console.log("Rendering ReportsList with reports:", reports)}
      <ReportsList
        reports={reports}
        // setReports={setReports} // Pass setReports only if ReportsList needs to modify the whole list directly
        markAsRead={markAsRead}
        recentFirst={recentFirst}
        setRecentFirst={setRecentFirst}
      />
      <Footer />
    </div>
  );
}

export default AdminDashboard;
