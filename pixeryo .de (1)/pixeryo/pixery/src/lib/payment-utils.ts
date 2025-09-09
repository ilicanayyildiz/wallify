import { supabaseAdmin } from './supabase';

/**
 * Logs a payment operation to track processing
 */
export async function logPaymentOperation(data: {
  operation_type: string;
  reference_no: string;
  user_id: string;
  details?: any;
  status: string;
}) {
  try {
    const { operation_type, reference_no, user_id, details, status } = data;
    
    await supabaseAdmin.from('operation_logs').insert({
      operation_type,
      reference_no,
      user_id,
      details,
      status,
    });
    
    console.log(`Logged ${operation_type} for ${reference_no} with status ${status}`);
  } catch (error) {
    console.error('Failed to log payment operation:', error);
  }
}

/**
 * Generates a unique reference number for payments
 */
export function generateReferenceNumber() {
  return `PIX${Date.now()}${Math.floor(Math.random() * 10000)}`;
} 