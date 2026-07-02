/**
 * ServiceConstant
 * 
 * Purpose:
 * Centralized constant declarations for backend API endpoints routed through the Gateway.
 * Maintaining URLs in a single place makes base path or route updates easier to manage.
 */

// Auth URLs
export const LOGINURL = 'gateway/auth/login';
export const VERIFYOTPURL = 'gateway/auth/verify-otp';


// Dashboard and Task URLs
export const DASHBOARDURL = 'gateway/taskmanager/dashboard/taskAnalytics';
export const GETALLTASKSURL = 'gateway/taskmanager/getTasks';
export const CHATBOTURL = 'gateway/taskmanager/aichat';