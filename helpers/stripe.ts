import axios from "axios";

export const navigateToPortal = async (session: any) => {
  if (!session) {
    alert('You need to log in to manage your account.');
    return;
  }

  try {
    const response = await axios.post(
      '/api/stripe/create-customer-portal-session'
    );
    // Redirect the user to the portal
    window.location.href = response.data.url;
  } catch (error: any) {
    console.error('Error navigating to customer portal:', error.message);
    alert('Failed to navigate to the customer portal. Please try again.');
  }
  return;
};
